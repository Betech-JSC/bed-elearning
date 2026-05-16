import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AppSidebar } from "@/components/shared/sidebar"
import prisma from "@/lib/prisma"

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  if (!session?.user) {
    return redirect("/login")
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { xp: true, streak: true }
  })

  return (
    <div className="h-full relative flex">
      <div className="hidden h-full md:flex md:w-80 md:flex-col md:fixed md:inset-y-0 z-[80]">
        <AppSidebar 
            role="STUDENT" 
            user={{
                ...session.user,
                xp: dbUser?.xp || 0,
                streak: dbUser?.streak || 0
            }} 
        />
      </div>
      <main className="md:pl-80 flex-1 bg-white dark:bg-zinc-950 min-h-screen">
        <div className="p-8 md:p-12 max-w-[1600px] mx-auto">
            {children}
        </div>
      </main>
    </div>
  )
}
