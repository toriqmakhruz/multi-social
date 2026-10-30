import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

/**
 * Callback OAuth Meta (Facebook & Instagram)
 * Flow:
 * 1. Tukar auth code dengan User Access Token
 * 2. Tukar User Access Token dengan Long-Lived Token (masa aktif 60 hari)
 * 3. Fetch Facebook Pages user: /me/accounts?fields=id,name,access_token,instagram_business_account{id,username,name,profile_picture_url}
 * 4. Simpan Facebook Page & Instagram Business ke SocialAccount!
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    const { searchParams } = new URL(req.url)
    const code = searchParams.get("code")
    const error = searchParams.get("error")

    if (error) {
      console.error("Meta OAuth error:", error)
      return NextResponse.redirect(new URL("/akun-sosmed?error=" + encodeURIComponent(error), req.url))
    }

    if (!code) {
      return NextResponse.redirect(new URL("/akun-sosmed?error=missing_code", req.url))
    }

    if (!session?.user?.id) {
      return NextResponse.redirect(new URL("/masuk?error=unauthenticated", req.url))
    }

    const clientId = process.env.FACEBOOK_CLIENT_ID!
    const clientSecret = process.env.FACEBOOK_CLIENT_SECRET!
    const redirectUri = `${new URL(req.url).origin}/api/auth/callback/meta`

    // 1. Dapatkan User Access Token
    const tokenUrl = new URL("https://graph.facebook.com/v19.0/oauth/access_token")
    tokenUrl.searchParams.set("client_id", clientId)
    tokenUrl.searchParams.set("client_secret", clientSecret)
    tokenUrl.searchParams.set("redirect_uri", redirectUri)
    tokenUrl.searchParams.set("code", code)

    const tokenRes = await fetch(tokenUrl.toString())
    const tokenData = await tokenRes.json()

    if (!tokenRes.ok || !tokenData.access_token) {
      console.error("Failed to exchange Meta token:", tokenData)
      return NextResponse.redirect(new URL("/akun-sosmed?error=meta_token_failed", req.url))
    }

    let userAccessToken = tokenData.access_token

    // 2. Dapatkan Long-Lived User Token (60 hari)
    try {
      const longLivedUrl = new URL("https://graph.facebook.com/v19.0/oauth/access_token")
      longLivedUrl.searchParams.set("grant_type", "fb_exchange_token")
      longLivedUrl.searchParams.set("client_id", clientId)
      longLivedUrl.searchParams.set("client_secret", clientSecret)
      longLivedUrl.searchParams.set("fb_exchange_token", userAccessToken)

      const llRes = await fetch(longLivedUrl.toString())
      const llData = await llRes.json()
      if (llData.access_token) {
        userAccessToken = llData.access_token
      }
    } catch (llErr) {
      console.warn("Could not get long-lived token, using standard token:", llErr)
    }

    // 3. Ambil Facebook Pages & Instagram Business Account yang terhubung
    const pagesUrl = new URL("https://graph.facebook.com/v19.0/me/accounts")
    pagesUrl.searchParams.set(
      "fields",
      "id,name,access_token,picture{url},instagram_business_account{id,username,name,profile_picture_url}"
    )
    pagesUrl.searchParams.set("access_token", userAccessToken)

    const pagesRes = await fetch(pagesUrl.toString())
    const pagesData = await pagesRes.json()

    const pages = pagesData.data || []
    console.log(`[Meta OAuth] Ditemukan ${pages.length} Facebook Page(s)`)

    for (const page of pages) {
      // Simpan Facebook Page
      await db.socialAccount.upsert({
        where: {
          platform_platformUserId: {
            platform: "FACEBOOK",
            platformUserId: page.id,
          },
        },
        update: {
          userId: session.user.id,
          platformUsername: page.name.toLowerCase().replace(/\s+/g, "_"),
          displayName: page.name,
          profileImage: page.picture?.data?.url || null,
          accessToken: page.access_token || userAccessToken,
          isActive: true,
          updatedAt: new Date(),
        },
        create: {
          userId: session.user.id,
          platform: "FACEBOOK",
          platformUserId: page.id,
          platformUsername: page.name.toLowerCase().replace(/\s+/g, "_"),
          displayName: page.name,
          profileImage: page.picture?.data?.url || null,
          accessToken: page.access_token || userAccessToken,
          isActive: true,
        },
      })

      // Jika halaman terhubung ke Instagram Business Account, simpan juga Instagram!
      if (page.instagram_business_account) {
        const ig = page.instagram_business_account
        await db.socialAccount.upsert({
          where: {
            platform_platformUserId: {
              platform: "INSTAGRAM",
              platformUserId: ig.id,
            },
          },
          update: {
            userId: session.user.id,
            platformUsername: ig.username || ig.name || "instagram_user",
            displayName: ig.name || ig.username || "Instagram Bisnis",
            profileImage: ig.profile_picture_url || null,
            accessToken: page.access_token || userAccessToken,
            isActive: true,
            updatedAt: new Date(),
          },
          create: {
            userId: session.user.id,
            platform: "INSTAGRAM",
            platformUserId: ig.id,
            platformUsername: ig.username || ig.name || "instagram_user",
            displayName: ig.name || ig.username || "Instagram Bisnis",
            profileImage: ig.profile_picture_url || null,
            accessToken: page.access_token || userAccessToken,
            isActive: true,
          },
        })
        console.log(`[Meta OAuth] Berhasil menghubungkan Instagram: @${ig.username}`)
      }
    }

    return NextResponse.redirect(new URL("/akun-sosmed?success=meta_connected", req.url))
  } catch (err: any) {
    console.error("Meta Callback error:", err)
    return NextResponse.redirect(
      new URL("/akun-sosmed?error=" + encodeURIComponent(err.message || "meta_failed"), req.url)
    )
  }
}
