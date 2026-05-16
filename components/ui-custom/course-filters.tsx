"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useTransition, useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDebounce } from "@/hooks/use-debounce"

import { Category } from "@prisma/client"

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
          onValueChange={(val) => handleFilterChange("sort", val ?? "newest")}
        >
          <SelectTrigger className="h-12 bg-white border-zinc-200 rounded-2xl px-4 text-sm font-bold">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl border-zinc-100 shadow-xl">
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="popular">Best Sellers</SelectItem>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
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
          onValueChange={(val) => handleFilterChange("price", val ?? "all")}
        >
          <SelectTrigger className="h-12 bg-white border-zinc-200 rounded-2xl px-4 text-sm font-bold">
            <SelectValue placeholder="All Prices" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl border-zinc-100 shadow-xl">
            <SelectItem value="all">All Prices</SelectItem>
            <SelectItem value="free">Free Courses</SelectItem>
            <SelectItem value="under_500">Under 500k VND</SelectItem>
            <SelectItem value="500_2m">500k - 2m VND</SelectItem>
            <SelectItem value="over_2m">Over 2m VND</SelectItem>
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
