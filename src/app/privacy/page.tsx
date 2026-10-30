import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy (Kebijakan Privasi) - Multi Social",
  description: "Privacy Policy and Data Protection guidelines for Multi Social",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-950 dark:text-gray-200">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">MS</span>
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-white">Multi Social</span>
          </Link>
          <div className="flex items-center gap-4 text-sm font-medium">
            <Link href="/terms" className="text-gray-600 hover:text-blue-600 dark:text-gray-300">
              Terms of Service
            </Link>
            <Link href="/masuk" className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs">
              Masuk
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 md:p-12 shadow-xs border border-gray-100 dark:border-gray-800 space-y-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-green-600 dark:text-green-400">
              Privacy & Data Protection
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-1">
              Privacy Policy (Kebijakan Privasi)
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Terakhir diperbarui: 30 Oktober 2026 • Effective Date: October 30, 2026
            </p>
          </div>

          <hr className="border-gray-100 dark:border-gray-800" />

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              1. Introduction (Pendahuluan)
            </h2>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              Privasi Anda adalah prioritas utama kami. Kebijakan Privasi ini menjelaskan bagaimana <strong>Multi Social</strong> (
              <a href="https://ssm.toolku.id" className="text-blue-600 underline">
                https://ssm.toolku.id
              </a>
              ) mengumpulkan, menggunakan, menyimpan, dan melindungi data pribadi Anda saat menggunakan layanan manajemen
              media sosial kami.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              2. Data We Collect (Data yang Kami Kumpulkan)
            </h2>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              Kami hanya mengumpulkan data yang benar-benar dibutuhkan untuk menyediakan fungsionalitas manajemen media
              sosial:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-2 ml-2">
              <li>
                <strong>Data Akun Pengguna:</strong> Nama, alamat email, dan kata sandi terenkripsi saat Anda mendaftar di
                Multi Social.
              </li>
              <li>
                <strong>Data Profil Media Sosial:</strong> Username, nama tampilan, ID pengguna (open_id), dan foto avatar
                yang diberikan melalui izin OAuth resmi saat Anda menghubungkan akun TikTok, YouTube, Facebook, atau
                Instagram.
              </li>
              <li>
                <strong>Token Otentikasi (OAuth Tokens):</strong> Access token dan refresh token yang diperlukan untuk
                mempublikasikan konten atas nama Anda ke platform terkait secara aman.
              </li>
              <li>
                <strong>Konten Media:</strong> Video, gambar, dan caption yang Anda unggah ke Pustaka Media atau Penjadwal
                Konten untuk dipublikasikan.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              3. Use of TikTok APIs and Scopes (Penggunaan API & Izin TikTok)
            </h2>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              Aplikasi kami menggunakan TikTok Login Kit dan TikTok Content Posting API. Secara spesifik:
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl space-y-3 text-sm">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  • <code>user.info.basic</code>:
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Hanya digunakan untuk menampilkan identitas akun yang terhubung (username & avatar) di dashboard agar Anda
                  dapat mengonfirmasi status koneksi akun TikTok Anda.
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  • <code>video.upload</code>:
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Digunakan untuk mengunggah file video yang Anda pilih dari dashboard Multi Social ke server video TikTok
                  sebelum dipublikasikan.
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  • <code>video.publish</code>:
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Digunakan untuk menyelesaikan dan mempublikasikan video tersebut ke feed TikTok Anda sesuai dengan caption
                  dan waktu posting yang Anda tentukan.
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-500 italic">
              * Kami <strong>TIDAK PERNAH</strong> menjual, menyewakan, atau membagikan data akun TikTok Anda kepada pihak
              ketiga atau pengiklan mana pun.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              4. How We Use Your Information (Cara Kami Menggunakan Informasi)
            </h2>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              Informasi yang dikumpulkan digunakan semata-mata untuk:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1.5 ml-2">
              <li>Memverifikasi identitas Anda dan mengamankan akses ke akun.</li>
              <li>Menjadwalkan dan mengunggah video atau gambar ke akun sosial media yang telah Anda setujui.</li>
              <li>Menampilkan statistik analitik performa postingan di dashboard Anda.</li>
              <li>Memproses penarikan atau pemutusan akun saat Anda memilih untuk memutus integrasi.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              5. Data Security (Keamanan Data)
            </h2>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              Kami menerapkan langkah-langkah keamanan teknis standar industri:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1.5 ml-2">
              <li>Komunikasi data selalu dienkripsi menggunakan protokol HTTPS / SSL (TLS 1.3).</li>
              <li>Kata sandi pengguna di-hash menggunakan algoritma <code>bcrypt</code> dengan salt yang aman.</li>
              <li>Token akses OAuth disimpan dalam basis data yang dilindungi dan hanya dapat diakses oleh server backend kami.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              6. Data Retention & Deletion Instructions (Penyimpanan & Penghapusan Data)
            </h2>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              Kami menghormati hak Anda atas data pribadi Anda:
            </p>
            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-xl border border-blue-100 dark:border-blue-900 text-sm space-y-2">
              <p className="font-semibold text-blue-900 dark:text-blue-300">
                Cara Menghapus Data Anda (User Data Deletion):
              </p>
              <ol className="list-decimal list-inside text-xs text-blue-800 dark:text-blue-400 space-y-1">
                <li>
                  Masuk ke dashboard Multi Social Anda di{" "}
                  <a href="https://ssm.toolku.id/masuk" className="underline">
                    https://ssm.toolku.id/masuk
                  </a>
                  .
                </li>
                <li>
                  Buka menu <strong>Akun Sosmed</strong>, lalu klik tombol <strong>"Putuskan"</strong> pada akun yang ingin
                  dihapus.
                </li>
                <li>
                  Untuk menghapus seluruh riwayat akun dan file media secara permanen, Anda dapat mengirimkan permintaan ke{" "}
                  <strong>support@toolku.id</strong> dengan subjek <em>"Penghapusan Data Akun"</em>. Kami akan menghapus
                  seluruh data Anda dalam waktu 7 hari kerja.
                </li>
              </ol>
            </div>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              7. Third-Party Service Providers (Layanan Pihak Ketiga)
            </h2>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              Kebijakan Privasi ini tidak mencakup praktik pihak ketiga yang tidak kami miliki atau kendalikan. Silakan
              merujuk pada kebijakan privasi resmi masing-masing penyedia:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1 ml-2">
              <li>
                <a
                  href="https://www.tiktok.com/legal/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  TikTok Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Google Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/privacy/policy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Meta Privacy Policy
                </a>
              </li>
            </ul>
          </section>

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              8. Contact Us (Kontak)
            </h2>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              Jika Anda memiliki pertanyaan mengenai Kebijakan Privasi ini atau penanganan data pribadi Anda, silakan
              menghubungi:
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl text-xs space-y-1">
              <p>
                <strong>Multi Social Team</strong>
              </p>
              <p>
                <strong>Website:</strong>{" "}
                <a href="https://ssm.toolku.id" className="text-blue-600">
                  https://ssm.toolku.id
                </a>
              </p>
              <p>
                <strong>Email:</strong> support@toolku.id
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 bg-white dark:bg-gray-900 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-6 text-center text-xs text-gray-500 space-y-2">
          <p>© 2026 Multi Social (ssm.toolku.id). All rights reserved.</p>
          <div className="flex justify-center gap-4">
            <Link href="/terms" className="hover:text-blue-600 underline">
              Terms of Service
            </Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-blue-600 underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
