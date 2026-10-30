import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

/**
 * Callback OAuth Resmi TikTok (TikTok Content Posting API v2)
 * Scope: user.info.basic, video.upload, video.publish
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    const { searchParams } = new URL(req.url)
    const code = searchParams.get("code")
    const error = searchParams.get("error")

    if (error) {
      console.error("TikTok OAuth error:", error)
      return NextResponse.redirect(new URL("/akun-sosmed?error=" + encodeURIComponent(error), req.url))
    }

    if (!code) {
      return NextResponse.redirect(new URL("/akun-sosmed?error=missing_code", req.url))
    }

    if (!session?.user?.id) {
      return NextResponse.redirect(new URL("/masuk?error=unauthenticated", req.url))
    }

    const clientKey = process.env.TIKTOK_CLIENT_KEY!
    const clientSecret = process.env.TIKTOK_CLIENT_SECRET!
    const redirectUri = `${new URL(req.url).origin}/api/auth/callback/tiktok`

    // Tukar authorization code dengan Access Token v2 TikTok
    const tokenRes = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cache-Control": "no-cache",
      },
      body: new URLSearchParams({
        client_key: clientKey,
        client_secret: clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      }),
    })

    const tokenData = await tokenRes.json()
    const accessToken = tokenData.data?.access_token || tokenData.access_token
    const refreshToken = tokenData.data?.refresh_token || tokenData.refresh_token
    const openId = tokenData.data?.open_id || tokenData.open_id || `tt_user_${session.user.id}`
    const expiresIn = tokenData.data?.expires_in || tokenData.expires_in

    if (!tokenRes.ok || !accessToken) {
      console.error("TikTok token exchange failed:", tokenData)
      return NextResponse.redirect(new URL("/akun-sosmed?error=tiktok_token_failed", req.url))
    }

    // Ambil info dasar akun TikTok user
    let displayName = "Kreator TikTok"
    let username = "tiktok_user"
    let avatarUrl = null

    try {
      const userRes = await fetch(
        "https://open.tiktokapis.com/v2/user/info/?fields=open_id,display_name,avatar_url",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
      const userData = await userRes.json()
      const u = userData.data?.user || userData.user
      if (u) {
        displayName = u.display_name || displayName
        username = displayName.toLowerCase().replace(/\s+/g, "_")
        avatarUrl = u.avatar_url || null
      }
    } catch (uErr) {
      console.warn("Could not fetch TikTok user profile info:", uErr)
    }

    const tokenExpiresAt = expiresIn ? new Date(Date.now() + expiresIn * 1000) : null

    // Simpan ke database SocialAccount
    await db.socialAccount.upsert({
      where: {
        platform_platformUserId: {
          platform: "TIKTOK",
          platformUserId: openId,
        },
      },
      update: {
        userId: session.user.id,
        platformUsername: username,
        displayName,
        profileImage: avatarUrl,
        accessToken: accessToken,
        ...(refreshToken ? { refreshToken } : {}),
        tokenExpiresAt,
        isActive: true,
        updatedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        platform: "TIKTOK",
        platformUserId: openId,
        platformUsername: username,
        displayName,
        profileImage: avatarUrl,
        accessToken: accessToken,
        refreshToken: refreshToken || null,
        tokenExpiresAt,
        isActive: true,
      },
    })

    console.log(`[TikTok OAuth] Berhasil menghubungkan akun TikTok: ${displayName} (${openId})`)

    return NextResponse.redirect(new URL("/akun-sosmed?success=tiktok_connected", req.url))
  } catch (err: any) {
    console.error("TikTok Callback error:", err)
    return NextResponse.redirect(
      new URL("/akun-sosmed?error=" + encodeURIComponent(err.message || "tiktok_failed"), req.url)
    )
  }
}
