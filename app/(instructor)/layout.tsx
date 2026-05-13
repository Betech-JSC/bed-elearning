import { InstructorNavbar } from "@/components/instructor/instructor-navbar"

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
      <InstructorNavbar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
