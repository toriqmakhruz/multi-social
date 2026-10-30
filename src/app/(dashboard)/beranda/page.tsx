import { requireAuth } from "@/lib/auth-utils"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatNumber, getPlatformName } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function BerandaPage() {
  const user = await requireAuth()

  // Fetch stats
  const [socialAccounts, totalPosts, scheduledPosts, publishedPosts] = await Promise.all([
    db.socialAccount.findMany({
      where: { userId: user.id, isActive: true },
    }),
    db.post.count({ where: { userId: user.id } }),
    db.post.count({ where: { userId: user.id, status: "SCHEDULED" } }),
    db.post.count({ where: { userId: user.id, status: "PUBLISHED" } }),
  ])

  // Recent posts
  const recentPosts = await db.post.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      platforms: {
        include: { socialAccount: true },
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
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Selamat datang, {user.name || "Pengguna"}! 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Ini ringkasan akun media sosial Anda hari ini.
          </p>
        </div>
        <Link href="/buat-postingan">
          <Button>✏️ Buat Postingan</Button>
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Akun Terhubung</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {socialAccounts.length}
                </p>
              </div>
              <div className="text-3xl">🔗</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Postingan</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {formatNumber(totalPosts)}
                </p>
              </div>
              <div className="text-3xl">📝</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Terjadwal</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">
                  {scheduledPosts}
                </p>
              </div>
              <div className="text-3xl">📅</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Terbit</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {publishedPosts}
                </p>
              </div>
              <div className="text-3xl">✅</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Connected accounts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Akun Terhubung</CardTitle>
            <Link href="/akun-sosmed">
              <Button variant="outline" size="sm">Kelola Akun</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {socialAccounts.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p className="text-4xl mb-3">🔗</p>
              <p>Belum ada akun yang terhubung.</p>
              <Link href="/akun-sosmed">
                <Button variant="outline" className="mt-3">
                  Hubungkan Akun
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {socialAccounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-lg">
                    {account.platform === "YOUTUBE" && "▶"}
                    {account.platform === "INSTAGRAM" && "📷"}
                    {account.platform === "FACEBOOK" && "👤"}
                    {account.platform === "TIKTOK" && "♪"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                      {account.displayName || account.platformUsername}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {getPlatformName(account.platform)}
                    </p>
                  </div>
                  <Badge variant="success" className="text-[10px]">Aktif</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent posts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Postingan Terbaru</CardTitle>
            <Link href="/postingan">
              <Button variant="outline" size="sm">Lihat Semua</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentPosts.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p className="text-4xl mb-3">📝</p>
              <p>Belum ada postingan.</p>
              <Link href="/buat-postingan">
                <Button variant="outline" className="mt-3">
                  Buat Postingan Pertama
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors dark:border-gray-700 dark:hover:bg-gray-800/50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-900 truncate dark:text-white">
                      {post.content.substring(0, 80)}
                      {post.content.length > 80 ? "..." : ""}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {post.platforms.map((pp) => (
                        <span key={pp.id} className="text-xs text-gray-500 dark:text-gray-400">
                          {getPlatformName(pp.socialAccount.platform)}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Badge variant={statusVariants[post.status]}>
                    {statusLabels[post.status]}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
