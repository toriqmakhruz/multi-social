import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date))
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
  return num.toString()
}

export function getPlatformColor(platform: string): string {
  const colors: Record<string, string> = {
    YOUTUBE: "#FF0000",
    INSTAGRAM: "#E4405F",
    FACEBOOK: "#1877F2",
    TIKTOK: "#000000",
  }
  return colors[platform] || "#6B7280"
}

export function getPlatformName(platform: string): string {
  const names: Record<string, string> = {
    YOUTUBE: "YouTube",
    INSTAGRAM: "Instagram",
    FACEBOOK: "Facebook",
    TIKTOK: "TikTok",
  }
  return names[platform] || platform
}
