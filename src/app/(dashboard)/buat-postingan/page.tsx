"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const platforms = [
  { id: "YOUTUBE", name: "YouTube", icon: "▶", color: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800" },
  { id: "INSTAGRAM", name: "Instagram", icon: "📷", color: "bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-400 dark:border-pink-800" },
  { id: "FACEBOOK", name: "Facebook", icon: "👤", color: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800" },
  { id: "TIKTOK", name: "TikTok", icon: "♪", color: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700" },
]

export default function BuatPostinganPage() {
  const router = useRouter()
  const [content, setContent] = useState("")
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [scheduleDate, setScheduleDate] = useState("")
  const [scheduleTime, setScheduleTime] = useState("")
  const [isScheduled, setIsScheduled] = useState(false)
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((p) => p !== platformId)
        : [...prev, platformId]
    )
  }

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setMediaFiles((prev) => [...prev, ...files])

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setMediaPreviews((prev) => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeMedia = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index))
    setMediaPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (status: "DRAFT" | "SCHEDULED") => {
    setError("")

    if (!content.trim()) {
      setError("Konten postingan tidak boleh kosong")
      return
    }

    if (selectedPlatforms.length === 0) {
      setError("Pilih minimal satu platform")
      return
    }

    if (status === "SCHEDULED" && (!scheduleDate || !scheduleTime)) {
      setError("Tentukan tanggal dan waktu posting")
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("content", content)
      formData.append("status", status)
      formData.append("platforms", JSON.stringify(selectedPlatforms))

      if (status === "SCHEDULED") {
        formData.append("scheduledAt", `${scheduleDate}T${scheduleTime}`)
      }

      mediaFiles.forEach((file) => {
        formData.append("media", file)
      })

      const res = await fetch("/api/posts", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Gagal membuat postingan")
        return
      }

      router.push("/postingan")
      router.refresh()
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          ✏️ Buat Postingan
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Buat dan jadwalkan postingan ke platform media sosial Anda
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-4 rounded-lg dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Platform selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pilih Platform</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => togglePlatform(platform.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 transition-all text-sm font-medium ${
                  selectedPlatforms.includes(platform.id)
                    ? `${platform.color} border-current ring-2 ring-offset-2 ring-current`
                    : "border-gray-200 text-gray-500 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400"
                }`}
              >
                <span className="text-lg">{platform.icon}</span>
                {platform.name}
                {selectedPlatforms.includes(platform.id) && (
                  <span className="text-xs">✓</span>
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Konten Postingan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Tulis konten postingan Anda di sini..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="text-base"
          />
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>{content.length} karakter</span>
            <div className="flex gap-2">
              {selectedPlatforms.includes("INSTAGRAM") && content.length > 2200 && (
                <Badge variant="warning">Instagram: maks 2.200</Badge>
              )}
              {selectedPlatforms.includes("FACEBOOK") && content.length > 63206 && (
                <Badge variant="warning">Facebook: maks 63.206</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Media upload */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Media</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800">
              <div className="text-center">
                <p className="text-2xl mb-1">📎</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Klik untuk upload gambar atau video
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  PNG, JPG, MP4 (maks 10MB)
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*,video/*"
                multiple
                onChange={handleMediaChange}
              />
            </label>

            {mediaPreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {mediaPreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Media ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeMedia(index)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Jadwal Posting</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isScheduled}
                onChange={(e) => setIsScheduled(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Jadwalkan untuk nanti
              </span>
            </label>

            {isScheduled && (
              <div className="flex gap-4 ml-7">
                <div className="flex-1">
                  <label className="block text-sm text-gray-600 mb-1 dark:text-gray-400">Tanggal</label>
                  <Input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-gray-600 mb-1 dark:text-gray-400">Waktu</label>
                  <Input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pb-8">
        <Button
          variant="outline"
          onClick={() => handleSubmit("DRAFT")}
          disabled={loading}
        >
          💾 Simpan Draf
        </Button>
        <Button
          onClick={() => handleSubmit(isScheduled ? "SCHEDULED" : "DRAFT")}
          disabled={loading}
        >
          {loading
            ? "Memproses..."
            : isScheduled
            ? "📅 Jadwalkan Postingan"
            : "📤 Posting Sekarang"}
        </Button>
      </div>
    </div>
  )
}
