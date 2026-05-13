import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { 
  LayoutDashboard, 
  ListChecks, 
  CircleDollarSign, 
  Users2, 
  Send,
  Eye,
  Settings,
  FileQuestion
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { CourseInfoForm } from "@/components/instructor/course-info-form"
import { CurriculumEditor } from "@/components/instructor/curriculum-editor"
import { PricingForm } from "@/components/instructor/pricing-form"
import { RequirementsForm } from "@/components/instructor/requirements-form"
import { PublishButton } from "@/components/instructor/publish-button"
import { QuizEditor } from "@/components/instructor/quiz-editor"
import { CourseSettingsForm } from "@/components/instructor/course-settings-form"


export default async function CourseEditPage({
  params
}: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = await params
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) return redirect("/")

  const course = await prisma.course.findUnique({
    where: { 
      id: courseId,
      instructorId: userId
    },
    include: {
      sections: {
        orderBy: { order: "asc" },
        include: {
          lessons: { orderBy: { order: "asc" } }
        }
      },
      quizzes: {
        include: {
          questions: {
            orderBy: { order: "asc" },
            include: { options: true }
          }
        }
      },
      category: true
    }
  })

  if (!course) return notFound()

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" }
  })

  return (
    <div className="h-full bg-zinc-50 dark:bg-zinc-950">
      <div className="border-b bg-white dark:bg-zinc-900 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black truncate max-w-[300px] md:max-w-md">{course.title}</h1>
                <Badge variant="outline" className="font-bold uppercase text-[10px] bg-zinc-50 dark:bg-zinc-800">
                  {course.status}
                </Badge>
              </div>
              <p className="text-xs text-zinc-500">ID: {course.id}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link 
              href={`/courses/${course.slug}`} 
              target="_blank"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-2")}
            >
              <Eye className="w-4 h-4" />
              Xem trước
            </Link>
            <PublishButton courseId={course.id} status={course.status} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="general" orientation="vertical" className="flex flex-col md:flex-row gap-12 items-start">
          <TabsList className="flex flex-col h-auto bg-transparent border-none p-0 space-y-1 w-full md:w-64 shrink-0">
            <TabsTrigger 
              value="general" 
              className="w-full justify-start gap-3 h-12 px-4 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:shadow-sm rounded-xl transition-all"
            >
              <LayoutDashboard className="w-4 h-4" />
              Thông tin chung
            </TabsTrigger>
            <TabsTrigger 
              value="curriculum" 
              className="w-full justify-start gap-3 h-12 px-4 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:shadow-sm rounded-xl transition-all"
            >
              <ListChecks className="w-4 h-4" />
              Chương trình học
            </TabsTrigger>
            <TabsTrigger 
              value="pricing" 
              className="w-full justify-start gap-3 h-12 px-4 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:shadow-sm rounded-xl transition-all"
            >
              <CircleDollarSign className="w-4 h-4" />
              Thiết lập giá
            </TabsTrigger>
            <TabsTrigger 
              value="quizzes" 
              className="w-full justify-start gap-3 h-12 px-4 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:shadow-sm rounded-xl transition-all"
            >
              <FileQuestion className="w-4 h-4" />
              Bài kiểm tra (Quizzes)
            </TabsTrigger>
            <TabsTrigger 
              value="requirements" 
              className="w-full justify-start gap-3 h-12 px-4 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:shadow-sm rounded-xl transition-all"
            >
              <Users2 className="w-4 h-4" />
              Yêu cầu & Đối tượng
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="w-full justify-start gap-3 h-12 px-4 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:shadow-sm rounded-xl transition-all"
            >
              <Settings className="w-4 h-4" />
              Cài đặt nâng cao
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 w-full">
            <TabsContent value="general" className="mt-0 space-y-8">
              <div className="bg-white dark:bg-zinc-900 border rounded-2xl p-8 shadow-sm">
                <h2 className="text-xl font-bold mb-6 border-b pb-4">Thông tin chung</h2>
                <CourseInfoForm initialData={course} categories={categories} />
              </div>
            </TabsContent>

            <TabsContent value="curriculum" className="mt-0">
               <div className="bg-white dark:bg-zinc-900 border rounded-2xl p-8 shadow-sm">
                <h2 className="text-xl font-bold mb-6 border-b pb-4">Chương trình học</h2>
                <CurriculumEditor courseId={course.id} initialSections={course.sections} />
              </div>
            </TabsContent>

            <TabsContent value="pricing" className="mt-0">
               <div className="bg-white dark:bg-zinc-900 border rounded-2xl p-8 shadow-sm">
                <h2 className="text-xl font-bold mb-6 border-b pb-4">Thiết lập giá</h2>
                <PricingForm initialData={course} />
              </div>
            </TabsContent>

            <TabsContent value="quizzes" className="mt-0">
               <div className="bg-white dark:bg-zinc-900 border rounded-2xl p-8 shadow-sm">
                <h2 className="text-xl font-bold mb-6 border-b pb-4">Bài kiểm tra (Quizzes)</h2>
                <QuizEditor courseId={course.id} initialQuizzes={course.quizzes} />
              </div>
            </TabsContent>

            <TabsContent value="requirements" className="mt-0">
               <div className="bg-white dark:bg-zinc-900 border rounded-2xl p-8 shadow-sm">
                <h2 className="text-xl font-bold mb-6 border-b pb-4">Yêu cầu & Đối tượng</h2>
                <RequirementsForm initialData={course} />
              </div>
            </TabsContent>

            <TabsContent value="settings" className="mt-0">
               <div className="bg-white dark:bg-zinc-900 border rounded-2xl p-8 shadow-sm">
                <h2 className="text-xl font-bold mb-6 border-b pb-4 text-red-600">Cài đặt nâng cao</h2>
                <CourseSettingsForm course={course} />
              </div>
            </TabsContent>
          </div>

        </Tabs>
      </div>
    </div>
  )
}
