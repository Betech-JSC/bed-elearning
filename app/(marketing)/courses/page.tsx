import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { CourseCard } from "@/components/ui-custom/course-card"
import { CourseFilters } from "@/components/ui-custom/course-filters"
import { Prisma, CourseLevel } from "@prisma/client"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

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
  
  // Validate levels against enum
  const validLevels = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "ALL"]
  const levelsFilter = rawLevels.filter(l => validLevels.includes(l)) as CourseLevel[]

  // Build Prisma Where Clause
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
    else if (priceFilter === "under_500") where.price = { gt: 0, lte: 500000 }
    else if (priceFilter === "500_2m") where.price = { gt: 500000, lte: 2000000 }
    else if (priceFilter === "over_2m") where.price = { gt: 2000000 }
  }

  // Build Prisma OrderBy
  const validSorts = ["newest", "popular", "price_asc", "price_desc"]
  const activeSort = validSorts.includes(sort) ? sort : "newest"

  let orderBy: Prisma.CourseOrderByWithRelationInput = { createdAt: "desc" }
  
  if (activeSort === "price_asc") orderBy = { price: "asc" }
  else if (activeSort === "price_desc") orderBy = { price: "desc" }
  else if (activeSort === "popular") orderBy = { enrollments: { _count: "desc" } }

  const session = await auth()
  const userId = session?.user?.id

  // Execute queries
  const [courses, categories] = await Promise.all([
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
      take: 24, // MVP pagination limit
    }),
    prisma.category.findMany()
  ])

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="sticky top-20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Bộ lọc</h2>
              {Object.keys(resolvedParams).length > 0 && (
                <Link href="/courses" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "h-8 text-xs text-blue-600")}>
                  Xóa bộ lọc
                </Link>
              )}
            </div>
            <CourseFilters categories={categories} />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Tất cả khóa học</h1>
            <p className="text-zinc-500 mt-2">Tìm thấy {courses.length} khóa học phù hợp với tiêu chí của bạn.</p>
          </div>

          {courses.length === 0 ? (
            <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700">
              <div className="w-16 h-16 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Không tìm thấy kết quả</h3>
              <p className="text-zinc-500 max-w-md mx-auto mb-6">
                Rất tiếc, chúng tôi không tìm thấy khóa học nào phù hợp với bộ lọc hiện tại. Vui lòng thử lại với tiêu chí khác.
              </p>
              <Link href="/courses" className={buttonVariants()}>
                Xóa bộ lọc
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(course => {
                const totalRating = course.reviews.reduce((acc, rev) => acc + rev.rating, 0)
                const avgRating = course.reviews.length > 0 ? totalRating / course.reviews.length : 0
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
        </main>
      </div>
    </div>
  )
}
