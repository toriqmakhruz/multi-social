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
    const origin = new URL(req.url).origin

    // 1. Integrasi Google OAuth Resmi untuk YouTube
    if (platformUpper === "YOUTUBE" && process.env.GOOGLE_CLIENT_ID) {
      const redirectUri = `${origin}/api/auth/callback/google`
      const scopes = [
        "openid",
        "email",
        "profile",
        "https://www.googleapis.com/auth/youtube.upload",
        "https://www.googleapis.com/auth/youtube.readonly",
      ].join(" ")

      const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth")
      googleAuthUrl.searchParams.set("client_id", process.env.GOOGLE_CLIENT_ID)
      googleAuthUrl.searchParams.set("redirect_uri", redirectUri)
      googleAuthUrl.searchParams.set("response_type", "code")
      googleAuthUrl.searchParams.set("scope", scopes)
      googleAuthUrl.searchParams.set("access_type", "offline")
      googleAuthUrl.searchParams.set("prompt", "consent")
      googleAuthUrl.searchParams.set("state", session.user.id)

      return NextResponse.redirect(googleAuthUrl.toString())
    }

    // 2. Integrasi Meta OAuth Resmi untuk Facebook & Instagram
    if ((platformUpper === "FACEBOOK" || platformUpper === "INSTAGRAM") && process.env.FACEBOOK_CLIENT_ID) {
      const redirectUri = `${origin}/api/auth/callback/meta`
      const scopes = [
        "pages_show_list",
        "pages_read_engagement",
        "pages_manage_posts",
        "instagram_basic",
        "instagram_content_publish",
      ].join(",")

      const metaAuthUrl = new URL("https://www.facebook.com/v19.0/dialog/oauth")
      metaAuthUrl.searchParams.set("client_id", process.env.FACEBOOK_CLIENT_ID)
      metaAuthUrl.searchParams.set("redirect_uri", redirectUri)
      metaAuthUrl.searchParams.set("scope", scopes)
      metaAuthUrl.searchParams.set("response_type", "code")
      metaAuthUrl.searchParams.set("state", session.user.id)

      return NextResponse.redirect(metaAuthUrl.toString())
    }

    // 3. Fallback / Sandbox Mode untuk pengujian awal
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
