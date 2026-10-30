import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.redirect(new URL("/masuk", req.url))
    }

    const formData = await req.formData()
    const accountId = formData.get("accountId") as string

    if (accountId) {
      await db.socialAccount.deleteMany({
        where: {
          id: accountId,
          userId: session.user.id,
        },
      })
    }

    return NextResponse.redirect(new URL("/akun-sosmed?status=disconnected", req.url))
  } catch (error) {
    console.error("Disconnect error:", error)
    return NextResponse.redirect(new URL("/akun-sosmed?error=disconnect_failed", req.url))
  }
}
