"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getPlatformName } from "@/lib/utils"

interface CalendarPost {
  id: string
  content: string
  status: string
  scheduledAt: string | null
  publishedAt: string | null
  platforms: {
    id: string
    socialAccount: {
      platform: string
      displayName: string | null
      platformUsername: string
    }
  }[]
}

interface ContentCalendarProps {
  initialPosts: CalendarPost[]
}

const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
]

const DAY_NAMES = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"]

export function ContentCalendar({ initialPosts }: ContentCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedPost, setSelectedPost] = useState<CalendarPost | null>(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // First day of month and total days
  const firstDayIndex = new Date(year, month, 1).getDay()
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate()
  const totalDaysInPrevMonth = new Date(year, month, 0).getDate()

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Group posts by date string "YYYY-MM-DD"
  const postsByDate: Record<string, CalendarPost[]> = {}
  initialPosts.forEach((post) => {
    const targetDate = post.scheduledAt || post.publishedAt
    if (!targetDate) return

    const d = new Date(targetDate)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
    if (!postsByDate[key]) postsByDate[key] = []
    postsByDate[key].push(post)
  })

  // Build grid calendar cells (42 cells: 6 weeks)
  const calendarCells = []

  // Prev month filler days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const dayNum = totalDaysInPrevMonth - i
    calendarCells.push({
      day: dayNum,
      isCurrentMonth: false,
      dateKey: `${month === 0 ? year - 1 : year}-${String(month === 0 ? 12 : month).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`,
    })
  }

  // Current month days
  const today = new Date()
  const isThisMonth = today.getFullYear() === year && today.getMonth() === month

  for (let d = 1; d <= totalDaysInMonth; d++) {
    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`
    const isToday = isThisMonth && today.getDate() === d
    calendarCells.push({
      day: d,
      isCurrentMonth: true,
      isToday,
      dateKey,
    })
  }

  // Next month filler days to complete 35 or 42 cells
  const remainingCells = (calendarCells.length > 35 ? 42 : 35) - calendarCells.length
  for (let d = 1; d <= remainingCells; d++) {
    calendarCells.push({
      day: d,
      isCurrentMonth: false,
      dateKey: `${month === 11 ? year + 1 : year}-${String(month === 11 ? 1 : month + 2).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
    })
  }

  const statusColors: Record<string, string> = {
    DRAFT: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    SCHEDULED: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
    PUBLISHED: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
    FAILED: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
  }

  return (
    <div className="space-y-6">
      {/* Calendar Header / Nav */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm dark:bg-gray-900 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {MONTH_NAMES[month]} {year}
          </h2>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Hari Ini
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={prevMonth}>
            ◀ Bulan Lalu
          </Button>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            Bulan Depan ▶
          </Button>
          <Link href="/buat-postingan">
            <Button size="sm">
              ✏️ Jadwalkan Post
            </Button>
          </Link>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden dark:bg-gray-900 dark:border-gray-800">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50 text-center py-2.5 text-xs font-semibold text-gray-600 dark:bg-gray-800/60 dark:border-gray-800 dark:text-gray-300">
          {DAY_NAMES.map((name, i) => (
            <div key={name} className={i === 0 ? "text-red-500" : ""}>
              {name}
            </div>
          ))}
        </div>

        {/* Days Cells */}
        <div className="grid grid-cols-7 divide-x divide-y divide-gray-200 dark:divide-gray-800">
          {calendarCells.map((cell, index) => {
            const dayPosts = postsByDate[cell.dateKey] || []

            return (
              <div
                key={index}
                className={`min-h-[110px] p-1.5 flex flex-col justify-between transition-colors ${
                  cell.isCurrentMonth
                    ? "bg-white hover:bg-gray-50/80 dark:bg-gray-900 dark:hover:bg-gray-800/40"
                    : "bg-gray-50/50 text-gray-400 dark:bg-gray-950/40 dark:text-gray-600"
                }`}
              >
                {/* Date header */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                      cell.isToday
                        ? "bg-blue-600 text-white"
                        : cell.isCurrentMonth
                        ? "text-gray-800 dark:text-gray-200"
                        : "text-gray-400 dark:text-gray-600"
                    }`}
                  >
                    {cell.day}
                  </span>

                  {cell.isCurrentMonth && (
                    <Link
                      href={`/buat-postingan?date=${cell.dateKey}`}
                      className="opacity-0 hover:opacity-100 text-[10px] text-blue-600 font-bold px-1 hover:bg-blue-50 rounded dark:hover:bg-blue-900/40"
                      title="Tambah postingan untuk tanggal ini"
                    >
                      +
                    </Link>
                  )}
                </div>

                {/* Posts for this day */}
                <div className="space-y-1 mt-1 flex-1 overflow-y-auto max-h-20">
                  {dayPosts.map((post) => (
                    <button
                      key={post.id}
                      type="button"
                      onClick={() => setSelectedPost(post)}
                      className={`w-full text-left p-1 rounded text-[10px] font-medium truncate block border border-transparent hover:border-gray-300 dark:hover:border-gray-700 transition-all ${
                        statusColors[post.status] || "bg-gray-100"
                      }`}
                    >
                      <span className="mr-1">
                        {post.platforms.map((p) => {
                          if (p.socialAccount.platform === "YOUTUBE") return "▶"
                          if (p.socialAccount.platform === "INSTAGRAM") return "📷"
                          if (p.socialAccount.platform === "FACEBOOK") return "👤"
                          if (p.socialAccount.platform === "TIKTOK") return "♪"
                          return "•"
                        }).join("")}
                      </span>
                      <span>{post.content}</span>
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Post Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 dark:bg-gray-900 dark:border-gray-800 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 dark:border-gray-800">
              <h3 className="font-bold text-gray-900 dark:text-white">
                Detail Postingan Terjadwal
              </h3>
              <button
                type="button"
                onClick={() => setSelectedPost(null)}
                className="text-gray-400 hover:text-gray-600 text-lg"
              >
                ✕
              </button>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Status:</p>
              <Badge>{selectedPost.status}</Badge>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Platform Tujuan:</p>
              <div className="flex gap-2">
                {selectedPost.platforms.map((p) => (
                  <Badge key={p.id} variant="secondary">
                    {getPlatformName(p.socialAccount.platform)}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Konten:</p>
              <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-800 whitespace-pre-line dark:bg-gray-800 dark:text-gray-200 max-h-48 overflow-y-auto">
                {selectedPost.content}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Link href="/postingan">
                <Button variant="outline" size="sm">
                  Lihat di Daftar Post
                </Button>
              </Link>
              <Button size="sm" onClick={() => setSelectedPost(null)}>
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
