import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

// DELETE /api/posts/[id]
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

    const post = await db.post.findUnique({
      where: { id },
    })

    if (!post || post.userId !== session.user.id) {
      return NextResponse.json({ error: "Postingan tidak ditemukan" }, { status: 404 })
    }

    // Delete post (relations cascade)
    await db.postMedia.deleteMany({ where: { postId: id } })
    await db.postPlatform.deleteMany({ where: { postId: id } })
    await db.post.delete({ where: { id } })

    return NextResponse.json({ success: true, message: "Postingan berhasil dihapus" })
  } catch (error) {
    console.error("DELETE /api/posts/[id] error:", error)
    return NextResponse.json({ error: "Gagal menghapus postingan" }, { status: 500 })
  }
}
