import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { randomUUID } from "crypto"

// GET /api/posts - List all posts
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")

    const where: any = { userId: session.user.id }
    if (status) where.status = status

    const [posts, total] = await Promise.all([
      db.post.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          platforms: {
            include: { socialAccount: true },
          },
          media: {
            include: { media: true },
          },
        },
      }),
      db.post.count({ where }),
    ])

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("GET /api/posts error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}

// POST /api/posts - Create a new post
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 })
    }

    const formData = await req.formData()
    const content = formData.get("content") as string
    const status = formData.get("status") as string
    const platformsJson = formData.get("platforms") as string
    const scheduledAt = formData.get("scheduledAt") as string | null
    const mediaFiles = formData.getAll("media") as File[]

    if (!content?.trim()) {
      return NextResponse.json({ error: "Konten tidak boleh kosong" }, { status: 400 })
    }

    const selectedPlatforms: string[] = JSON.parse(platformsJson || "[]")
    if (selectedPlatforms.length === 0) {
      return NextResponse.json({ error: "Pilih minimal satu platform" }, { status: 400 })
    }

    // Get user's social accounts for selected platforms
    const socialAccounts = await db.socialAccount.findMany({
      where: {
        userId: session.user.id,
        platform: { in: selectedPlatforms as any },
        isActive: true,
      },
    })

    // Upload media files
    const uploadedMedia: string[] = []
    if (mediaFiles.length > 0) {
      const uploadDir = path.join(process.cwd(), "public", "uploads", session.user.id)
      await mkdir(uploadDir, { recursive: true })

      for (const file of mediaFiles) {
        if (file.size > 0) {
          const ext = path.extname(file.name)
          const filename = `${randomUUID()}${ext}`
          const filepath = path.join(uploadDir, filename)
          const buffer = Buffer.from(await file.arrayBuffer())
          await writeFile(filepath, buffer)

          const mediaFile = await db.mediaFile.create({
            data: {
              userId: session.user.id,
              filename,
              originalName: file.name,
              mimeType: file.type,
              size: file.size,
              url: `/uploads/${session.user.id}/${filename}`,
              type: file.type.startsWith("video") ? "VIDEO" : "IMAGE",
            },
          })
          uploadedMedia.push(mediaFile.id)
        }
      }
    }

    // Create post
    const post = await db.post.create({
      data: {
        userId: session.user.id,
        content,
        status: status === "SCHEDULED" ? "SCHEDULED" : "DRAFT",
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        // Link platforms
        platforms: {
          create: socialAccounts.map((account) => ({
            socialAccountId: account.id,
            status: status === "SCHEDULED" ? "SCHEDULED" : "DRAFT",
          })),
        },
        // Link media
        media: {
          create: uploadedMedia.map((mediaId, index) => ({
            mediaId,
            position: index,
          })),
        },
      },
      include: {
        platforms: { include: { socialAccount: true } },
        media: { include: { media: true } },
      },
    })

    // Create scheduled job if scheduled
    if (status === "SCHEDULED" && scheduledAt) {
      await db.scheduledJob.create({
        data: {
          type: "PUBLISH_POST",
          payload: JSON.stringify({ postId: post.id }),
          runAt: new Date(scheduledAt),
        },
      })
    }

    return NextResponse.json({ post }, { status: 201 })
  } catch (error) {
    console.error("POST /api/posts error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}
