import prisma from "@/lib/prisma"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminCourseList } from "@/components/admin/courses/admin-course-list"

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      instructor: true,
      category: true,
      _count: {
        select: { enrollments: true, sections: true }
      }
    }
  })

  const pendingCourses = courses.filter(c => c.status === "PENDING_REVIEW")
  const publishedCourses = courses.filter(c => c.status === "PUBLISHED")
  const rejectedCourses = courses.filter(c => c.status === "REJECTED")

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black mb-2 tracking-tight">Duyệt khóa học</h1>
        <p className="text-zinc-500">Xem xét và phê duyệt nội dung khóa học từ giảng viên.</p>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="bg-white dark:bg-zinc-900 p-1 border rounded-xl shadow-sm">
          <TabsTrigger value="pending" className="rounded-lg px-6 font-bold data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Chờ duyệt ({pendingCourses.length})
          </TabsTrigger>
          <TabsTrigger value="published" className="rounded-lg px-6 font-bold data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
            Đã đăng ({publishedCourses.length})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="rounded-lg px-6 font-bold data-[state=active]:bg-red-600 data-[state=active]:text-white">
            Bị từ chối ({rejectedCourses.length})
          </TabsTrigger>
          <TabsTrigger value="all" className="rounded-lg px-6 font-bold data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
            Tất cả ({courses.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-0">
          <AdminCourseList courses={pendingCourses} />
        </TabsContent>
        <TabsContent value="published" className="mt-0">
          <AdminCourseList courses={publishedCourses} />
        </TabsContent>
        <TabsContent value="rejected" className="mt-0">
          <AdminCourseList courses={rejectedCourses} />
        </TabsContent>
        <TabsContent value="all" className="mt-0">
          <AdminCourseList courses={courses} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
