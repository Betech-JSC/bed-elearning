"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useTransition, useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDebounce } from "@/hooks/use-debounce"

import { Category } from "@prisma/client"

const sortLabels: Record<string, string> = {
  newest: "Newest First",
  popular: "Best Sellers",
  price_asc: "Low to High",
  price_desc: "High to Low",
}

const priceLabels: Record<string, string> = {
  all: "Tất cả mức giá",
  free: "Miễn phí",
  sale: "Đang khuyến mãi 🔥",
  under_500: "Dưới 500.000đ",
  "500_2m": "500.000đ - 2.000.000đ",
  over_2m: "Trên 2.000.000đ",
}

export function CourseFilters({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [search, setSearch] = useState(searchParams.get("q") || "")
  const debouncedSearch = useDebounce(search, 400)

  // Sync debounced search to URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    const currentQ = params.get("q") || ""

    if (debouncedSearch === currentQ) return

    if (debouncedSearch) {
      params.set("q", debouncedSearch)
    } else {
      params.delete("q")
    }
    params.delete("page")
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }, [debouncedSearch, pathname, router, searchParams])

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== "all") {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete("page")
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  const handleCheckboxChange = (key: string, value: string, checked: boolean) => {
    const params = new URLSearchParams(searchParams.toString())
    const currentValues = params.get(key)?.split(",").filter(Boolean) || []
    
    let newValues = []
    if (checked) {
      newValues = [...currentValues, value]
    } else {
      newValues = currentValues.filter(v => v !== value)
    }

    if (newValues.length > 0) {
      params.set(key, newValues.join(","))
    } else {
      params.delete(key)
    }
    params.delete("page")

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Search</h3>
        <div className="relative">
            <Input 
                type="search" 
                placeholder="Find a course..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 bg-zinc-100 border-none rounded-2xl px-4 text-sm font-medium focus-visible:ring-[#FF6600]/20"
            />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Sort By</h3>
        <Select 
          value={(searchParams.get("sort") as string) || "newest"} 
          onValueChange={(details: any) => {
             const val = typeof details === 'object' && details !== null && 'value' in details ? details.value : details;
             handleFilterChange("sort", val ?? "newest");
          }}
        >
          <SelectTrigger className="h-12 bg-white border-zinc-200 rounded-2xl px-4 text-sm font-bold shadow-sm hover:border-[#FF6600]/50 transition-colors">
            <SelectValue placeholder="Sort by">
              {sortLabels[searchParams.get("sort") || "newest"]}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="rounded-2xl border border-zinc-100 shadow-2xl bg-white p-2 z-[100] min-w-[200px]">
            <SelectItem value="newest" className="cursor-pointer rounded-xl py-2.5 px-3 hover:bg-zinc-50 focus:bg-zinc-50 font-bold text-zinc-600 data-[highlighted]:bg-zinc-50 data-[highlighted]:text-zinc-900 data-[selected]:bg-[#FF6600]/10 data-[selected]:text-[#FF6600]">Newest First</SelectItem>
            <SelectItem value="popular" className="cursor-pointer rounded-xl py-2.5 px-3 hover:bg-zinc-50 focus:bg-zinc-50 font-bold text-zinc-600 data-[highlighted]:bg-zinc-50 data-[highlighted]:text-zinc-900 data-[selected]:bg-[#FF6600]/10 data-[selected]:text-[#FF6600]">Best Sellers</SelectItem>
            <SelectItem value="price_asc" className="cursor-pointer rounded-xl py-2.5 px-3 hover:bg-zinc-50 focus:bg-zinc-50 font-bold text-zinc-600 data-[highlighted]:bg-zinc-50 data-[highlighted]:text-zinc-900 data-[selected]:bg-[#FF6600]/10 data-[selected]:text-[#FF6600]">Low to High</SelectItem>
            <SelectItem value="price_desc" className="cursor-pointer rounded-xl py-2.5 px-3 hover:bg-zinc-50 focus:bg-zinc-50 font-bold text-zinc-600 data-[highlighted]:bg-zinc-50 data-[highlighted]:text-zinc-900 data-[selected]:bg-[#FF6600]/10 data-[selected]:text-[#FF6600]">High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Categories</h3>
        <div className="space-y-3">
          {categories.map(cat => {
            const isChecked = searchParams.get("category")?.split(",").includes(cat.slug) || false
            return (
              <div key={cat.id} className="flex items-center space-x-3 group cursor-pointer" onClick={() => handleCheckboxChange("category", cat.slug, !isChecked)}>
                <Checkbox 
                  id={`cat-${cat.id}`} 
                  checked={isChecked}
                  className="rounded-lg border-zinc-300 data-[state=checked]:bg-[#FF6600] data-[state=checked]:border-[#FF6600]"
                  onCheckedChange={(checked) => handleCheckboxChange("category", cat.slug, checked as boolean)}
                />
                <Label htmlFor={`cat-${cat.id}`} className="text-sm font-bold text-zinc-600 group-hover:text-zinc-900 cursor-pointer">{cat.name}</Label>
              </div>
            )
          })}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Difficulty</h3>
        <div className="space-y-3">
          {["BEGINNER", "INTERMEDIATE", "ADVANCED"].map(level => {
            const isChecked = searchParams.get("level")?.split(",").includes(level) || false
            const labels: Record<string, string> = { BEGINNER: "Beginner", INTERMEDIATE: "Intermediate", ADVANCED: "Advanced" }
            return (
              <div key={level} className="flex items-center space-x-3 group cursor-pointer" onClick={() => handleCheckboxChange("level", level, !isChecked)}>
                <Checkbox 
                  id={`lvl-${level}`}
                  checked={isChecked}
                  className="rounded-lg border-zinc-300 data-[state=checked]:bg-[#FF6600] data-[state=checked]:border-[#FF6600]"
                  onCheckedChange={(checked) => handleCheckboxChange("level", level, checked as boolean)}
                />
                <Label htmlFor={`lvl-${level}`} className="text-sm font-bold text-zinc-600 group-hover:text-zinc-900 cursor-pointer">{labels[level]}</Label>
              </div>
            )
          })}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Price</h3>
        <Select 
          value={(searchParams.get("price") as string) || "all"} 
          onValueChange={(details: any) => {
             const val = typeof details === 'object' && details !== null && 'value' in details ? details.value : details;
             handleFilterChange("price", val ?? "all");
          }}
        >
          <SelectTrigger className="h-12 bg-white border-zinc-200 rounded-2xl px-4 text-sm font-bold shadow-sm hover:border-[#FF6600]/50 transition-colors">
            <SelectValue placeholder="All Prices">
              {priceLabels[searchParams.get("price") || "all"]}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="rounded-2xl border border-zinc-100 shadow-2xl bg-white p-2 z-[100] min-w-[200px]">
            <SelectItem value="all" className="cursor-pointer rounded-xl py-2.5 px-3 hover:bg-zinc-50 focus:bg-zinc-50 font-bold text-zinc-600 data-[highlighted]:bg-zinc-50 data-[highlighted]:text-zinc-900 data-[selected]:bg-[#FF6600]/10 data-[selected]:text-[#FF6600]">Tất cả mức giá</SelectItem>
            <SelectItem value="free" className="cursor-pointer rounded-xl py-2.5 px-3 hover:bg-zinc-50 focus:bg-zinc-50 font-bold text-zinc-600 data-[highlighted]:bg-zinc-50 data-[highlighted]:text-zinc-900 data-[selected]:bg-[#FF6600]/10 data-[selected]:text-[#FF6600]">Miễn phí</SelectItem>
            <SelectItem value="sale" className="cursor-pointer rounded-xl py-2.5 px-3 hover:bg-zinc-50 focus:bg-zinc-50 font-bold text-zinc-600 data-[highlighted]:bg-zinc-50 data-[highlighted]:text-zinc-900 data-[selected]:bg-[#FF6600]/10 data-[selected]:text-[#FF6600]">Đang khuyến mãi 🔥</SelectItem>
            <SelectItem value="under_500" className="cursor-pointer rounded-xl py-2.5 px-3 hover:bg-zinc-50 focus:bg-zinc-50 font-bold text-zinc-600 data-[highlighted]:bg-zinc-50 data-[highlighted]:text-zinc-900 data-[selected]:bg-[#FF6600]/10 data-[selected]:text-[#FF6600]">Dưới 500.000đ</SelectItem>
            <SelectItem value="500_2m" className="cursor-pointer rounded-xl py-2.5 px-3 hover:bg-zinc-50 focus:bg-zinc-50 font-bold text-zinc-600 data-[highlighted]:bg-zinc-50 data-[highlighted]:text-zinc-900 data-[selected]:bg-[#FF6600]/10 data-[selected]:text-[#FF6600]">500.000đ - 2.000.000đ</SelectItem>
            <SelectItem value="over_2m" className="cursor-pointer rounded-xl py-2.5 px-3 hover:bg-zinc-50 focus:bg-zinc-50 font-bold text-zinc-600 data-[highlighted]:bg-zinc-50 data-[highlighted]:text-zinc-900 data-[selected]:bg-[#FF6600]/10 data-[selected]:text-[#FF6600]">Trên 2.000.000đ</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {isPending && (
        <div className="pt-4 flex items-center gap-2 text-xs font-bold text-[#FF6600]">
           <div className="w-2 h-2 bg-[#FF6600] rounded-full animate-pulse" />
           Updating results...
        </div>
      )}
    </div>
  )
}
