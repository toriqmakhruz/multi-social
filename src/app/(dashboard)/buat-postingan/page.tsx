"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SocialPreview } from "@/components/features/social-preview"

const platforms = [
  { id: "YOUTUBE", name: "YouTube", icon: "▶", color: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800" },
  { id: "INSTAGRAM", name: "Instagram", icon: "📷", color: "bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-400 dark:border-pink-800" },
  { id: "FACEBOOK", name: "Facebook", icon: "👤", color: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800" },
  { id: "TIKTOK", name: "TikTok", icon: "♪", color: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700" },
]

export default function BuatPostinganPage() {
  const router = useRouter()
  const [content, setContent] = useState("")
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["INSTAGRAM"])
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
        ? prev.length > 1
          ? prev.filter((p) => p !== platformId)
          : prev
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

  const handleSubmit = async (status: "DRAFT" | "SCHEDULED" | "PUBLISHING") => {
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          ✏️ Buat & Jadwalkan Postingan
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Tulis konten, sesuaikan media, dan lihat live preview simulasi di setiap media sosial
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-4 rounded-lg dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Editor (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Platform selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Pilih Platform Tujuan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {platforms.map((platform) => {
                  const isSelected = selectedPlatforms.includes(platform.id)
                  return (
                    <button
                      key={platform.id}
                      type="button"
                      onClick={() => togglePlatform(platform.id)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                        isSelected
                          ? `${platform.color} border-current ring-2 ring-offset-1 ring-blue-500 shadow-sm`
                          : "border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400"
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <span className="text-base">{platform.icon}</span>
                        {platform.name}
                      </span>
                      {isSelected && <span className="font-bold">✓</span>}
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Content input */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Konten & Caption</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder="Apa yang ingin Anda bagikan hari ini? Tulis teks, hashtag, atau link di sini..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                className="text-sm leading-relaxed"
              />
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>{content.length} karakter</span>
                <div className="flex gap-2">
                  {selectedPlatforms.includes("INSTAGRAM") && content.length > 2200 && (
                    <Badge variant="warning">Instagram: max 2.200</Badge>
                  )}
                  {selectedPlatforms.includes("FACEBOOK") && content.length > 63206 && (
                    <Badge variant="warning">Facebook: max 63.206</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Media upload */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Unggah Media (Foto / Video)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 transition-colors">
                  <div className="text-center">
                    <p className="text-2xl mb-1">📎</p>
                    <p className="text-xs text-gray-600 font-medium dark:text-gray-300">
                      Klik atau seret file gambar/video ke sini
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      PNG, JPG, MP4 (Maksimal 10MB)
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
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                    {mediaPreviews.map((preview, index) => (
                      <div key={index} className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                        <img
                          src={preview}
                          alt={`Media ${index + 1}`}
                          className="w-full h-20 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeMedia(index)}
                          className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white rounded-full text-[10px] opacity-90 hover:opacity-100 flex items-center justify-center shadow"
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
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Pengaturan Waktu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isScheduled}
                    onChange={(e) => setIsScheduled(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Jadwalkan untuk waktu tertentu (Auto-Publish)
                  </span>
                </label>

                {isScheduled && (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1 dark:text-gray-400">
                        Tanggal Posting
                      </label>
                      <Input
                        type="date"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        required={isScheduled}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1 dark:text-gray-400">
                        Waktu / Jam
                      </label>
                      <Input
                        type="time"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        required={isScheduled}
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSubmit("DRAFT")}
              disabled={loading}
            >
              💾 Simpan Draf
            </Button>
            <Button
              type="button"
              onClick={() => handleSubmit(isScheduled ? "SCHEDULED" : "PUBLISHING")}
              disabled={loading}
            >
              {loading
                ? "Memproses..."
                : isScheduled
                ? "📅 Jadwalkan Postingan"
                : "🚀 Terbitkan Sekarang"}
            </Button>
          </div>
        </div>

        {/* Right Column: Live Mockup Preview (5 cols, sticky) */}
        <div className="lg:col-span-5 sticky top-20">
          <SocialPreview
            content={content}
            mediaPreviews={mediaPreviews}
            selectedPlatforms={selectedPlatforms}
          />
        </div>
      </div>
    </div>
  )
}
