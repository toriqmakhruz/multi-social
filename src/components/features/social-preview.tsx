"use client"

import React, { useState } from "react"
import { getPlatformName } from "@/lib/utils"

interface SocialPreviewProps {
  content: string
  mediaPreviews: string[]
  selectedPlatforms: string[]
  accountName?: string
  username?: string
}

export function SocialPreview({
  content,
  mediaPreviews,
  selectedPlatforms,
  accountName = "Multi Social",
  username = "multisocial_user",
}: SocialPreviewProps) {
  const activePlatforms = selectedPlatforms.length > 0 ? selectedPlatforms : ["INSTAGRAM"]
  const [activeTab, setActiveTab] = useState<string>(activePlatforms[0] || "INSTAGRAM")

  // Ensure active tab stays valid if selection changes
  const currentTab = activePlatforms.includes(activeTab) ? activeTab : activePlatforms[0]

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 dark:bg-gray-900 dark:border-gray-800">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            👁️ Preview Tampilan Live
          </span>
          <span className="text-xs text-gray-400">
            (Pilih tab untuk melihat tampilan per platform)
          </span>
        </div>

        {/* Tab switchers */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg dark:bg-gray-800">
          {activePlatforms.map((plat) => (
            <button
              key={plat}
              type="button"
              onClick={() => setActiveTab(plat)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                currentTab === plat
                  ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              {plat === "INSTAGRAM" && "📷 Instagram"}
              {plat === "FACEBOOK" && "👤 Facebook"}
              {plat === "TIKTOK" && "♪ TikTok"}
              {plat === "YOUTUBE" && "▶ YouTube"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-center py-2">
        {currentTab === "INSTAGRAM" && (
          <InstagramMockup
            content={content}
            media={mediaPreviews}
            username={username}
          />
        )}
        {currentTab === "FACEBOOK" && (
          <FacebookMockup
            content={content}
            media={mediaPreviews}
            accountName={accountName}
          />
        )}
        {currentTab === "TIKTOK" && (
          <TikTokMockup
            content={content}
            media={mediaPreviews}
            username={username}
          />
        )}
        {currentTab === "YOUTUBE" && (
          <YouTubeMockup
            content={content}
            media={mediaPreviews}
            accountName={accountName}
          />
        )}
      </div>
    </div>
  )
}

function InstagramMockup({ content, media, username }: { content: string; media: string[]; username: string }) {
  return (
    <div className="w-full max-w-[360px] bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden dark:bg-black dark:border-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-600 p-[2px]">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center font-bold text-xs text-pink-600 dark:bg-black">
              {username.charAt(0).toUpperCase()}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-900 dark:text-white leading-tight">{username}</p>
            <p className="text-[10px] text-gray-400">Sponsored • Bersponsor</p>
          </div>
        </div>
        <span className="text-gray-400 text-sm">•••</span>
      </div>

      {/* Media image or placeholder */}
      <div className="aspect-square bg-gray-100 relative flex items-center justify-center dark:bg-gray-900">
        {media.length > 0 ? (
          <img src={media[0]} alt="IG Post" className="w-full h-full object-cover" />
        ) : (
          <div className="text-center p-6 text-gray-400">
            <span className="text-3xl block mb-1">📷</span>
            <span className="text-xs">Gambar postingan akan muncul di sini</span>
          </div>
        )}
        {media.length > 1 && (
          <span className="absolute top-2 right-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
            1/{media.length}
          </span>
        )}
      </div>

      {/* Action icons */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3 text-lg">
            <span>❤️</span>
            <span>💬</span>
            <span>↗️</span>
          </div>
          <span className="text-lg">🔖</span>
        </div>
        <p className="text-xs font-semibold text-gray-900 dark:text-white mb-1">128 suka</p>

        {/* Caption */}
        <div className="text-xs text-gray-800 dark:text-gray-200">
          <span className="font-semibold mr-1">{username}</span>
          <span className="whitespace-pre-line">
            {content ? content : "Tuliskan caption postingan Anda di form sebelah kiri..."}
          </span>
        </div>
        <p className="text-[10px] text-gray-400 mt-2 uppercase">Baru Saja</p>
      </div>
    </div>
  )
}

function FacebookMockup({ content, media, accountName }: { content: string; media: string[]; accountName: string }) {
  return (
    <div className="w-full max-w-[390px] bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden dark:bg-gray-900 dark:border-gray-800">
      {/* Header */}
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              {accountName.charAt(0)}
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900 dark:text-white">{accountName}</p>
              <div className="flex items-center gap-1 text-[10px] text-gray-500">
                <span>Baru saja</span>
                <span>•</span>
                <span>🌐 Publik</span>
              </div>
            </div>
          </div>
          <span className="text-gray-400">•••</span>
        </div>

        {/* Text */}
        <p className="text-xs text-gray-800 dark:text-gray-200 mt-2 whitespace-pre-line leading-relaxed">
          {content ? content : "Tuliskan konten Facebook Anda di form sebelah kiri..."}
        </p>
      </div>

      {/* Media */}
      {media.length > 0 && (
        <div className="w-full max-h-72 bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <img src={media[0]} alt="FB Post" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Interaction Counts */}
      <div className="px-3 py-2 flex items-center justify-between text-[11px] text-gray-500 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-1">
          <span className="bg-blue-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">👍</span>
          <span>42</span>
        </div>
        <div>
          <span>5 komentar • 2 dibagikan</span>
        </div>
      </div>

      {/* Action Bar */}
      <div className="grid grid-cols-3 text-center py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400">
        <button className="flex items-center justify-center gap-1 hover:bg-gray-50 py-1 rounded dark:hover:bg-gray-800">
          <span>👍</span> Suka
        </button>
        <button className="flex items-center justify-center gap-1 hover:bg-gray-50 py-1 rounded dark:hover:bg-gray-800">
          <span>💬</span> Komentar
        </button>
        <button className="flex items-center justify-center gap-1 hover:bg-gray-50 py-1 rounded dark:hover:bg-gray-800">
          <span>↗️</span> Bagikan
        </button>
      </div>
    </div>
  )
}

function TikTokMockup({ content, media, username }: { content: string; media: string[]; username: string }) {
  return (
    <div className="w-full max-w-[280px] h-[480px] bg-black text-white rounded-3xl shadow-xl overflow-hidden relative flex flex-col justify-between p-3 border-4 border-gray-800">
      {/* Background Media */}
      {media.length > 0 ? (
        <img src={media[0]} alt="TikTok" className="absolute inset-0 w-full h-full object-cover opacity-80" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-950 to-black flex items-center justify-center">
          <span className="text-4xl">♪</span>
        </div>
      )}

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-center gap-4 text-xs font-semibold pt-1">
        <span className="text-gray-400">Mengikuti</span>
        <span className="border-b-2 border-white pb-0.5">Untuk Anda</span>
      </div>

      {/* Right Sidebar Icons */}
      <div className="relative z-10 self-end flex flex-col items-center gap-3 text-xs mb-8">
        <div className="w-9 h-9 rounded-full bg-white text-black font-bold flex items-center justify-center border-2 border-red-500">
          {username.charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col items-center">
          <span className="text-lg">❤️</span>
          <span className="text-[10px]">1.8k</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-lg">💬</span>
          <span className="text-[10px]">94</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-lg">🔖</span>
          <span className="text-[10px]">312</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-lg">↗️</span>
          <span className="text-[10px]">45</span>
        </div>
      </div>

      {/* Bottom Caption & Music */}
      <div className="relative z-10 max-w-[80%] space-y-1">
        <p className="text-xs font-bold">@{username}</p>
        <p className="text-[11px] line-clamp-3 leading-tight text-gray-200">
          {content ? content : "Caption video TikTok..."}
        </p>
        <div className="flex items-center gap-1 text-[10px] text-gray-300 pt-1">
          <span>🎵</span>
          <span className="truncate">Suara asli - {username}</span>
        </div>
      </div>
    </div>
  )
}

function YouTubeMockup({ content, media, accountName }: { content: string; media: string[]; accountName: string }) {
  const title = content.split("\n")[0] || "Judul Video YouTube"
  const description = content.split("\n").slice(1).join("\n") || content

  return (
    <div className="w-full max-w-[390px] bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden dark:bg-gray-900 dark:border-gray-800">
      {/* Video Thumbnail */}
      <div className="aspect-video bg-black relative flex items-center justify-center overflow-hidden">
        {media.length > 0 ? (
          <img src={media[0]} alt="YT Thumbnail" className="w-full h-full object-cover" />
        ) : (
          <div className="text-center text-gray-400">
            <span className="text-4xl block mb-1">▶️</span>
            <span className="text-xs">Thumbnail video YouTube</span>
          </div>
        )}
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
          04:20
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h4 className="text-xs font-bold text-gray-900 dark:text-white line-clamp-2 leading-snug">
          {title}
        </h4>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-7 h-7 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center">
            {accountName.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium text-gray-800 dark:text-gray-200 truncate">{accountName}</p>
            <p className="text-[10px] text-gray-400">1.2K subscriber • 340 ditonton • 2 jam lalu</p>
          </div>
          <button className="bg-red-600 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
            Subscribe
          </button>
        </div>

        {description && (
          <div className="mt-2 bg-gray-50 p-2 rounded-lg text-[10px] text-gray-600 line-clamp-2 dark:bg-gray-800 dark:text-gray-300">
            {description}
          </div>
        )}
      </div>
    </div>
  )
}
