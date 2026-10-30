"use client"

import { useState, useRef, useEffect } from "react"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { Avatar } from "@/components/ui/avatar"

interface UserMenuProps {
  name: string
  email: string
  image?: string | null
}

export function UserMenu({ name, email, image }: UserMenuProps) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <Avatar src={image} alt={name} fallback={name.charAt(0)} size="sm" />
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{email}</p>
        </div>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{email}</p>
          </div>
          <Link
            href="/pengaturan"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
            onClick={() => setOpen(false)}
          >
            ⚙️ Pengaturan
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            🚪 Keluar
          </button>
        </div>
      )}
    </div>
  )
}
