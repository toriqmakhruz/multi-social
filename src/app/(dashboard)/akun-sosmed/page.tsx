import { requireAuth } from "@/lib/auth-utils"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getPlatformName } from "@/lib/utils"

const availablePlatforms = [
  {
    id: "YOUTUBE",
    name: "YouTube",
    icon: "▶",
    description: "Upload video dan kelola channel YouTube",
    color: "bg-red-600",
    connectUrl: "/api/connect/youtube",
  },
  {
    id: "INSTAGRAM",
    name: "Instagram",
    icon: "📷",
    description: "Posting foto, video, dan stories",
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
    connectUrl: "/api/connect/instagram",
  },
  {
    id: "FACEBOOK",
    name: "Facebook",
    icon: "👤",
    description: "Posting ke halaman dan profil Facebook",
    color: "bg-blue-600",
    connectUrl: "/api/connect/facebook",
  },
  {
    id: "TIKTOK",
    name: "TikTok",
    icon: "♪",
    description: "Upload video pendek ke TikTok",
    color: "bg-gray-900",
    connectUrl: "/api/connect/tiktok",
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          🔗 Akun Media Sosial
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Hubungkan dan kelola akun media sosial Anda
        </p>
      </div>

      {/* Connected accounts */}
      {socialAccounts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Akun Terhubung</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {socialAccounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700"
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
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availablePlatforms.map((platform) => {
              const isConnected = connectedPlatforms.includes(platform.id as any)
              return (
                <div
                  key={platform.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl ${platform.color} flex items-center justify-center text-white text-xl`}
                    >
                      {platform.icon}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {platform.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
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
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Info box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 dark:bg-blue-900/20 dark:border-blue-800">
        <p className="text-sm text-blue-700 dark:text-blue-400">
          💡 <strong>Tips:</strong> Untuk menghubungkan akun, Anda perlu mengatur API credentials di pengaturan.
          Setiap platform memerlukan pendaftaran developer app terlebih dahulu.
        </p>
      </div>
    </div>
  )
}
