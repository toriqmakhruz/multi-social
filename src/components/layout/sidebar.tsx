"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const menuItems = [
  { href: "/beranda", label: "Beranda", icon: "🏠" },
  { href: "/buat-postingan", label: "Buat Postingan", icon: "✏️" },
  { href: "/kalender", label: "Kalender", icon: "📅" },
  { href: "/postingan", label: "Postingan", icon: "📝" },
  { href: "/media", label: "Media", icon: "🖼️" },
  { href: "/analitik", label: "Analitik", icon: "📊" },
  { href: "/akun-sosmed", label: "Akun Sosmed", icon: "🔗" },
  { href: "/pengaturan", label: "Pengaturan", icon: "⚙️" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-6 border-b border-gray-200 dark:border-gray-700">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">MS</span>
        </div>
        <span className="font-bold text-lg text-gray-900 dark:text-white">Multi Social</span>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              )}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
