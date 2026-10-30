import { requireAuth } from "@/lib/auth-utils"
import { db } from "@/lib/db"
import { PostListManager, PostItem } from "@/components/features/post-list-manager"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function PostinganPage() {
  const user = await requireAuth()

  const rawPosts = await db.post.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      platforms: {
        include: { socialAccount: true },
      },
      media: {
        include: { media: true },
      },
    },
  })

  // Format serializable data
  const posts: PostItem[] = rawPosts.map((p) => ({
    id: p.id,
    content: p.content,
    status: p.status,
    scheduledAt: p.scheduledAt ? p.scheduledAt.toISOString() : null,
    publishedAt: p.publishedAt ? p.publishedAt.toISOString() : null,
    createdAt: p.createdAt.toISOString(),
    platforms: p.platforms.map((pp) => ({
      id: pp.id,
      status: pp.status,
      errorMessage: pp.errorMessage,
      socialAccount: {
        platform: pp.socialAccount.platform,
        displayName: pp.socialAccount.displayName,
        platformUsername: pp.socialAccount.platformUsername,
      },
    })),
    media: p.media.map((pm) => ({
      id: pm.id,
      media: {
        id: pm.media.id,
        url: pm.media.url,
        originalName: pm.media.originalName,
        type: pm.media.type,
      },
    })),
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            📝 Manajemen Postingan
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Kelola, filter status, terbitkan langsung, atau hapus konten postingan Anda
          </p>
        </div>
        <Link href="/buat-postingan">
          <Button>✏️ Buat Postingan Baru</Button>
        </Link>
      </div>

      <PostListManager initialPosts={posts} />
    </div>
  )
}
