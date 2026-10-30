"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface CredentialsFormProps {
  initialGoogleClientId?: string
  initialGoogleClientSecret?: string
  initialFacebookClientId?: string
  initialFacebookClientSecret?: string
  initialTiktokClientKey?: string
  initialTiktokClientSecret?: string
}

export function CredentialsForm({
  initialGoogleClientId = "",
  initialGoogleClientSecret = "",
  initialFacebookClientId = "",
  initialFacebookClientSecret = "",
  initialTiktokClientKey = "",
  initialTiktokClientSecret = "",
}: CredentialsFormProps) {
  const [googleClientId, setGoogleClientId] = useState(initialGoogleClientId)
  const [googleClientSecret, setGoogleClientSecret] = useState(initialGoogleClientSecret)
  const [facebookClientId, setFacebookClientId] = useState(initialFacebookClientId)
  const [facebookClientSecret, setFacebookClientSecret] = useState(initialFacebookClientSecret)
  const [tiktokClientKey, setTiktokClientKey] = useState(initialTiktokClientKey)
  const [tiktokClientSecret, setTiktokClientSecret] = useState(initialTiktokClientSecret)

  const [loading, setLoading] = useState(false)
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: "success" | "error" } | null>(null)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatusMsg(null)

    try {
      const res = await fetch("/api/settings/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          googleClientId,
          googleClientSecret,
          facebookClientId,
          facebookClientSecret,
          tiktokClientKey,
          tiktokClientSecret,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setStatusMsg({ text: data.error || "Gagal menyimpan", type: "error" })
        return
      }

      setStatusMsg({ text: "✅ Kredensial API resmi berhasil disimpan ke konfigurasi sistem!", type: "success" })
    } catch {
      setStatusMsg({ text: "Terjadi kesalahan koneksi", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-blue-200 dark:border-blue-900 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <span className="text-xl">🔑</span>
          <div>
            <CardTitle className="text-base">Kredensial API Media Sosial Resmi</CardTitle>
            <CardDescription>
              Masukkan API Key & Secret resmi untuk menghubungkan akun asli (bukan sandbox)
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <form onSubmit={handleSave}>
        <CardContent className="space-y-6">
          {statusMsg && (
            <div
              className={`p-3 rounded-lg text-xs font-medium ${
                statusMsg.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200 dark:bg-green-950 dark:text-green-300"
                  : "bg-red-50 text-red-800 border border-red-200 dark:bg-red-950 dark:text-red-300"
              }`}
            >
              {statusMsg.text}
            </div>
          )}

          {/* YouTube / Google */}
          <div className="space-y-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100 dark:bg-gray-800/60 dark:border-gray-800">
            <div className="flex items-center gap-2 font-semibold text-xs text-red-600">
              <span>▶</span> YouTube Data API v3 (Google Cloud Console)
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-gray-600 dark:text-gray-400 block mb-1">
                  Google Client ID
                </label>
                <Input
                  value={googleClientId}
                  onChange={(e) => setGoogleClientId(e.target.value)}
                  placeholder="xxxxx.apps.googleusercontent.com"
                  className="text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-gray-600 dark:text-gray-400 block mb-1">
                  Google Client Secret
                </label>
                <Input
                  type="password"
                  value={googleClientSecret}
                  onChange={(e) => setGoogleClientSecret(e.target.value)}
                  placeholder="GOCSPX-xxxxxxxx"
                  className="text-xs"
                />
              </div>
            </div>
          </div>

          {/* Meta / FB & IG */}
          <div className="space-y-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100 dark:bg-gray-800/60 dark:border-gray-800">
            <div className="flex items-center gap-2 font-semibold text-xs text-blue-600">
              <span>👤 & 📷</span> Meta Graph API (Facebook & Instagram)
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-gray-600 dark:text-gray-400 block mb-1">
                  Meta App ID (Client ID)
                </label>
                <Input
                  value={facebookClientId}
                  onChange={(e) => setFacebookClientId(e.target.value)}
                  placeholder="123456789012345"
                  className="text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-gray-600 dark:text-gray-400 block mb-1">
                  Meta App Secret
                </label>
                <Input
                  type="password"
                  value={facebookClientSecret}
                  onChange={(e) => setFacebookClientSecret(e.target.value)}
                  placeholder="e3b0c44298fc1c149afbf4c8996fb924"
                  className="text-xs"
                />
              </div>
            </div>
          </div>

          {/* TikTok */}
          <div className="space-y-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100 dark:bg-gray-800/60 dark:border-gray-800">
            <div className="flex items-center gap-2 font-semibold text-xs text-gray-900 dark:text-gray-100">
              <span>♪</span> TikTok Content Posting API
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-gray-600 dark:text-gray-400 block mb-1">
                  TikTok Client Key
                </label>
                <Input
                  value={tiktokClientKey}
                  onChange={(e) => setTiktokClientKey(e.target.value)}
                  placeholder="awxxxxxxxx"
                  className="text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-gray-600 dark:text-gray-400 block mb-1">
                  TikTok Client Secret
                </label>
                <Input
                  type="password"
                  value={tiktokClientSecret}
                  onChange={(e) => setTiktokClientSecret(e.target.value)}
                  placeholder="xxxxxxxxxxxxxxxxxxxxxxxx"
                  className="text-xs"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={loading} size="sm">
              {loading ? "Menyimpan..." : "💾 Simpan Kredensial API"}
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  )
}
