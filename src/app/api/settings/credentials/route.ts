import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { readFile, writeFile } from "fs/promises"
import { existsSync } from "fs"
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

    const envFiles = [
      path.join(process.cwd(), ".env"),
      "/home/u487122682/domains/papayawhip-lapwing-389067.hostingersite.com/hbuilds/config/.env",
    ]

    const updateEnvVar = (content: string, key: string, value: string) => {
      const regex = new RegExp(`^${key}=.*$`, "m")
      if (regex.test(content)) {
        return content.replace(regex, `${key}=${value}`)
      }
      return `${content}\n${key}=${value}`
    }

    for (const targetPath of envFiles) {
      if (!existsSync(targetPath) && targetPath.startsWith("/home/")) continue

      let envContent = ""
      try {
        envContent = await readFile(targetPath, "utf-8")
      } catch {
        envContent = ""
      }

      if (googleClientId !== undefined) {
        envContent = updateEnvVar(envContent, "GOOGLE_CLIENT_ID", googleClientId)
      }
      if (googleClientSecret !== undefined) {
        envContent = updateEnvVar(envContent, "GOOGLE_CLIENT_SECRET", googleClientSecret)
      }
      if (facebookClientId !== undefined) {
        envContent = updateEnvVar(envContent, "FACEBOOK_CLIENT_ID", facebookClientId)
      }
      if (facebookClientSecret !== undefined) {
        envContent = updateEnvVar(envContent, "FACEBOOK_CLIENT_SECRET", facebookClientSecret)
      }
      if (tiktokClientKey !== undefined) {
        envContent = updateEnvVar(envContent, "TIKTOK_CLIENT_KEY", tiktokClientKey)
      }
      if (tiktokClientSecret !== undefined) {
        envContent = updateEnvVar(envContent, "TIKTOK_CLIENT_SECRET", tiktokClientSecret)
      }

      await writeFile(targetPath, envContent.trim() + "\n", "utf-8")
    }

    // Update in-memory process.env
    if (googleClientId !== undefined) process.env.GOOGLE_CLIENT_ID = googleClientId
    if (googleClientSecret !== undefined) process.env.GOOGLE_CLIENT_SECRET = googleClientSecret
    if (facebookClientId !== undefined) process.env.FACEBOOK_CLIENT_ID = facebookClientId
    if (facebookClientSecret !== undefined) process.env.FACEBOOK_CLIENT_SECRET = facebookClientSecret
    if (tiktokClientKey !== undefined) process.env.TIKTOK_CLIENT_KEY = tiktokClientKey
    if (tiktokClientSecret !== undefined) process.env.TIKTOK_CLIENT_SECRET = tiktokClientSecret

    return NextResponse.json({ success: true, message: "Kredensial API berhasil disimpan!" })
  } catch (error: any) {
    console.error("Save credentials error:", error)
    return NextResponse.json({ error: error.message || "Gagal menyimpan kredensial" }, { status: 500 })
  }
}
