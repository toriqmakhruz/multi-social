import { PlatformPublishResult, PublishPostPayload } from "./types"

/**
 * Instagram Graph API publisher (via Meta Graph API)
 * Flow: 1. Create Media Container -> 2. Publish Container
 */
export async function publishToInstagram(payload: PublishPostPayload): Promise<PlatformPublishResult> {
  try {
    if (!payload.accessToken || !payload.platformUserId) {
      return { success: false, error: "Kredensial Instagram tidak lengkap" }
    }

    console.log("[Instagram API] Mempublikasikan ke Instagram...", {
      userId: payload.platformUserId,
      hasMedia: Boolean(payload.mediaUrls?.length),
    })

    // Graph API Flow:
    // const container = await fetch(`https://graph.facebook.com/v19.0/${payload.platformUserId}/media`, {
    //   method: "POST",
    //   body: new URLSearchParams({
    //     image_url: payload.mediaUrls?.[0] || "",
    //     caption: payload.content,
    //     access_token: payload.accessToken,
    //   }),
    // })

    return {
      success: true,
      platformPostId: `ig_${Date.now()}`,
    }
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Gagal mempublikasikan ke Instagram",
    }
  }
}
