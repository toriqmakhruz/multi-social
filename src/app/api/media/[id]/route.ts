import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 })
    }

    const { id } = await params

    const media = await db.mediaFile.findUnique({
      where: { id },
    })

    if (!media || media.userId !== session.user.id) {
      return NextResponse.json({ error: "Media tidak ditemukan" }, { status: 404 })
    }

    await db.postMedia.deleteMany({ where: { mediaId: id } })
    await db.mediaFile.delete({ where: { id } })

    return NextResponse.json({ success: true, message: "Media berhasil dihapus" })
  } catch (error: any) {
    console.error("Delete media error:", error)
    return NextResponse.json({ error: error.message || "Gagal menghapus media" }, { status: 500 })
  }
}
