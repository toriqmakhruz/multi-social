import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.redirect(new URL("/masuk", req.url))
    }

    const { platform } = await params
    const platformUpper = platform.toUpperCase()

    // Di tahap awal development / MVP sebelum kredensial API OAuth live diisi di dashboard Hostinger,
    // kita sediakan mekanisme connect instan / OAuth redirection:
    const mockAccounts: Record<string, { username: string; displayName: string }> = {
      YOUTUBE: { username: "my_youtube_channel", displayName: "Channel Utama" },
      INSTAGRAM: { username: "instabusiness_id", displayName: "Akun Instagram Bisnis" },
      FACEBOOK: { username: "fb_page_official", displayName: "Halaman Facebook Resmi" },
      TIKTOK: { username: "tiktok_creator", displayName: "Kreator TikTok" },
    }

    const accountData = mockAccounts[platformUpper] || {
      username: `${platform}_user`,
      displayName: `Akun ${platform}`,
    }

    // Upsert koneksi sosial akun untuk user yang sedang login
    await db.socialAccount.upsert({
      where: {
        platform_platformUserId: {
          platform: platformUpper as any,
          platformUserId: `demo_${platformUpper.toLowerCase()}_${session.user.id}`,
        },
      },
      update: {
        isActive: true,
        accessToken: `token_demo_${Date.now()}`,
        updatedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        platform: platformUpper as any,
        platformUserId: `demo_${platformUpper.toLowerCase()}_${session.user.id}`,
        platformUsername: accountData.username,
        displayName: accountData.displayName,
        accessToken: `token_demo_${Date.now()}`,
        isActive: true,
      },
    })

    return NextResponse.redirect(new URL("/akun-sosmed?success=connected", req.url))
  } catch (error) {
    console.error("Connect platform error:", error)
    return NextResponse.redirect(new URL("/akun-sosmed?error=failed", req.url))
  }
}
