import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  if (!session?.user || session.user.role !== "ADMIN") {
    return redirect("/")
  }

  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-zinc-950">
        <AdminSidebar />
      </div>
      <main className="md:pl-72 bg-zinc-50 dark:bg-zinc-900/50 min-h-screen">
        <div className="p-8">
            {children}
        </div>
      </main>
    </div>
  )
}
