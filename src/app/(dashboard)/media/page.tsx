import { requireAuth } from "@/lib/auth-utils"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"

export default async function MediaPage() {
  const user = await requireAuth()

  const mediaFiles = await db.mediaFile.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            🖼️ Media Library
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Kelola semua gambar dan video Anda
          </p>
        </div>
        <Button>📎 Upload Media</Button>
      </div>

      {mediaFiles.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-4xl mb-3">🖼️</p>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Belum ada media yang diupload.
            </p>
            <Button variant="outline">Upload Media Pertama</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {mediaFiles.map((file) => (
            <Card key={file.id} className="overflow-hidden group cursor-pointer">
              <div className="aspect-square relative">
                {file.type === "IMAGE" ? (
                  <img
                    src={file.url}
                    alt={file.originalName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <span className="text-4xl">🎬</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Badge variant="secondary">{file.type === "IMAGE" ? "Gambar" : "Video"}</Badge>
                </div>
              </div>
              <CardContent className="p-3">
                <p className="text-xs text-gray-600 truncate dark:text-gray-400">
                  {file.originalName}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {formatDate(file.createdAt)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
