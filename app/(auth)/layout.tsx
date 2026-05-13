import { ReactNode } from "react"
import Link from "next/link"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4 relative">
      <div className="absolute top-8 left-8">
        <Link href="/" className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Vibecode
        </Link>
      </div>
      {children}
    </div>
  )
}
