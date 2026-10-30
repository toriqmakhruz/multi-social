import { requireAuth } from "@/lib/auth-utils"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDateTime, getPlatformName } from "@/lib/utils"
import Link from "next/link"

export default async function PostinganPage() {
  const user = await requireAuth()

  const posts = await db.post.findMany({
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

  const statusLabels: Record<string, string> = {
    DRAFT: "Draf",
    SCHEDULED: "Terjadwal",
    PUBLISHING: "Memposting",
    PUBLISHED: "Terbit",
    FAILED: "Gagal",
  }

  const statusVariants: Record<string, "default" | "secondary" | "destructive" | "success" | "warning"> = {
    DRAFT: "secondary",
    SCHEDULED: "warning",
    PUBLISHING: "default",
    PUBLISHED: "success",
    FAILED: "destructive",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            📝 Postingan
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Daftar semua postingan Anda
          </p>
        </div>
        <Link href="/buat-postingan">
          <Button>✏️ Buat Postingan</Button>
        </Link>
      </div>

      {posts.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-4xl mb-3">📝</p>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Belum ada postingan. Mulai buat postingan pertama Anda!
            </p>
            <Link href="/buat-postingan">
              <Button>Buat Postingan</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-900 dark:text-white mb-2">
                      {post.content.substring(0, 200)}
                      {post.content.length > 200 ? "..." : ""}
                    </p>

                    <div className="flex items-center gap-3 flex-wrap">
                      {post.platforms.map((pp) => (
                        <span
                          key={pp.id}
                          className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400"
                        >
                          {pp.socialAccount.platform === "YOUTUBE" && "▶"}
                          {pp.socialAccount.platform === "INSTAGRAM" && "📷"}
                          {pp.socialAccount.platform === "FACEBOOK" && "👤"}
                          {pp.socialAccount.platform === "TIKTOK" && "♪"}
                          {getPlatformName(pp.socialAccount.platform)}
                        </span>
                      ))}
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        •
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {formatDateTime(post.createdAt)}
                      </span>
                      {post.scheduledAt && (
                        <>
                          <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
                          <span className="text-xs text-blue-500">
                            📅 {formatDateTime(post.scheduledAt)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={statusVariants[post.status]}>
                      {statusLabels[post.status]}
                    </Badge>
                  </div>
                </div>

                {/* Media thumbnails */}
                {post.media.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {post.media.slice(0, 4).map((pm) => (
                      <img
                        key={pm.id}
                        src={pm.media.url}
                        alt=""
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                      />
                    ))}
                    {post.media.length > 4 && (
                      <div className="w-16 h-16 rounded-lg border border-gray-200 bg-gray-100 flex items-center justify-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800">
                        +{post.media.length - 4}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
