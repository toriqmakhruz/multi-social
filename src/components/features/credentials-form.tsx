"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ExternalLink, Copy, Check, Info } from "lucide-react"

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
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [baseUrl, setBaseUrl] = useState("https://papayawhip-lapwing-389067.hostingersite.com")

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin)
    }
  }, [])

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

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

  const googleRedirectUri = `${baseUrl}/api/auth/callback/google`
  const metaRedirectUri = `${baseUrl}/api/auth/callback/meta`
  const tiktokRedirectUri = `${baseUrl}/api/auth/callback/tiktok`

  return (
    <Card className="border-blue-200 dark:border-blue-900 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔑</span>
          <div>
            <CardTitle className="text-lg">Kredensial API Media Sosial Resmi</CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Klik link developer portal di masing-masing platform untuk membuat & mengambil API Key Anda
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
          <div className="space-y-3.5 p-4 bg-red-50/50 rounded-xl border border-red-100 dark:bg-red-950/20 dark:border-red-900/40">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-red-100 dark:border-red-900/30">
              <div className="flex items-center gap-2 font-semibold text-sm text-red-600 dark:text-red-400">
                <span className="text-base">▶</span> YouTube Data API v3 (Google Cloud)
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="https://console.cloud.google.com/apis/credentials"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600 text-white hover:bg-red-700 text-xs font-medium rounded-lg shadow-xs transition"
                >
                  <span>Buka Google Credentials</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://console.cloud.google.com/apis/library/youtube.googleapis.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white text-red-700 border border-red-200 hover:bg-red-50 text-xs font-medium rounded-lg transition dark:bg-gray-800 dark:border-red-900 dark:text-red-300"
                >
                  <span>Aktifkan API</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Redirect URI Info */}
            <div className="bg-white dark:bg-gray-900 p-2.5 rounded-lg border border-red-100 dark:border-gray-800 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium">Authorized Redirect URI (Google Cloud Console):</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(googleRedirectUri, "google")}
                  className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                >
                  {copiedKey === "google" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-green-600">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin URI</span>
                    </>
                  )}
                </button>
              </div>
              <code className="block bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded text-[11px] font-mono text-gray-800 dark:text-gray-200 break-all select-all">
                {googleRedirectUri}
              </code>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">
                  Google Client ID
                </label>
                <Input
                  value={googleClientId}
                  onChange={(e) => setGoogleClientId(e.target.value)}
                  placeholder="xxxxx.apps.googleusercontent.com"
                  className="text-xs bg-white dark:bg-gray-900"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">
                  Google Client Secret
                </label>
                <Input
                  type="password"
                  value={googleClientSecret}
                  onChange={(e) => setGoogleClientSecret(e.target.value)}
                  placeholder="GOCSPX-xxxxxxxx"
                  className="text-xs bg-white dark:bg-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Meta / FB & IG */}
          <div className="space-y-3.5 p-4 bg-blue-50/50 rounded-xl border border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/40">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-blue-100 dark:border-blue-900/30">
              <div className="flex items-center gap-2 font-semibold text-sm text-blue-600 dark:text-blue-400">
                <span className="text-base">👥 & 📷</span> Meta Graph API (Facebook & Instagram)
              </div>
              <a
                href="https://developers.facebook.com/apps/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-600 text-white hover:bg-blue-700 text-xs font-medium rounded-lg shadow-xs transition"
              >
                <span>Buka Meta for Developers</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Redirect URI Info */}
            <div className="bg-white dark:bg-gray-900 p-2.5 rounded-lg border border-blue-100 dark:border-gray-800 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium">Valid OAuth Redirect URI (Meta Login Settings):</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(metaRedirectUri, "meta")}
                  className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                >
                  {copiedKey === "meta" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-green-600">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin URI</span>
                    </>
                  )}
                </button>
              </div>
              <code className="block bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded text-[11px] font-mono text-gray-800 dark:text-gray-200 break-all select-all">
                {metaRedirectUri}
              </code>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">
                  Meta App ID (Client ID)
                </label>
                <Input
                  value={facebookClientId}
                  onChange={(e) => setFacebookClientId(e.target.value)}
                  placeholder="123456789012345"
                  className="text-xs bg-white dark:bg-gray-900"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">
                  Meta App Secret
                </label>
                <Input
                  type="password"
                  value={facebookClientSecret}
                  onChange={(e) => setFacebookClientSecret(e.target.value)}
                  placeholder="e3b0c44298fc1c149afbf4c8996fb924"
                  className="text-xs bg-white dark:bg-gray-900"
                />
              </div>
            </div>
          </div>

          {/* TikTok */}
          <div className="space-y-3.5 p-4 bg-gray-100/70 rounded-xl border border-gray-200 dark:bg-gray-800/60 dark:border-gray-700">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 font-semibold text-sm text-gray-900 dark:text-gray-100">
                <span className="text-base">♪</span> TikTok Content Posting API
              </div>
              <a
                href="https://developers.tiktok.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-900 hover:bg-black text-white text-xs font-medium rounded-lg shadow-xs transition dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                <span>Buka TikTok for Developers</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Redirect URI Info */}
            <div className="bg-white dark:bg-gray-900 p-2.5 rounded-lg border border-gray-200 dark:border-gray-800 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium">Redirect URL (TikTok App Settings):</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(tiktokRedirectUri, "tiktok")}
                  className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                >
                  {copiedKey === "tiktok" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-green-600">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin URI</span>
                    </>
                  )}
                </button>
              </div>
              <code className="block bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded text-[11px] font-mono text-gray-800 dark:text-gray-200 break-all select-all">
                {tiktokRedirectUri}
              </code>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">
                  TikTok Client Key
                </label>
                <Input
                  value={tiktokClientKey}
                  onChange={(e) => setTiktokClientKey(e.target.value)}
                  placeholder="awxxxxxxxx"
                  className="text-xs bg-white dark:bg-gray-900"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">
                  TikTok Client Secret
                </label>
                <Input
                  type="password"
                  value={tiktokClientSecret}
                  onChange={(e) => setTiktokClientSecret(e.target.value)}
                  placeholder="xxxxxxxxxxxxxxxxxxxxxxxx"
                  className="text-xs bg-white dark:bg-gray-900"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={loading} size="default" className="px-6 font-semibold">
              {loading ? "Menyimpan..." : "💾 Simpan Kredensial API"}
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  )
}
