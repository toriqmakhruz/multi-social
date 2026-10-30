import { requireAuth } from "@/lib/auth-utils"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatNumber, getPlatformName } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AnalitikPage() {
  const user = await requireAuth()

  // Ambil semua data platform postingan user yang sudah terbit
  const postPlatforms = await db.postPlatform.findMany({
    where: {
      post: { userId: user.id },
      status: "PUBLISHED",
    },
    include: {
      socialAccount: true,
      post: true,
    },
    orderBy: { publishedAt: "desc" },
  })

  // Kalkulasi agregasi total interaksi
  const totalLikes = postPlatforms.reduce((acc, c) => acc + c.likes, 0)
  const totalComments = postPlatforms.reduce((acc, c) => acc + c.comments, 0)
  const totalViews = postPlatforms.reduce((acc, c) => acc + c.views, 0)
  const totalShares = postPlatforms.reduce((acc, c) => acc + c.shares, 0)

  // Metrik per platform
  const platformStats = [
    { id: "YOUTUBE", name: "YouTube", icon: "▶", color: "text-red-600 bg-red-50 dark:bg-red-950/30" },
    { id: "INSTAGRAM", name: "Instagram", icon: "📷", color: "text-pink-600 bg-pink-50 dark:bg-pink-950/30" },
    { id: "FACEBOOK", name: "Facebook", icon: "👤", color: "text-blue-600 bg-blue-50 dark:bg-blue-950/30" },
    { id: "TIKTOK", name: "TikTok", icon: "♪", color: "text-gray-900 bg-gray-100 dark:text-gray-100 dark:bg-gray-800" },
  ].map((p) => {
    const list = postPlatforms.filter((pp) => pp.socialAccount.platform === p.id)
    return {
      ...p,
      publishedCount: list.length,
      likes: list.reduce((a, b) => a + b.likes, 0),
      comments: list.reduce((a, b) => a + b.comments, 0),
      views: list.reduce((a, b) => a + b.views, 0),
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            📊 Analitik & Performa Media Sosial
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Statistik dan evaluasi performa seluruh postingan yang telah terbit
          </p>
        </div>
        <Link href="/buat-postingan">
          <Button size="sm">✏️ Buat Postingan</Button>
        </Link>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Suka (Likes)", value: totalLikes, icon: "❤️", color: "text-red-500" },
          { label: "Total Komentar", value: totalComments, icon: "💬", color: "text-blue-500" },
          { label: "Total Ditonton (Views)", value: totalViews, icon: "👁️", color: "text-purple-500" },
          { label: "Total Dibagikan (Shares)", value: totalShares, icon: "🔄", color: "text-green-500" },
        ].map((stat) => (
          <Card key={stat.label} className="border-gray-200 dark:border-gray-800 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {formatNumber(stat.value)}
                  </p>
                </div>
                <div className="text-2xl">{stat.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Per Platform Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {platformStats.map((p) => (
          <Card key={p.id} className="border-gray-200 dark:border-gray-800 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${p.color}`}>
                    {p.icon}
                  </span>
                  <CardTitle className="text-sm font-bold">{p.name}</CardTitle>
                </div>
                <Badge variant={p.publishedCount > 0 ? "success" : "secondary"}>
                  {p.publishedCount} Post Terbit
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 pt-2">
              <div className="flex justify-between text-xs py-1 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500">Suka (Likes)</span>
                <span className="font-semibold text-gray-900 dark:text-white">{formatNumber(p.likes)}</span>
              </div>
              <div className="flex justify-between text-xs py-1 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500">Komentar</span>
                <span className="font-semibold text-gray-900 dark:text-white">{formatNumber(p.comments)}</span>
              </div>
              <div className="flex justify-between text-xs py-1">
                <span className="text-gray-500">Views</span>
                <span className="font-semibold text-gray-900 dark:text-white">{formatNumber(p.views)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table of Published Posts Performance */}
      <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Daftar Konten Terbit & Hasil Interaksi</CardTitle>
          <CardDescription>Rincian capaian setiap konten di masing-masing platform media sosial</CardDescription>
        </CardHeader>
        <CardContent>
          {postPlatforms.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p className="text-3xl mb-2">📊</p>
              <p className="text-sm">Belum ada konten yang berstatus terbit.</p>
              <Link href="/buat-postingan" className="inline-block mt-3">
                <Button size="sm">Buat Postingan Sekarang</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase font-semibold dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-300">
                  <tr>
                    <th className="px-4 py-3">Platform</th>
                    <th className="px-4 py-3">Cuplikan Konten</th>
                    <th className="px-4 py-3 text-center">Likes</th>
                    <th className="px-4 py-3 text-center">Komentar</th>
                    <th className="px-4 py-3 text-center">Views</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {postPlatforms.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/70 dark:hover:bg-gray-800/40">
                      <td className="px-4 py-3 font-medium flex items-center gap-1.5 whitespace-nowrap">
                        <span>
                          {item.socialAccount.platform === "YOUTUBE" && "▶"}
                          {item.socialAccount.platform === "INSTAGRAM" && "📷"}
                          {item.socialAccount.platform === "FACEBOOK" && "👤"}
                          {item.socialAccount.platform === "TIKTOK" && "♪"}
                        </span>
                        {getPlatformName(item.socialAccount.platform)}
                      </td>
                      <td className="px-4 py-3 max-w-xs truncate text-gray-700 dark:text-gray-300">
                        {item.post.content}
                      </td>
                      <td className="px-4 py-3 text-center font-semibold text-red-600">
                        {formatNumber(item.likes)}
                      </td>
                      <td className="px-4 py-3 text-center font-semibold text-blue-600">
                        {formatNumber(item.comments)}
                      </td>
                      <td className="px-4 py-3 text-center font-semibold text-purple-600">
                        {formatNumber(item.views)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Badge variant="success" className="text-[10px]">
                          Terbit
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
