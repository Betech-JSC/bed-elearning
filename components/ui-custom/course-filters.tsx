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
    <div className="space-y-8">
      <div>
        <h3 className="font-semibold mb-3">Tìm kiếm</h3>
        <Input 
          type="search" 
          placeholder="Tên khóa học..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div>
        <h3 className="font-semibold mb-3">Sắp xếp</h3>
        <Select 
          value={(searchParams.get("sort") as string) || "newest"} 
          onValueChange={(val) => handleFilterChange("sort", val ?? "newest")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sắp xếp theo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Mới nhất</SelectItem>
            <SelectItem value="popular">Bán chạy nhất</SelectItem>
            <SelectItem value="price_asc">Giá: Thấp đến Cao</SelectItem>
            <SelectItem value="price_desc">Giá: Cao đến Thấp</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Danh mục</h3>
        <div className="space-y-2">
          {categories.map(cat => {
            const isChecked = searchParams.get("category")?.split(",").includes(cat.slug) || false
            return (
              <div key={cat.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`cat-${cat.id}`} 
                  checked={isChecked}
                  onCheckedChange={(checked) => handleCheckboxChange("category", cat.slug, checked as boolean)}
                />
                <Label htmlFor={`cat-${cat.id}`} className="cursor-pointer">{cat.name}</Label>
              </div>
            )
          })}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Mức độ</h3>
        <div className="space-y-2">
          {["BEGINNER", "INTERMEDIATE", "ADVANCED"].map(level => {
            const isChecked = searchParams.get("level")?.split(",").includes(level) || false
            const labels: Record<string, string> = { BEGINNER: "Cơ bản", INTERMEDIATE: "Trung cấp", ADVANCED: "Nâng cao" }
            return (
              <div key={level} className="flex items-center space-x-2">
                <Checkbox 
                  id={`lvl-${level}`}
                  checked={isChecked}
                  onCheckedChange={(checked) => handleCheckboxChange("level", level, checked as boolean)}
                />
                <Label htmlFor={`lvl-${level}`} className="cursor-pointer">{labels[level]}</Label>
              </div>
            )
          })}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Giá tiền</h3>
        <Select 
          value={(searchParams.get("price") as string) || "all"} 
          onValueChange={(val) => handleFilterChange("price", val ?? "all")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Mọi mức giá" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Mọi mức giá</SelectItem>
            <SelectItem value="free">Miễn phí</SelectItem>
            <SelectItem value="under_500">Dưới 500.000đ</SelectItem>
            <SelectItem value="500_2m">500.000đ - 2.000.000đ</SelectItem>
            <SelectItem value="over_2m">Trên 2.000.000đ</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {isPending && <div className="text-sm text-zinc-500">Đang cập nhật kết quả...</div>}
    </div>
  )
}
