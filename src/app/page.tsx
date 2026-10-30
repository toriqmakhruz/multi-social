import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">MS</span>
          </div>
          <span className="font-bold text-xl text-gray-900 dark:text-white">Multi Social</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/masuk">
            <Button variant="ghost">Masuk</Button>
          </Link>
          <Link href="/daftar">
            <Button>Daftar Gratis</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6 dark:bg-blue-900/30 dark:text-blue-400">
            🚀 Kelola 4 Platform Sekaligus
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6 dark:text-white">
            Kelola Semua <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Media Sosial
            </span>
            <br />dari Satu Tempat
          </h1>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed dark:text-gray-400">
            Jadwalkan postingan, pantau analitik, dan kelola akun YouTube, Instagram, Facebook & TikTok dari satu dashboard yang mudah digunakan.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/daftar">
              <Button size="lg" className="text-base px-8">
                Mulai Sekarang →
              </Button>
            </Link>
          </div>
        </div>

        {/* Platform icons */}
        <div className="flex items-center justify-center gap-8 mt-16">
          {[
            { name: "YouTube", color: "text-red-600", icon: "▶" },
            { name: "Instagram", color: "text-pink-600", icon: "📷" },
            { name: "Facebook", color: "text-blue-600", icon: "f" },
            { name: "TikTok", color: "text-gray-900 dark:text-white", icon: "♪" },
          ].map((platform) => (
            <div key={platform.name} className="flex flex-col items-center gap-2">
              <div className={`w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center text-2xl ${platform.color} dark:bg-gray-800`}>
                {platform.icon}
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">{platform.name}</span>
            </div>
          ))}
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          {[
            {
              icon: "📅",
              title: "Jadwalkan Postingan",
              desc: "Buat dan jadwalkan postingan ke semua platform sekaligus. Pilih tanggal dan jam, biarkan sistem yang posting.",
            },
            {
              icon: "📊",
              title: "Pantau Analitik",
              desc: "Lihat performa postingan di semua platform dalam satu halaman. Likes, komentar, views, dan lainnya.",
            },
            {
              icon: "🖼️",
              title: "Kelola Media",
              desc: "Upload dan kelola semua gambar dan video di satu tempat. Gunakan berulang kali untuk postingan berbeda.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700"
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400">
          <p>© 2026 Multi Social. Dibuat untuk memudahkan pengelolaan media sosial.</p>
          <div className="flex items-center gap-6 text-xs">
            <Link href="/terms" className="hover:text-blue-600 underline">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-blue-600 underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
