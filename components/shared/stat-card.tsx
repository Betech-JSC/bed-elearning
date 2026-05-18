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
    orange: "bg-orange-50 text-orange-600 border-orange-100/50 dark:bg-orange-950/20 dark:border-orange-900/30",
    blue: "bg-blue-50 text-blue-600 border-blue-100/50 dark:bg-blue-950/20 dark:border-blue-900/30",
    green: "bg-green-50 text-green-600 border-green-100/50 dark:bg-green-950/20 dark:border-green-900/30",
    purple: "bg-purple-50 text-purple-600 border-purple-100/50 dark:bg-purple-950/20 dark:border-purple-900/30",
  }

  const hoverColorMap = {
    orange: "group-hover:border-orange-200 group-hover:bg-orange-100/20",
    blue: "group-hover:border-blue-200 group-hover:bg-blue-100/20",
    green: "group-hover:border-green-200 group-hover:bg-green-100/20",
    purple: "group-hover:border-purple-200 group-hover:bg-purple-100/20",
  }

  return (
    <div className={cn(
      "relative p-6 rounded-[2rem] border bg-white dark:bg-zinc-950 shadow-sm transition-all hover:shadow-xl hover:shadow-orange-500/5 group flex flex-col justify-between gap-4 overflow-hidden min-h-[130px] w-full",
    )}>
      {/* Accent line on left */}
      <div className={cn("absolute left-0 top-0 bottom-0 w-1.5", 
        color === "orange" ? "bg-orange-500" : 
        color === "blue" ? "bg-blue-500" : 
        color === "green" ? "bg-green-500" : "bg-purple-500"
      )} />

      {/* Top section: Label and Icon */}
      <div className="flex items-start justify-between gap-2 w-full">
        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-normal">
          {label}
        </span>
        
        {/* Beautiful Centered Icon Container */}
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300",
          colorMap[color],
          hoverColorMap[color]
        )}>
          <Icon className="w-4 h-4 transition-transform duration-500 group-hover:scale-110" />
        </div>
      </div>

      {/* Bottom section: Value and Trend */}
      <div className="flex flex-col gap-1 mt-auto">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className={cn(
            "font-black text-zinc-900 dark:text-white leading-none tracking-tight block",
            String(value).length > 12 
              ? "text-lg md:text-xl" 
              : String(value).length > 8 
                ? "text-xl md:text-2xl" 
                : "text-2xl md:text-3xl"
          )}>
            {value}
          </span>
          {trend && (
            <span className={cn(
              "text-xs font-black",
              trend.positive ? "text-green-500" : "text-red-500"
            )}>
              {trend.positive ? "↑" : "↓"} {trend.value}
            </span>
          )}
        </div>

        {trend && (
          <div className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider mt-1">
            so với tháng trước
          </div>
        )}
      </div>
    </div>
  )
}
