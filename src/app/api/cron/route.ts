import { NextRequest, NextResponse } from "next/server"
import { processScheduledJobs } from "@/lib/scheduler"

/**
 * Endpoint ini dapat dipanggil oleh Hostinger Cron Job (Webhook/URL ping)
 * Contoh perintah cron Hostinger: curl -s "https://domainanda.com/api/cron?secret=YOUR_CRON_SECRET" > /dev/null
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const secret = searchParams.get("secret")
    const expectedSecret = process.env.CRON_SECRET

    if (expectedSecret && secret !== expectedSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await processScheduledJobs()

    return NextResponse.json({
      success: true,
      message: "Scheduler dijalankan dengan sukses",
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("Cron execution error:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Cron job failed" },
      { status: 500 }
    )
  }
}
