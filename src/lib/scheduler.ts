import cron from "node-cron"
import { db } from "@/lib/db"
import { publishToYouTube } from "./platforms/youtube"
import { publishToInstagram } from "./platforms/instagram"
import { publishToFacebook } from "./platforms/facebook"
import { publishToTikTok } from "./platforms/tiktok"

let isRunning = false

export async function processScheduledJobs() {
  if (isRunning) return
  isRunning = true

  try {
    const now = new Date()

    // Ambil job terjadwal yang siap diproses
    const pendingJobs = await db.scheduledJob.findMany({
      where: {
        status: "PENDING",
        runAt: { lte: now },
      },
      take: 10,
    })

    for (const job of pendingJobs) {
      try {
        await db.scheduledJob.update({
          where: { id: job.id },
          data: { status: "PROCESSING", startedAt: new Date(), attempts: { increment: 1 } },
        })

        const payload = JSON.parse(job.payload || "{}")
        const { postId } = payload

        if (!postId) {
          throw new Error("Payload tidak valid: postId tidak ada")
        }

        const post = await db.post.findUnique({
          where: { id: postId },
          include: {
            media: { include: { media: true } },
            platforms: { include: { socialAccount: true } },
          },
        })

        if (!post) {
          throw new Error(`Postingan dengan ID ${postId} tidak ditemukan`)
        }

        await db.post.update({
          where: { id: post.id },
          data: { status: "PUBLISHING" },
        })

        const mediaUrls = post.media.map((pm) => pm.media.url)
        let allSuccessful = true

        for (const pp of post.platforms) {
          const account = pp.socialAccount
          if (!account.isActive) continue

          let result = { success: false, platformPostId: "", error: "" }
          const publishPayload = {
            content: post.content,
            mediaUrls,
            accessToken: account.accessToken,
            refreshToken: account.refreshToken || undefined,
            platformUserId: account.platformUserId,
          }

          if (account.platform === "YOUTUBE") {
            result = await publishToYouTube(publishPayload) as any
          } else if (account.platform === "INSTAGRAM") {
            result = await publishToInstagram(publishPayload) as any
          } else if (account.platform === "FACEBOOK") {
            result = await publishToFacebook(publishPayload) as any
          } else if (account.platform === "TIKTOK") {
            result = await publishToTikTok(publishPayload) as any
          }

          if (result.success) {
            await db.postPlatform.update({
              where: { id: pp.id },
              data: {
                status: "PUBLISHED",
                platformPostId: result.platformPostId,
                publishedAt: new Date(),
              },
            })
          } else {
            allSuccessful = false
            await db.postPlatform.update({
              where: { id: pp.id },
              data: {
                status: "FAILED",
                errorMessage: result.error || "Gagal posting ke platform",
              },
            })
          }
        }

        await db.post.update({
          where: { id: post.id },
          data: {
            status: allSuccessful ? "PUBLISHED" : "FAILED",
            publishedAt: allSuccessful ? new Date() : null,
          },
        })

        await db.scheduledJob.update({
          where: { id: job.id },
          data: {
            status: allSuccessful ? "COMPLETED" : "FAILED",
            completedAt: new Date(),
          },
        })
      } catch (jobErr: any) {
        console.error(`[Scheduler] Gagal memproses job ${job.id}:`, jobErr)
        await db.scheduledJob.update({
          where: { id: job.id },
          data: {
            status: "FAILED",
            error: jobErr.message || "Error tidak diketahui",
          },
        })
      }
    }
  } catch (err) {
    console.error("[Scheduler] Error pada siklus pengecekan cron:", err)
  } finally {
    isRunning = false
  }
}

/**
 * Inisialisasi cron scheduler (dijalankan setiap 1 menit)
 */
export function initScheduler() {
  console.log("[Scheduler] Mengaktifkan penjadwal otomatis Multi Social (setiap 1 menit)...")
  cron.schedule("* * * * *", () => {
    processScheduledJobs()
  })
}
