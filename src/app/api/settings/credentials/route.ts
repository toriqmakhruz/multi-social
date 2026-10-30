import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { readFile, writeFile } from "fs/promises"
import path from "path"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 })
    }

    const {
      googleClientId,
      googleClientSecret,
      facebookClientId,
      facebookClientSecret,
      tiktokClientKey,
      tiktokClientSecret,
    } = await req.json()

    const envPath = path.join(process.cwd(), ".env")
    let envContent = ""
    try {
      envContent = await readFile(envPath, "utf-8")
    } catch {
      envContent = ""
    }

    const updateEnvVar = (content: string, key: string, value: string) => {
      const regex = new RegExp(`^${key}=.*$`, "m")
      if (regex.test(content)) {
        return content.replace(regex, `${key}="${value}"`)
      }
      return `${content}\n${key}="${value}"`
    }

    if (googleClientId !== undefined) {
      envContent = updateEnvVar(envContent, "GOOGLE_CLIENT_ID", googleClientId)
      process.env.GOOGLE_CLIENT_ID = googleClientId
    }
    if (googleClientSecret !== undefined) {
      envContent = updateEnvVar(envContent, "GOOGLE_CLIENT_SECRET", googleClientSecret)
      process.env.GOOGLE_CLIENT_SECRET = googleClientSecret
    }
    if (facebookClientId !== undefined) {
      envContent = updateEnvVar(envContent, "FACEBOOK_CLIENT_ID", facebookClientId)
      process.env.FACEBOOK_CLIENT_ID = facebookClientId
    }
    if (facebookClientSecret !== undefined) {
      envContent = updateEnvVar(envContent, "FACEBOOK_CLIENT_SECRET", facebookClientSecret)
      process.env.FACEBOOK_CLIENT_SECRET = facebookClientSecret
    }
    if (tiktokClientKey !== undefined) {
      envContent = updateEnvVar(envContent, "TIKTOK_CLIENT_KEY", tiktokClientKey)
      process.env.TIKTOK_CLIENT_KEY = tiktokClientKey
    }
    if (tiktokClientSecret !== undefined) {
      envContent = updateEnvVar(envContent, "TIKTOK_CLIENT_SECRET", tiktokClientSecret)
      process.env.TIKTOK_CLIENT_SECRET = tiktokClientSecret
    }

    await writeFile(envPath, envContent.trim() + "\n", "utf-8")

    return NextResponse.json({ success: true, message: "Kredensial API berhasil disimpan!" })
  } catch (error: any) {
    console.error("Save credentials error:", error)
    return NextResponse.json({ error: error.message || "Gagal menyimpan kredensial" }, { status: 500 })
  }
}
