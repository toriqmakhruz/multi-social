import { requireAuth } from "@/lib/auth-utils"
import { db } from "@/lib/db"
import { ContentCalendar } from "@/components/features/content-calendar"

export default async function KalenderPage() {
  const user = await requireAuth()

  // Ambil postingan terjadwal & terbit untuk ditampilkan di kalender
  const posts = await db.post.findMany({
    where: {
      userId: user.id,
      OR: [
        { scheduledAt: { not: null } },
        { publishedAt: { not: null } },
      ],
    },
    orderBy: { createdAt: "desc" },
    include: {
      platforms: {
        include: { socialAccount: true },
      },
    },
  })

  // Format serializable data untuk client component
  const serializablePosts = posts.map((post) => ({
    id: post.id,
    content: post.content,
    status: post.status,
    scheduledAt: post.scheduledAt ? post.scheduledAt.toISOString() : null,
    publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
    platforms: post.platforms.map((p) => ({
      id: p.id,
      socialAccount: {
        platform: p.socialAccount.platform,
        displayName: p.socialAccount.displayName,
        platformUsername: p.socialAccount.platformUsername,
      },
    })),
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          📅 Kalender Konten Interaktif
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Pantau dan atur seluruh rencana postingan media sosial Anda per tanggal
        </p>
      </div>

      <ContentCalendar initialPosts={serializablePosts} />
    </div>
  )
}
