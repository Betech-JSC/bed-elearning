import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: string
    positive: boolean
  }
  color?: "orange" | "blue" | "green" | "purple"
}

export const StatCard = ({ label, value, icon: Icon, trend, color = "orange" }: StatCardProps) => {
  const colorMap = {
    orange: "border-orange-500 bg-orange-50/30 text-orange-600 dark:bg-orange-950/20",
    blue: "border-blue-500 bg-blue-50/30 text-blue-600 dark:bg-blue-950/20",
    green: "border-green-500 bg-green-50/30 text-green-600 dark:bg-green-950/20",
    purple: "border-purple-500 bg-purple-50/30 text-purple-600 dark:bg-purple-950/20",
  }

  return (
    <div className={cn(
      "relative overflow-hidden p-8 rounded-[2rem] border bg-white dark:bg-zinc-950 shadow-sm transition-all hover:shadow-md",
    )}>
      {/* Accent line on left */}
      <div className={cn("absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-16 rounded-r-full", 
        color === "orange" ? "bg-orange-500" : 
        color === "blue" ? "bg-blue-500" : 
        color === "green" ? "bg-green-500" : "bg-purple-500"
      )} />

      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{label}</span>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-zinc-900 dark:text-white">{value}</span>
          {trend && (
            <span className={cn(
              "text-xs font-bold",
              trend.positive ? "text-green-500" : "text-red-500"
            )}>
              {trend.positive ? "↑" : "↓"} {trend.value}
            </span>
          )}
        </div>
      </div>

      <div className={cn(
        "absolute top-8 right-8 w-12 h-12 rounded-2xl flex items-center justify-center",
        colorMap[color]
      )}>
        <Icon className="w-6 h-6" />
      </div>

      {trend && (
        <div className="mt-4 text-[10px] text-zinc-400 font-medium italic">
          so với tháng trước
        </div>
      )}
    </div>
  )
}
