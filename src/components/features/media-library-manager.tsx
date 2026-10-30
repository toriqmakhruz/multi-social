"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"

export interface MediaItem {
  id: string
  url: string
  originalName: string
  mimeType: string
  size: number
  type: "IMAGE" | "VIDEO"
  createdAt: string
}

interface MediaLibraryManagerProps {
  initialMedia: MediaItem[]
}

export function MediaLibraryManager({ initialMedia }: MediaLibraryManagerProps) {
  const router = useRouter()
  const [mediaList, setMediaList] = useState<MediaItem[]>(initialMedia)
  const [filterType, setFilterType] = useState<"ALL" | "IMAGE" | "VIDEO">("ALL")
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)
  const [uploading, setUploading] = useState(false)
  const [alertMsg, setAlertMsg] = useState<{ text: string; type: "success" | "error" } | null>(null)

  const filtered = mediaList.filter((m) => {
    if (filterType === "ALL") return true
    return m.type === filterType
  })

  const handleUploadFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setAlertMsg(null)

    try {
      const formData = new FormData()
      Array.from(files).forEach((file) => {
        formData.append("files", file)
      })

      const res = await fetch("/api/media", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) {
        setAlertMsg({ text: data.error || "Gagal mengunggah", type: "error" })
        return
      }

      setAlertMsg({ text: data.message || "Media berhasil diunggah!", type: "success" })
      setUploadModalOpen(false)
      router.refresh()
    } catch {
      setAlertMsg({ text: "Terjadi kesalahan upload", type: "error" })
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteMedia = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm("Hapus file media ini secara permanen?")) return

    try {
      const res = await fetch(`/api/media/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Gagal menghapus")

      setMediaList((prev) => prev.filter((m) => m.id !== id))
      if (selectedMedia?.id === id) setSelectedMedia(null)
      setAlertMsg({ text: "Media berhasil dihapus", type: "success" })
      router.refresh()
    } catch {
      setAlertMsg({ text: "Gagal menghapus file media", type: "error" })
    }
  }

  return (
    <div className="space-y-6">
      {alertMsg && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center justify-between shadow-sm ${
            alertMsg.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200 dark:bg-green-950 dark:text-green-300"
              : "bg-red-50 text-red-800 border border-red-200 dark:bg-red-950 dark:text-red-300"
          }`}
        >
          <span>{alertMsg.text}</span>
          <button onClick={() => setAlertMsg(null)} className="font-bold">✕</button>
        </div>
      )}

      {/* Filter and Upload action bar */}
      <div className="flex items-center justify-between gap-4 bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm dark:bg-gray-900 dark:border-gray-800">
        <div className="flex gap-2">
          {(["ALL", "IMAGE", "VIDEO"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterType === t
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              {t === "ALL" && "Semua Media"}
              {t === "IMAGE" && "📷 Gambar"}
              {t === "VIDEO" && "🎬 Video"}
            </button>
          ))}
        </div>

        <Button size="sm" onClick={() => setUploadModalOpen(true)}>
          📎 Unggah Media
        </Button>
      </div>

      {/* Media Grid */}
      {filtered.length === 0 ? (
        <Card className="border-gray-200 dark:border-gray-800">
          <CardContent className="py-16 text-center">
            <p className="text-4xl mb-3">🖼️</p>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
              Belum ada file media yang diunggah.
            </p>
            <Button size="sm" className="mt-4" onClick={() => setUploadModalOpen(true)}>
              Unggah Media Pertama
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
          {filtered.map((file) => (
            <Card
              key={file.id}
              onClick={() => setSelectedMedia(file)}
              className="overflow-hidden group cursor-pointer border-gray-200 hover:shadow-lg transition-all dark:border-gray-800"
            >
              <div className="aspect-square relative bg-gray-100 dark:bg-gray-900 overflow-hidden">
                {file.type === "IMAGE" ? (
                  <img
                    src={file.url}
                    alt={file.originalName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                    <span className="text-4xl mb-1">🎬</span>
                    <span className="text-[10px]">Video File</span>
                  </div>
                )}

                {/* Hover overlay with action */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Badge variant="secondary" className="text-[10px]">
                    {file.type === "IMAGE" ? "Lihat" : "Putar"}
                  </Badge>
                  <button
                    type="button"
                    onClick={(e) => handleDeleteMedia(file.id, e)}
                    className="w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-700"
                    title="Hapus"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <CardContent className="p-2.5">
                <p className="text-xs font-medium text-gray-800 truncate dark:text-gray-200">
                  {file.originalName}
                </p>
                <div className="flex items-center justify-between text-[10px] text-gray-400 mt-1">
                  <span>{(file.size / 1024).toFixed(0)} KB</span>
                  <span>{formatDate(file.createdAt)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 dark:bg-gray-900 dark:border-gray-800 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 dark:border-gray-800">
              <h3 className="font-bold text-gray-900 dark:text-white text-base">
                Unggah File Media
              </h3>
              <button
                type="button"
                onClick={() => setUploadModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
              <div className="text-center p-4">
                <span className="text-3xl block mb-2">📁</span>
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                  {uploading ? "Sedang Mengunggah..." : "Klik untuk memilih file dari komputer Anda"}
                </p>
                <p className="text-[10px] text-gray-400 mt-1">
                  Format gambar (PNG, JPG, WebP) atau video (MP4) hingga 10MB
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*,video/*"
                multiple
                disabled={uploading}
                onChange={handleUploadFiles}
              />
            </label>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setUploadModalOpen(false)}>
                Batal
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Media Detail Preview Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-gray-200 dark:bg-gray-900 dark:border-gray-800 space-y-4">
            <div className="flex items-center justify-between border-b pb-2 dark:border-gray-800">
              <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate max-w-xs">
                {selectedMedia.originalName}
              </h4>
              <button
                type="button"
                onClick={() => setSelectedMedia(null)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[60vh] overflow-hidden rounded-xl bg-black flex items-center justify-center">
              {selectedMedia.type === "IMAGE" ? (
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.originalName}
                  className="max-h-[60vh] w-auto object-contain"
                />
              ) : (
                <video src={selectedMedia.url} controls className="max-h-[60vh] w-full" />
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t dark:border-gray-800">
              <span>Ukuran: {(selectedMedia.size / (1024 * 1024)).toFixed(2)} MB</span>
              <Button size="sm" variant="outline" onClick={() => setSelectedMedia(null)}>
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
