import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { CourseCard } from "@/components/ui-custom/course-card"
import { CourseFilters } from "@/components/ui-custom/course-filters"
import { Prisma, CourseLevel } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Search, SlidersHorizontal, Sparkles } from "lucide-react"

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams
  const q = typeof resolvedParams.q === "string" ? resolvedParams.q : undefined
  const sort = typeof resolvedParams.sort === "string" ? resolvedParams.sort : "newest"
  const priceFilter = typeof resolvedParams.price === "string" ? resolvedParams.price : undefined
  
  const categoryParam = resolvedParams.category
  const categoriesFilter = categoryParam 
    ? (Array.isArray(categoryParam) ? categoryParam : categoryParam.split(",")) 
    : []

  const levelParam = resolvedParams.level
  const rawLevels = levelParam 
    ? (Array.isArray(levelParam) ? levelParam : levelParam.split(",")) 
    : []
  
  const validLevels = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "ALL"]
  const levelsFilter = rawLevels.filter(l => validLevels.includes(l)) as CourseLevel[]

  const where: Prisma.CourseWhereInput = {
    status: "PUBLISHED",
    isHidden: false,
  }

  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ]
  }

  if (categoriesFilter.length > 0) {
    where.category = {
      slug: { in: categoriesFilter }
    }
  }

  if (levelsFilter.length > 0) {
    where.level = { in: levelsFilter }
  }

  if (priceFilter) {
    if (priceFilter === "free") where.price = 0
    else if (priceFilter === "sale") where.salePrice = { gt: 0 }
    else if (priceFilter === "under_500") where.price = { gt: 0, lte: 500000 }
    else if (priceFilter === "500_2m") where.price = { gt: 500000, lte: 2000000 }
    else if (priceFilter === "over_2m") where.price = { gt: 2000000 }
  }

  const validSorts = ["newest", "popular", "price_asc", "price_desc"]
  const activeSort = validSorts.includes(sort) ? sort : "newest"

  let orderBy: Prisma.CourseOrderByWithRelationInput = { createdAt: "desc" }
  
  if (activeSort === "price_asc") orderBy = { price: "asc" }
  else if (activeSort === "price_desc") orderBy = { price: "desc" }
  else if (activeSort === "popular") orderBy = { enrollments: { _count: "desc" } }

  const session = await auth()
  const userId = session?.user?.id

  const pageParam = typeof resolvedParams.page === "string" ? parseInt(resolvedParams.page) : 1
  const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam
  const limit = 9
  const skip = (page - 1) * limit

  const [courses, totalCount, categories] = await Promise.all([
    prisma.course.findMany({
      where,
      orderBy,
      include: {
        instructor: true,
        reviews: true,
        enrollments: userId ? {
          where: { userId }
        } : false,
        _count: {
          select: { enrollments: true }
        }
      },
      skip,
      take: limit,
    }),
    prisma.course.count({ where }),
    prisma.category.findMany()
  ])

  const totalPages = Math.ceil(totalCount / limit)

  const getPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams()
    if (q) params.set("q", q)
    if (sort) params.set("sort", sort)
    if (priceFilter) params.set("price", priceFilter)
    if (categoriesFilter.length > 0) params.set("category", categoriesFilter.join(","))
    if (levelsFilter.length > 0) params.set("level", levelsFilter.join(","))
    params.set("page", pageNumber.toString())
    return `/courses?${params.toString()}`
  }

  return (
    <div className="bg-[#F8F9FA] min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="mb-16 space-y-4 animate-in fade-in slide-in-from-top-8 duration-1000">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FF6600] rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                    <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-5xl font-black tracking-tighter text-zinc-900">Danh mục khóa học</h1>
            </div>
            <p className="text-zinc-500 font-medium text-lg max-w-2xl leading-relaxed">
                Khám phá hàng ngàn khóa học chất lượng cao từ các chuyên gia hàng đầu. Bắt đầu hành trình chinh phục tri thức của bạn ngay hôm nay.
            </p>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-4 gap-12 items-start">
          
          {/* Sidebar Filters */}
          <aside className="w-full lg:col-span-1 space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000 delay-200 sticky top-28">
            <div className="bg-white p-8 rounded-[3rem] shadow-xl shadow-zinc-200/50 border border-zinc-100">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <SlidersHorizontal className="w-4 h-4 text-zinc-400" />
                    <h2 className="text-lg font-black text-zinc-900">Bộ lọc</h2>
                </div>
                {(Object.keys(resolvedParams).length > 0) && (
                  <Link href="/courses" className="text-xs font-black text-[#FF6600] hover:underline uppercase tracking-widest">
                    Đặt lại
                  </Link>
                )}
              </div>
              <CourseFilters categories={categories} />
            </div>

            {/* Promo Card */}
            <div className="bg-zinc-900 rounded-[3rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-zinc-900/20">
                <div className="relative z-10 space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-400">Ưu đãi hôm nay</p>
                    <h4 className="text-2xl font-black leading-tight">Giảm đến 50% <br/> cho khóa học mới</h4>
                    <Button asChild className="w-full h-12 rounded-xl bg-[#FF6600] hover:bg-orange-600 font-black text-xs uppercase tracking-widest border-none text-white shadow-lg shadow-orange-500/10">
                        <Link href="/courses?price=sale">Xem ngay</Link>
                    </Button>
                </div>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl" />
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 space-y-10 animate-in fade-in slide-in-from-right-8 duration-1000 delay-400">
            <div className="flex items-center justify-between bg-white px-8 py-5 rounded-[2rem] border border-zinc-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <p className="text-sm font-black text-zinc-400 uppercase tracking-widest">Hiển thị:</p>
                    <span className="text-sm font-black text-zinc-900">{courses.length} khóa học</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-4 py-2 bg-zinc-50 rounded-xl">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Live Updating</span>
                    </div>
                </div>
            </div>

            {courses.length === 0 ? (
              <div className="text-center py-32 bg-white rounded-[4rem] border border-dashed border-zinc-200 shadow-sm">
                <div className="w-24 h-24 bg-orange-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                   <Search className="w-10 h-10 text-[#FF6600]" />
                </div>
                <h3 className="text-3xl font-black text-zinc-900 mb-3">Không tìm thấy kết quả</h3>
                <p className="text-zinc-500 max-w-sm mx-auto mb-10 font-medium leading-relaxed">
                  Chúng tôi không tìm thấy khóa học nào phù hợp với bộ lọc hiện tại của bạn. Vui lòng thử điều chỉnh lại.
                </p>
                <Button asChild className="bg-zinc-900 hover:bg-[#FF6600] text-white h-14 px-10 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-zinc-200 border-none">
                   <Link href="/courses">Xóa tất cả bộ lọc</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map(course => {
                  const totalRating = course.reviews.reduce((acc, rev) => acc + rev.rating, 0)
                  const avgRating = course.reviews.length > 0 ? totalRating / course.reviews.length : 5.0
                  return (
                    <CourseCard 
                      key={course.id} 
                      course={course} 
                      rating={avgRating} 
                      totalStudents={course._count.enrollments}
                      isMyCourse={course.enrollments && course.enrollments.length > 0}
                    />
                  )
                })}
              </div>
            )}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pt-12 flex items-center justify-center gap-2">
                <Button 
                  asChild 
                  variant="outline" 
                  disabled={page === 1}
                  className={cn(
                    "w-12 h-12 rounded-xl border-zinc-200 p-0 font-bold", 
                    page === 1 && "pointer-events-none opacity-50"
                  )}
                >
                  <Link href={getPageUrl(page - 1)}>&lt;</Link>
                </Button>

                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pNum = idx + 1
                  const isCurrent = pNum === page
                  return (
                    <Button
                      key={pNum}
                      asChild
                      variant={isCurrent ? "default" : "outline"}
                      className={cn(
                        "w-12 h-12 rounded-xl font-bold",
                        isCurrent ? "bg-[#FF6600] text-white hover:bg-orange-600 border-none" : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                      )}
                    >
                      <Link href={getPageUrl(pNum)}>{pNum}</Link>
                    </Button>
                  )
                })}

                <Button 
                  asChild 
                  variant="outline" 
                  disabled={page === totalPages}
                  className={cn(
                    "w-12 h-12 rounded-xl border-zinc-200 p-0 font-bold", 
                    page === totalPages && "pointer-events-none opacity-50"
                  )}
                >
                  <Link href={getPageUrl(page + 1)}>&gt;</Link>
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
