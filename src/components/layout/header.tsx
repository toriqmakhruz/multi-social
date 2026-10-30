import { auth } from "@/lib/auth"
import { Avatar } from "@/components/ui/avatar"
import { UserMenu } from "@/components/layout/user-menu"

export async function Header() {
  const session = await auth()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {/* Page title will be set by each page */}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications placeholder */}
        <button className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <span className="text-xl">🔔</span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User menu */}
        <UserMenu
          name={session?.user?.name || "Pengguna"}
          email={session?.user?.email || ""}
          image={session?.user?.image}
        />
      </div>
    </header>
  )
}
