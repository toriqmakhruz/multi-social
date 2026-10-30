import { requireAuth } from "@/lib/auth-utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AnalitikPage() {
  await requireAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          📊 Analitik
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Pantau performa postingan di semua platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Likes", value: "0", icon: "❤️" },
          { label: "Total Komentar", value: "0", icon: "💬" },
          { label: "Total Views", value: "0", icon: "👁️" },
          { label: "Total Shares", value: "0", icon: "🔄" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                </div>
                <div className="text-3xl">{stat.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="py-16 text-center">
          <p className="text-4xl mb-3">📊</p>
          <p className="text-gray-500 dark:text-gray-400">
            Data analitik akan muncul setelah Anda mulai memposting konten.
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            Hubungkan akun media sosial dan buat postingan terlebih dahulu.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
