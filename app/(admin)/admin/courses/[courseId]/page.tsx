import prisma from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  BookOpen, 
  PlayCircle,
  AlertCircle
} from "lucide-react"
import { CourseStatus } from "@prisma/client"
import { updateCourseStatus } from "@/lib/actions/admin"
import { ReviewActions } from "@/components/admin/courses/review-actions"

export default async function CourseReviewPage({
  params
}: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = await params
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      instructor: true,
      category: true,
      sections: {
        orderBy: { order: "asc" },
        include: {
          lessons: { orderBy: { order: "asc" } }
        }
      }
    }
  })

  if (!course) return notFound()

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black tracking-tight">{course.title}</h1>
            <Badge 
              variant="outline" 
              className={course.status === "PENDING_REVIEW" ? "bg-blue-50 text-blue-600 border-blue-200" : ""}
            >
              {course.status}
            </Badge>
          </div>
          <p className="text-zinc-500">Giảng viên: {course.instructor.name} ({course.instructor.email})</p>
        </div>
        
        {course.status === "PENDING_REVIEW" && (
            <ReviewActions courseId={course.id} />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Info */}
          <section className="bg-white dark:bg-zinc-900 border rounded-2xl p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-500" />
              Thông tin khóa học
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Mô tả ngắn</p>
                <p className="text-sm leading-relaxed">{course.description || "Không có mô tả."}</p>
              </div>
              <div>
                 <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Thumbnail</p>
                 {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="w-full aspect-video object-cover rounded-xl border" />
                 ) : (
                    <div className="w-full aspect-video bg-zinc-100 rounded-xl border flex items-center justify-center text-zinc-400">
                        No Thumbnail
                    </div>
                 )}
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-3 gap-4">
               <div>
                  <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Giá</p>
                  <p className="font-bold text-lg">{course.price === 0 ? "Miễn phí" : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)}</p>
               </div>
               <div>
                  <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Danh mục</p>
                  <p className="font-bold text-lg">{course.category?.name || "N/A"}</p>
               </div>
               <div>
                  <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Trình độ</p>
                  <p className="font-bold text-lg">{course.level}</p>
               </div>
            </div>
          </section>

          {/* Curriculum */}
          <section className="bg-white dark:bg-zinc-900 border rounded-2xl p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-500" />
              Nội dung chương trình ({course.sections.length} chương)
            </h2>
            <div className="space-y-4">
               {course.sections.map((section, idx) => (
                  <div key={section.id} className="border rounded-xl p-4 bg-zinc-50/50">
                     <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                        <span className="bg-zinc-200 text-zinc-700 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">
                           {idx + 1}
                        </span>
                        {section.title}
                     </h3>
                     <div className="space-y-2 pl-7">
                        {section.lessons.map((lesson) => (
                           <div key={lesson.id} className="flex items-center justify-between text-xs bg-white p-2 rounded-lg border border-dashed">
                              <div className="flex items-center gap-2 text-zinc-600">
                                 <PlayCircle className="w-3 h-3" />
                                 {lesson.title}
                              </div>
                              {lesson.isFreePreview && (
                                 <Badge variant="outline" className="text-[9px] uppercase font-bold text-green-600 border-green-200">Preview</Badge>
                              )}
                           </div>
                        ))}
                     </div>
                  </div>
               ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-1 space-y-8">
           <section className="bg-white dark:bg-zinc-900 border rounded-2xl p-8 shadow-sm space-y-6">
              <h2 className="text-xl font-bold">Kết quả đầu ra</h2>
              <div className="space-y-4">
                 <div>
                    <p className="text-xs text-zinc-500 uppercase font-bold mb-2">Học viên sẽ học được gì?</p>
                    <div className="text-sm space-y-1">
                       {course.whatYouWillLearn?.split('\n').map((item, i) => (
                          <div key={i} className="flex gap-2">
                             <CheckCircle className="w-3 h-3 text-green-500 mt-1 shrink-0" />
                             <span>{item}</span>
                          </div>
                       ))}
                    </div>
                 </div>
                 <Separator />
                 <div>
                    <p className="text-xs text-zinc-500 uppercase font-bold mb-2">Yêu cầu</p>
                    <p className="text-sm">{course.requirements || "Không có yêu cầu đặc biệt."}</p>
                 </div>
              </div>
           </section>
        </div>
      </div>
    </div>
  )
}
