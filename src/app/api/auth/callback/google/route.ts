import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    const { searchParams } = new URL(req.url)
    const code = searchParams.get("code")
    const error = searchParams.get("error")

    if (error) {
      console.error("Google OAuth error from query:", error)
      return NextResponse.redirect(new URL("/akun-sosmed?error=" + encodeURIComponent(error), req.url))
    }

    if (!code) {
      return NextResponse.redirect(new URL("/akun-sosmed?error=missing_code", req.url))
    }

    if (!session?.user?.id) {
      return NextResponse.redirect(new URL("/masuk?error=unauthenticated", req.url))
    }

    const clientId = process.env.GOOGLE_CLIENT_ID!
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET!
    const redirectUri = `${new URL(req.url).origin}/api/auth/callback/google`

    // Tukar code dengan Access Token & Refresh Token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    })

    const tokenData = await tokenRes.json()

    if (!tokenRes.ok || !tokenData.access_token) {
      console.error("Failed to exchange Google token:", tokenData)
      return NextResponse.redirect(new URL("/akun-sosmed?error=token_exchange_failed", req.url))
    }

    const { access_token, refresh_token, expires_in } = tokenData

    // Ambil data Channel YouTube resmi menggunakan Access Token
    const ytRes = await fetch(
      "https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    )

    const ytData = await ytRes.json()
    const channel = ytData.items?.[0]

    const channelId = channel?.id || `yt_${session.user.id}`
    const channelTitle = channel?.snippet?.title || "Channel YouTube Resmi"
    const channelImage = channel?.snippet?.thumbnails?.default?.url || null
    const customUrl = channel?.snippet?.customUrl || channelTitle

    const tokenExpiresAt = expires_in ? new Date(Date.now() + expires_in * 1000) : null

    // Simpan ke database SocialAccount
    await db.socialAccount.upsert({
      where: {
        platform_platformUserId: {
          platform: "YOUTUBE",
          platformUserId: channelId,
        },
      },
      update: {
        userId: session.user.id,
        platformUsername: customUrl,
        displayName: channelTitle,
        profileImage: channelImage,
        accessToken: access_token,
        ...(refresh_token ? { refreshToken: refresh_token } : {}),
        tokenExpiresAt,
        isActive: true,
        updatedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        platform: "YOUTUBE",
        platformUserId: channelId,
        platformUsername: customUrl,
        displayName: channelTitle,
        profileImage: channelImage,
        accessToken: access_token,
        refreshToken: refresh_token || null,
        tokenExpiresAt,
        isActive: true,
      },
    })

    console.log(`[YouTube OAuth] Berhasil menghubungkan channel: ${channelTitle} (${channelId})`)

    return NextResponse.redirect(new URL("/akun-sosmed?success=youtube_connected", req.url))
  } catch (err: any) {
    console.error("Google Callback error:", err)
    return NextResponse.redirect(new URL("/akun-sosmed?error=" + encodeURIComponent(err.message || "oauth_failed"), req.url))
  }
}
