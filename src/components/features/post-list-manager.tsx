"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDateTime, getPlatformName } from "@/lib/utils"

export interface PostItem {
  id: string
  content: string
  status: "DRAFT" | "SCHEDULED" | "PUBLISHING" | "PUBLISHED" | "FAILED"
  scheduledAt: string | null
  publishedAt: string | null
  createdAt: string
  platforms: {
    id: string
    status: string
    errorMessage: string | null
    socialAccount: {
      platform: string
      displayName: string | null
      platformUsername: string
    }
  }[]
  media: {
    id: string
    media: {
      id: string
      url: string
      originalName: string
      type: string
    }
  }[]
}

interface PostListManagerProps {
  initialPosts: PostItem[]
}

export function PostListManager({ initialPosts }: PostListManagerProps) {
  const router = useRouter()
  const [posts, setPosts] = useState<PostItem[]>(initialPosts)
  const [statusFilter, setStatusFilter] = useState<string>("ALL")
  const [searchQuery, setSearchQuery] = useState("")
  const [activePost, setActivePost] = useState<PostItem | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)

  const statusLabels: Record<string, string> = {
    DRAFT: "Draf",
    SCHEDULED: "Terjadwal",
    PUBLISHING: "Memposting",
    PUBLISHED: "Terbit",
    FAILED: "Gagal",
  }

  const statusVariants: Record<string, "default" | "secondary" | "destructive" | "success" | "warning"> = {
    DRAFT: "secondary",
    SCHEDULED: "warning",
    PUBLISHING: "default",
    PUBLISHED: "success",
    FAILED: "destructive",
  }

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    const matchesStatus = statusFilter === "ALL" || post.status === statusFilter
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  // Action: Publish Now
  const handlePublishNow = async (postId: string) => {
    if (!confirm("Apakah Anda yakin ingin menerbitkan postingan ini sekarang?")) return

    setActionLoading(postId)
    setMessage(null)

    try {
      const res = await fetch(`/api/posts/${postId}/publish`, {
        method: "POST",
      })

      const data = await res.json()

      if (!res.ok) {
        setMessage({ text: data.error || "Gagal menerbitkan", type: "error" })
        return
      }

      setMessage({ text: "Postingan berhasil diterbitkan!", type: "success" })
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, status: "PUBLISHED", publishedAt: new Date().toISOString() } : p))
      )
      router.refresh()
    } catch {
      setMessage({ text: "Terjadi kesalahan saat memproses", type: "error" })
    } finally {
      setActionLoading(null)
    }
  }

  // Action: Delete Post
  const handleDeletePost = async (postId: string) => {
    if (!confirm("Hapus postingan ini secara permanen?")) return

    setActionLoading(postId)
    setMessage(null)

    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const data = await res.json()
        setMessage({ text: data.error || "Gagal menghapus", type: "error" })
        return
      }

      setMessage({ text: "Postingan berhasil dihapus", type: "success" })
      setPosts((prev) => prev.filter((p) => p.id !== postId))
      if (activePost?.id === postId) setActivePost(null)
      router.refresh()
    } catch {
      setMessage({ text: "Terjadi kesalahan saat menghapus", type: "error" })
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Alert Message */}
      {message && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center justify-between shadow-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-300"
              : "bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-300"
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="text-xs font-bold px-2">
            ✕
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm dark:bg-gray-900 dark:border-gray-800">
        {/* Status Pills */}
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {[
            { id: "ALL", label: "Semua" },
            { id: "DRAFT", label: "Draf" },
            { id: "SCHEDULED", label: "Terjadwal" },
            { id: "PUBLISHED", label: "Terbit" },
            { id: "FAILED", label: "Gagal" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === tab.id
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Cari konten postingan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-gray-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>

      {/* Post List */}
      {filteredPosts.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              Tidak ada postingan yang sesuai filter.
            </p>
            <Link href="/buat-postingan" className="inline-block mt-4">
              <Button size="sm">✏️ Buat Postingan Baru</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3.5">
          {filteredPosts.map((post) => (
            <Card
              key={post.id}
              className="hover:shadow-md transition-all duration-200 border-gray-200 dark:border-gray-800"
            >
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Content info */}
                  <div className="min-w-0 flex-1 space-y-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 leading-relaxed">
                      {post.content}
                    </p>

                    <div className="flex items-center gap-2.5 flex-wrap text-xs text-gray-500 dark:text-gray-400">
                      {/* Platform icons */}
                      <div className="flex items-center gap-1.5 bg-gray-100 px-2 py-0.5 rounded-md dark:bg-gray-800">
                        {post.platforms.map((pp) => (
                          <span key={pp.id} title={getPlatformName(pp.socialAccount.platform)}>
                            {pp.socialAccount.platform === "YOUTUBE" && "▶"}
                            {pp.socialAccount.platform === "INSTAGRAM" && "📷"}
                            {pp.socialAccount.platform === "FACEBOOK" && "👤"}
                            {pp.socialAccount.platform === "TIKTOK" && "♪"}
                          </span>
                        ))}
                      </div>

                      <span>• Dibuat: {formatDateTime(post.createdAt)}</span>

                      {post.scheduledAt && (
                        <span className="text-blue-600 font-medium dark:text-blue-400">
                          • 📅 Terjadwal: {formatDateTime(post.scheduledAt)}
                        </span>
                      )}

                      {post.publishedAt && (
                        <span className="text-green-600 font-medium dark:text-green-400">
                          • ✅ Terbit: {formatDateTime(post.publishedAt)}
                        </span>
                      )}
                    </div>

                    {/* Media preview row */}
                    {post.media.length > 0 && (
                      <div className="flex items-center gap-2 pt-1">
                        {post.media.slice(0, 4).map((m) => (
                          <img
                            key={m.id}
                            src={m.media.url}
                            alt=""
                            className="w-12 h-12 rounded-lg object-cover border border-gray-200 dark:border-gray-700"
                          />
                        ))}
                        {post.media.length > 4 && (
                          <span className="text-xs text-gray-400">+{post.media.length - 4} media</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions & Status */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <Badge variant={statusVariants[post.status]}>
                      {statusLabels[post.status]}
                    </Badge>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActivePost(post)}
                    >
                      Detail
                    </Button>

                    {(post.status === "DRAFT" || post.status === "SCHEDULED" || post.status === "FAILED") && (
                      <Button
                        size="sm"
                        onClick={() => handlePublishNow(post.id)}
                        disabled={actionLoading === post.id}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {actionLoading === post.id ? "..." : "Terbitkan"}
                      </Button>
                    )}

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeletePost(post.id)}
                      disabled={actionLoading === post.id}
                    >
                      Hapus
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {activePost && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 dark:bg-gray-900 dark:border-gray-800 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 dark:border-gray-800">
              <h3 className="font-bold text-gray-900 dark:text-white text-base">
                Detail Postingan
              </h3>
              <button
                type="button"
                onClick={() => setActivePost(null)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center justify-between">
              <Badge variant={statusVariants[activePost.status]}>
                {statusLabels[activePost.status]}
              </Badge>
              <span className="text-xs text-gray-400">
                {formatDateTime(activePost.createdAt)}
              </span>
            </div>

            {/* Target Platforms */}
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1.5">Platform Tujuan:</p>
              <div className="grid grid-cols-2 gap-2">
                {activePost.platforms.map((pp) => (
                  <div
                    key={pp.id}
                    className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs flex items-center justify-between"
                  >
                    <span>{getPlatformName(pp.socialAccount.platform)}</span>
                    <Badge variant={pp.status === "PUBLISHED" ? "success" : "secondary"}>
                      {pp.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Content text */}
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1.5">Konten:</p>
              <div className="bg-gray-50 p-3.5 rounded-xl text-sm text-gray-800 whitespace-pre-line leading-relaxed dark:bg-gray-800 dark:text-gray-200">
                {activePost.content}
              </div>
            </div>

            {/* Media Gallery */}
            {activePost.media.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1.5">Media Terlampir:</p>
                <div className="grid grid-cols-2 gap-2">
                  {activePost.media.map((m) => (
                    <img
                      key={m.id}
                      src={m.media.url}
                      alt=""
                      className="w-full h-32 rounded-lg object-cover border border-gray-200 dark:border-gray-700"
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t dark:border-gray-800">
              <Button variant="outline" size="sm" onClick={() => setActivePost(null)}>
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
