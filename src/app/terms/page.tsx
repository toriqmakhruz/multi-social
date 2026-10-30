import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service (Ketentuan Layanan) - Multi Social",
  description: "Terms of Service and Conditions for Multi Social management tool",
}

export default function TermsPage() {
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
            <Link href="/privacy" className="text-gray-600 hover:text-blue-600 dark:text-gray-300">
              Privacy Policy
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
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Legal & Compliance
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-1">
              Terms of Service (Ketentuan Layanan)
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Terakhir diperbarui: 30 Oktober 2026 • Effective Date: October 30, 2026
            </p>
          </div>

          <hr className="border-gray-100 dark:border-gray-800" />

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              1. Acceptance of Terms (Penerimaan Ketentuan)
            </h2>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              Dengan mengakses dan menggunakan aplikasi <strong>Multi Social</strong> (
              <a href="https://ssm.toolku.id" className="text-blue-600 underline">
                https://ssm.toolku.id
              </a>
              ), Anda menyatakan bahwa Anda telah membaca, memahami, dan menyetujui untuk terikat oleh Ketentuan
              Layanan ini. Jika Anda tidak menyetujui ketentuan ini, Anda tidak diperkenankan untuk menggunakan layanan
              kami.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              2. Description of Service (Deskripsi Layanan)
            </h2>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              Multi Social adalah platform web dashboard yang memungkinkan kreator konten untuk mengelola,
              menjadwalkan, mempratinjau, dan menerbitkan konten (video dan gambar) ke akun media sosial milik pengguna,
              termasuk namun tidak terbatas pada <strong>TikTok</strong>, <strong>YouTube</strong>,{" "}
              <strong>Facebook</strong>, dan <strong>Instagram</strong> melalui API resmi yang disediakan oleh
              masing-masing penyedia platform.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              3. Integration with Third-Party Platforms (Integrasi Platform Pihak Ketiga)
            </h2>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              Layanan kami terhubung langsung dengan API pihak ketiga. Dengan menghubungkan akun media sosial Anda ke
              Multi Social, Anda juga setuju untuk terikat oleh ketentuan layanan masing-masing platform:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1.5 ml-2">
              <li>
                <strong>TikTok:</strong>{" "}
                <a
                  href="https://www.tiktok.com/legal/terms-of-service"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  TikTok Terms of Service
                </a>{" "}
                dan{" "}
                <a
                  href="https://developers.tiktok.com/doc/terms-of-use/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  TikTok Developer Terms of Service
                </a>
                .
              </li>
              <li>
                <strong>YouTube & Google:</strong>{" "}
                <a
                  href="https://www.youtube.com/t/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  YouTube Terms of Service
                </a>{" "}
                dan{" "}
                <a
                  href="https://policies.google.com/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Google Terms of Service
                </a>
                .
              </li>
              <li>
                <strong>Meta (Facebook & Instagram):</strong>{" "}
                <a
                  href="https://www.facebook.com/terms.php"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Meta Terms of Service
                </a>
                .
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              4. User Content and Responsibilities (Tanggung Jawab Pengguna atas Konten)
            </h2>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              Anda bertanggung jawab penuh atas segala teks, video, gambar, dan media yang Anda buat, jadwalkan, atau
              publikasikan melalui Multi Social. Anda menjamin bahwa:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1.5 ml-2">
              <li>Anda memiliki hak cipta atau lisensi yang sah atas konten yang Anda unggah.</li>
              <li>
                Konten tidak melanggar hukum yang berlaku, pedoman komunitas platform terkait, atau hak pihak ketiga.
              </li>
              <li>
                Konten tidak mengandung materi berbahaya, ujaran kebencian, spam, atau materi yang dilarang oleh TikTok,
                YouTube, atau Meta.
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              5. Account Security (Keamanan Akun)
            </h2>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              Anda bertanggung jawab untuk menjaga kerahasiaan kredensial login Anda. Anda wajib segera memberi tahu kami
              jika mengetahui adanya penggunaan tanpa izin atau pelanggaran keamanan pada akun Anda.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              6. Revocation of Access (Pencabutan Akses)
            </h2>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              Anda berhak setiap saat untuk memutuskan koneksi akun media sosial Anda melalui menu <strong>Akun Sosmed</strong>{" "}
              di dalam aplikasi, atau langsung dari pengaturan akun dan aplikasi resmi di TikTok, Google/YouTube, atau
              Meta.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              7. Disclaimer of Warranties (Batasan Tanggung Jawab)
            </h2>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              Layanan Multi Social disediakan sebagaimana adanya ("as is") tanpa jaminan apa pun, baik tersurat maupun
              tersirat. Kami tidak bertanggung jawab atas gangguan layanan yang disebabkan oleh pemeliharaan pihak
              ketiga, perubahan kebijakan API dari platform media sosial, atau kegagalan jaringan internet.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              8. Contact Us (Hubungi Kami)
            </h2>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              Jika Anda memiliki pertanyaan mengenai Ketentuan Layanan ini, Anda dapat menghubungi kami melalui:
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl text-xs space-y-1">
              <p>
                <strong>Website:</strong>{" "}
                <a href="https://ssm.toolku.id" className="text-blue-600">
                  https://ssm.toolku.id
                </a>
              </p>
              <p>
                <strong>Email Dukungan:</strong> support@toolku.id
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
