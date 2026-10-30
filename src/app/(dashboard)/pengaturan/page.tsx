import { requireAuth } from "@/lib/auth-utils"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CredentialsForm } from "@/components/features/credentials-form"

export default async function PengaturanPage() {
  const user = await requireAuth()

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          ⚙️ Pengaturan & Kredensial API
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Kelola profil pengguna dan konfigurasi API resmi media sosial Anda
        </p>
      </div>

      {/* API Credentials Management */}
      <CredentialsForm
        initialGoogleClientId={process.env.GOOGLE_CLIENT_ID || ""}
        initialGoogleClientSecret={process.env.GOOGLE_CLIENT_SECRET || ""}
        initialFacebookClientId={process.env.FACEBOOK_CLIENT_ID || ""}
        initialFacebookClientSecret={process.env.FACEBOOK_CLIENT_SECRET || ""}
        initialTiktokClientKey={process.env.TIKTOK_CLIENT_KEY || ""}
        initialTiktokClientSecret={process.env.TIKTOK_CLIENT_SECRET || ""}
      />

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profil Pengguna</CardTitle>
          <CardDescription>Informasi akun administrator Anda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Nama
            </label>
            <Input defaultValue={user.name || ""} placeholder="Nama Anda" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <Input defaultValue={user.email || ""} disabled />
            <p className="text-xs text-gray-400">Email administrator terdaftar</p>
          </div>
          <Button size="sm">Simpan Perubahan</Button>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ubah Kata Sandi</CardTitle>
          <CardDescription>Perbarui password akun Anda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Password Lama
            </label>
            <Input type="password" placeholder="Masukkan password lama" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Password Baru
            </label>
            <Input type="password" placeholder="Masukkan password baru" />
          </div>
          <Button size="sm">Ubah Password</Button>
        </CardContent>
      </Card>
    </div>
  )
}
