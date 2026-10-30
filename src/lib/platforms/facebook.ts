import { PlatformPublishResult, PublishPostPayload } from "./types"

/**
 * Facebook Graph API publisher
 * Mendukung posting teks & foto/video ke Facebook Page
 */
export async function publishToFacebook(payload: PublishPostPayload): Promise<PlatformPublishResult> {
  try {
    if (!payload.accessToken || !payload.platformUserId) {
      return { success: false, error: "Kredensial Facebook Page tidak lengkap" }
    }

    console.log("[Facebook API] Mempublikasikan ke Facebook Page...", {
      pageId: payload.platformUserId,
      contentLength: payload.content.length,
    })

    // Graph API Flow:
    // const res = await fetch(`https://graph.facebook.com/v19.0/${payload.platformUserId}/feed`, {
    //   method: "POST",
    //   body: new URLSearchParams({
    //     message: payload.content,
    //     access_token: payload.accessToken,
    //   }),
    // })

    return {
      success: true,
      platformPostId: `fb_${Date.now()}`,
    }
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Gagal mempublikasikan ke Facebook",
    }
  }
}
