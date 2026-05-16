import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { CourseCard } from "@/components/ui-custom/course-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, BookOpen, GraduationCap, LayoutGrid } from "lucide-react"

export default async function MyCoursesPage() {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return redirect("/login")
  }

  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          instructor: { select: { name: true } },
          enrollments: { select: { id: true } },
          reviews: { select: { rating: true } }
        }
      }
    },
    orderBy: { updatedAt: "desc" }
  })

  const inProgress = enrollments.filter(e => e.progress > 0 && e.progress < 100)
  const completed = enrollments.filter(e => e.progress === 100)

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold mb-2">Khoá học của tôi</h1>
          <p className="text-zinc-500">Tiếp tục hành trình chinh phục kiến thức của bạn.</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input placeholder="Tìm kiếm khoá học..." className="pl-10 h-11" />
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-8">
        <TabsList className="bg-zinc-100 dark:bg-zinc-900 p-1 h-12">
          <TabsTrigger value="all" className="px-6 gap-2">
            <LayoutGrid className="w-4 h-4" />
            Tất cả ({enrollments.length})
          </TabsTrigger>
          <TabsTrigger value="active" className="px-6 gap-2">
            <BookOpen className="w-4 h-4" />
            Đang học ({inProgress.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="px-6 gap-2">
            <GraduationCap className="w-4 h-4" />
            Đã hoàn thành ({completed.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <CourseGrid enrollments={enrollments} />
        </TabsContent>
        
        <TabsContent value="active" className="mt-0">
          <CourseGrid enrollments={inProgress} />
        </TabsContent>

        <TabsContent value="completed" className="mt-0">
          <CourseGrid enrollments={completed} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function CourseGrid({ enrollments }: { enrollments: any[] }) {
  if (enrollments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed rounded-3xl bg-zinc-50/50 dark:bg-zinc-900/20">
        <div className="w-20 h-20 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center shadow-sm mb-6">
          <BookOpen className="w-10 h-10 text-zinc-300" />
        </div>
        <h3 className="text-xl font-bold mb-2">Chưa có khoá học nào</h3>
        <p className="text-zinc-500 max-w-xs mx-auto mb-8">Hãy bắt đầu hành trình học tập bằng cách khám phá các khoá học mới nhất của chúng tôi.</p>
        <a 
          href="/courses" 
          className="bg-[#FF6600] hover:bg-orange-600 text-white font-black text-sm uppercase tracking-widest py-4 px-10 rounded-2xl transition-all shadow-xl shadow-orange-500/20 inline-block mt-4"
        >
          Khám phá ngay
        </a>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {enrollments.map((enrollment) => {
        const rating = enrollment.course.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / (enrollment.course.reviews.length || 1)
        
        return (
          <CourseCard 
            key={enrollment.id}
            course={enrollment.course}
            rating={rating}
            totalStudents={enrollment.course.enrollments.length}
            isMyCourse={true}
            progress={enrollment.progress}
          />
        )
      })}
    </div>
  )
}
