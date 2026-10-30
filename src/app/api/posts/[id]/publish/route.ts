import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { publishToYouTube } from "@/lib/platforms/youtube"
import { publishToInstagram } from "@/lib/platforms/instagram"
import { publishToFacebook } from "@/lib/platforms/facebook"
import { publishToTikTok } from "@/lib/platforms/tiktok"

// POST /api/posts/[id]/publish - Instant publish
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 })
    }

    const { id } = await params

    const post = await db.post.findUnique({
      where: { id },
      include: {
        media: { include: { media: true } },
        platforms: { include: { socialAccount: true } },
      },
    })

    if (!post || post.userId !== session.user.id) {
      return NextResponse.json({ error: "Postingan tidak ditemukan" }, { status: 404 })
    }

    await db.post.update({
      where: { id: post.id },
      data: { status: "PUBLISHING" },
    })

    const mediaUrls = post.media.map((pm) => pm.media.url)
    let allSuccessful = true

    for (const pp of post.platforms) {
      const account = pp.socialAccount
      if (!account.isActive) continue

      let result = { success: false, platformPostId: "", error: "" }
      const publishPayload = {
        content: post.content,
        mediaUrls,
        accessToken: account.accessToken,
        refreshToken: account.refreshToken || undefined,
        platformUserId: account.platformUserId,
      }

      if (account.platform === "YOUTUBE") {
        result = await publishToYouTube(publishPayload) as any
      } else if (account.platform === "INSTAGRAM") {
        result = await publishToInstagram(publishPayload) as any
      } else if (account.platform === "FACEBOOK") {
        result = await publishToFacebook(publishPayload) as any
      } else if (account.platform === "TIKTOK") {
        result = await publishToTikTok(publishPayload) as any
      }

      if (result.success) {
        await db.postPlatform.update({
          where: { id: pp.id },
          data: {
            status: "PUBLISHED",
            platformPostId: result.platformPostId,
            publishedAt: new Date(),
          },
        })
      } else {
        allSuccessful = false
        await db.postPlatform.update({
          where: { id: pp.id },
          data: {
            status: "FAILED",
            errorMessage: result.error || "Gagal posting ke platform",
          },
        })
      }
    }

    const updatedPost = await db.post.update({
      where: { id: post.id },
      data: {
        status: allSuccessful ? "PUBLISHED" : "FAILED",
        publishedAt: allSuccessful ? new Date() : null,
      },
    })

    return NextResponse.json({
      success: allSuccessful,
      post: updatedPost,
      message: allSuccessful
        ? "Postingan berhasil diterbitkan ke semua platform!"
        : "Sebagian platform gagal diterbitkan",
    })
  } catch (error: any) {
    console.error("Publish now error:", error)
    return NextResponse.json({ error: error.message || "Gagal menerbitkan postingan" }, { status: 500 })
  }
}
