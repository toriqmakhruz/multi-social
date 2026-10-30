import { requireAuth } from "@/lib/auth-utils"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getPlatformName } from "@/lib/utils"
import Link from "next/link"
import { ExternalLink, Settings } from "lucide-react"

const availablePlatforms = [
  {
    id: "YOUTUBE",
    name: "YouTube",
    icon: "▶",
    description: "Upload video dan kelola channel YouTube",
    color: "bg-red-600",
    connectUrl: "/api/connect/youtube",
    devPortalUrl: "https://console.cloud.google.com/apis/credentials",
    devPortalName: "Google Cloud",
  },
  {
    id: "INSTAGRAM",
    name: "Instagram",
    icon: "📷",
    description: "Posting foto, video, dan stories",
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
    connectUrl: "/api/connect/instagram",
    devPortalUrl: "https://developers.facebook.com/apps/",
    devPortalName: "Meta Developers",
  },
  {
    id: "FACEBOOK",
    name: "Facebook",
    icon: "👤",
    description: "Posting ke halaman dan profil Facebook",
    color: "bg-blue-600",
    connectUrl: "/api/connect/facebook",
    devPortalUrl: "https://developers.facebook.com/apps/",
    devPortalName: "Meta Developers",
  },
  {
    id: "TIKTOK",
    name: "TikTok",
    icon: "♪",
    description: "Upload video pendek ke TikTok",
    color: "bg-gray-900",
    connectUrl: "/api/connect/tiktok",
    devPortalUrl: "https://developers.tiktok.com/",
    devPortalName: "TikTok Developers",
  },
]

export default async function AkunSosmedPage() {
  const user = await requireAuth()

  const socialAccounts = await db.socialAccount.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  })

  const connectedPlatforms = socialAccounts.map((a) => a.platform)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            🔗 Akun Media Sosial
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Hubungkan dan kelola akun media sosial resmi Anda
          </p>
        </div>
        <Link href="/pengaturan">
          <Button variant="outline" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            <span>Atur API Key & Kredensial</span>
          </Button>
        </Link>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 dark:bg-blue-900/20 dark:border-blue-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="text-sm text-blue-900 dark:text-blue-200">
          <p className="font-semibold mb-0.5">💡 Butuh API Key & Secret untuk menghubungkan akun?</p>
          <p className="text-blue-700 dark:text-blue-300 text-xs">
            Pastikan Anda sudah mengisi Client ID & Secret di menu Pengaturan. Link developer portal untuk tiap platform sudah disediakan.
          </p>
        </div>
        <Link href="/pengaturan" className="shrink-0">
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
            Buka Pengaturan API Key →
          </Button>
        </Link>
      </div>

      {/* Connected accounts */}
      {socialAccounts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Akun Terhubung</CardTitle>
            <CardDescription>Daftar akun media sosial yang sedang aktif</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {socialAccounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xl">
                      {account.platform === "YOUTUBE" && "▶"}
                      {account.platform === "INSTAGRAM" && "📷"}
                      {account.platform === "FACEBOOK" && "👤"}
                      {account.platform === "TIKTOK" && "♪"}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {account.displayName || account.platformUsername}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {getPlatformName(account.platform)} • @{account.platformUsername}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={account.isActive ? "success" : "secondary"}>
                      {account.isActive ? "Aktif" : "Nonaktif"}
                    </Badge>
                    <form action={`/api/connect/${account.platform.toLowerCase()}/disconnect`} method="POST">
                      <input type="hidden" name="accountId" value={account.id} />
                      <Button variant="outline" size="sm" type="submit">
                        Putuskan
                      </Button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available platforms to connect */}
      <Card>
        <CardHeader>
          <CardTitle>Hubungkan Platform</CardTitle>
          <CardDescription>Pilih platform media sosial yang ingin Anda hubungkan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availablePlatforms.map((platform) => {
              const isConnected = connectedPlatforms.includes(platform.id as any)
              return (
                <div
                  key={platform.id}
                  className="flex flex-col justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 gap-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-xl ${platform.color} flex items-center justify-center text-white text-lg shrink-0`}
                      >
                        {platform.icon}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">
                          {platform.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {platform.description}
                        </p>
                      </div>
                    </div>
                    {isConnected ? (
                      <Badge variant="success">Terhubung</Badge>
                    ) : (
                      <a href={platform.connectUrl}>
                        <Button size="sm">Hubungkan</Button>
                      </a>
                    )}
                  </div>

                  <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500">
                    <span>Developer Portal:</span>
                    <a
                      href={platform.devPortalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <span>{platform.devPortalName}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
