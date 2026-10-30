export interface PlatformPublishResult {
  success: boolean
  platformPostId?: string
  error?: string
}

export interface PublishPostPayload {
  content: string
  mediaUrls?: string[]
  accessToken: string
  refreshToken?: string
  platformUserId?: string
}
