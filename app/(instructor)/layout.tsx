import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AppSidebar } from "@/components/shared/sidebar"

export default async function InstructorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  if (!session?.user || (session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN")) {
    return redirect("/")
  }

  return (
    <div className="h-full relative flex">
      <div className="hidden h-full md:flex md:w-80 md:flex-col md:fixed md:inset-y-0 z-[80]">
        <AppSidebar role="INSTRUCTOR" user={session.user} />
      </div>
      <main className="md:pl-80 flex-1 bg-white dark:bg-zinc-950 min-h-screen">
        <div className="p-8 md:p-12 max-w-[1600px] mx-auto">
            {children}
        </div>
      </main>
    </div>
  )
}
