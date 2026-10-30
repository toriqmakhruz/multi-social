import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Menyiapkan data awal Multi Social...")

  // Buat akun admin demo untuk login pertama kali
  const hashedPassword = await bcrypt.hash("admin123", 12)

  const admin = await prisma.user.upsert({
    where: { email: "admin@multisocial.com" },
    update: {},
    create: {
      email: "admin@multisocial.com",
      name: "Admin Multi Social",
      password: hashedPassword,
    },
  })

  console.log(`✅ Akun demo berhasil dibuat:`)
  console.log(`   Email: admin@multisocial.com`)
  console.log(`   Password: admin123`)

  // Hubungkan 4 platform default untuk demonstrasi
  const platforms = [
    { platform: "YOUTUBE", username: "my_youtube_channel", displayName: "YouTube Channel" },
    { platform: "INSTAGRAM", username: "multisocial_ig", displayName: "Instagram Bisnis" },
    { platform: "FACEBOOK", username: "multisocial_fb", displayName: "Facebook Page" },
    { platform: "TIKTOK", username: "multisocial_tiktok", displayName: "TikTok Creator" },
  ] as const

  for (const p of platforms) {
    await prisma.socialAccount.upsert({
      where: {
        platform_platformUserId: {
          platform: p.platform,
          platformUserId: `demo_${p.platform.toLowerCase()}_${admin.id}`,
        },
      },
      update: {},
      create: {
        userId: admin.id,
        platform: p.platform,
        platformUserId: `demo_${p.platform.toLowerCase()}_${admin.id}`,
        platformUsername: p.username,
        displayName: p.displayName,
        accessToken: `demo_token_${p.platform.toLowerCase()}`,
        isActive: true,
      },
    })
  }

  console.log("✅ 4 platform media sosial berhasil dihubungkan untuk akun demo!")
}

main()
  .catch((e) => {
    console.error("Gagal menjalankan seed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
