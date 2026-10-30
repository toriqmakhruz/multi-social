import { requireAuth } from "@/lib/auth-utils"
import { Card, CardContent } from "@/components/ui/card"

export default async function KalenderPage() {
  await requireAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          📅 Kalender Konten
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Lihat dan kelola jadwal postingan dalam tampilan kalender
        </p>
      </div>

      <Card>
        <CardContent className="py-16 text-center">
          <p className="text-4xl mb-3">📅</p>
          <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Kalender Konten
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Fitur kalender interaktif akan ditambahkan pada Phase 2.
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            Untuk saat ini, gunakan halaman Postingan untuk melihat jadwal.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
