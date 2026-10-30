import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { randomUUID } from "crypto"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 })
    }

    const formData = await req.formData()
    const files = formData.getAll("files") as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "Pilih file yang ingin diunggah" }, { status: 400 })
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", session.user.id)
    await mkdir(uploadDir, { recursive: true })

    const savedRecords = []

    for (const file of files) {
      if (file.size > 0) {
        const ext = path.extname(file.name)
        const filename = `${randomUUID()}${ext}`
        const filepath = path.join(uploadDir, filename)
        const buffer = Buffer.from(await file.arrayBuffer())
        await writeFile(filepath, buffer)

        const isVideo = file.type.startsWith("video")
        const mediaFile = await db.mediaFile.create({
          data: {
            userId: session.user.id,
            filename,
            originalName: file.name,
            mimeType: file.type,
            size: file.size,
            url: `/uploads/${session.user.id}/${filename}`,
            type: isVideo ? "VIDEO" : "IMAGE",
          },
        })
        savedRecords.push(mediaFile)
      }
    }

    return NextResponse.json({
      success: true,
      message: `${savedRecords.length} media berhasil diunggah!`,
      media: savedRecords,
    })
  } catch (error: any) {
    console.error("Upload media error:", error)
    return NextResponse.json({ error: error.message || "Gagal mengunggah media" }, { status: 500 })
  }
}
