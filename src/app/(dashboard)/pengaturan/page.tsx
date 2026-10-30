import { requireAuth } from "@/lib/auth-utils"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default async function PengaturanPage() {
  const user = await requireAuth()

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          ⚙️ Pengaturan
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Kelola profil dan pengaturan akun Anda
        </p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Profil</CardTitle>
          <CardDescription>Informasi akun Anda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Nama
            </label>
            <Input defaultValue={user.name || ""} placeholder="Nama Anda" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <Input defaultValue={user.email || ""} disabled />
            <p className="text-xs text-gray-400">Email tidak dapat diubah</p>
          </div>
          <Button>Simpan Perubahan</Button>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle>Ubah Password</CardTitle>
          <CardDescription>Perbarui password akun Anda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Password Lama
            </label>
            <Input type="password" placeholder="Masukkan password lama" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Password Baru
            </label>
            <Input type="password" placeholder="Masukkan password baru" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Konfirmasi Password Baru
            </label>
            <Input type="password" placeholder="Ulangi password baru" />
          </div>
          <Button>Ubah Password</Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="text-red-600">Zona Bahaya</CardTitle>
          <CardDescription>Tindakan yang tidak dapat dibatalkan</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive">Hapus Akun</Button>
          <p className="text-xs text-gray-400 mt-2">
            Semua data Anda akan dihapus secara permanen.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
