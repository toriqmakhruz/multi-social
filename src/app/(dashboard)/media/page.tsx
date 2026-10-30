import { requireAuth } from "@/lib/auth-utils"
import { db } from "@/lib/db"
import { MediaLibraryManager, MediaItem } from "@/components/features/media-library-manager"

export default async function MediaPage() {
  const user = await requireAuth()

  const rawMedia = await db.mediaFile.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  })

  const mediaList: MediaItem[] = rawMedia.map((m) => ({
    id: m.id,
    url: m.url,
    originalName: m.originalName,
    mimeType: m.mimeType,
    size: m.size,
    type: m.type,
    createdAt: m.createdAt.toISOString(),
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          🖼️ Media Library Terpusat
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Unggah, pratinjau, dan kelola semua aset gambar serta video Anda di satu tempat
        </p>
      </div>

      <MediaLibraryManager initialMedia={mediaList} />
    </div>
  )
}
