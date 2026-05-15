import prisma from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle,
  FileText,
  MessageSquare,
  Info
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VideoPlayer } from "@/components/player/video-player"
import { completeLesson } from "@/lib/actions/course"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { QnaSection } from "@/components/player/qna-section"

export default async function LessonPage({
  params
}: {
  params: Promise<{ slug: string, lessonId: string }>
}) {
  const { slug, lessonId } = await params
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) return redirect("/login")

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      section: {
        include: {
          course: {
            include: {
              sections: {
                orderBy: { order: "asc" },
                include: {
                  lessons: { orderBy: { order: "asc" } }
                }
              }
            }
          }
        }
      },
      progress: {
        where: {
          enrollment: {
            userId
          }
        }
      },
      attachments: true,
      questions: {
        include: {
          user: true,
          answers: {
            include: { user: true }
          }
        },
        orderBy: { createdAt: "desc" }
      },
      quiz: {
        include: {
          questions: {
            include: { options: true }
          }
        }
      }
    }
  })

  if (!lesson) return notFound()

  const course = lesson.section.course
  const allLessons = course.sections.flatMap(s => s.lessons)
  const currentIndex = allLessons.findIndex(l => l.id === lesson.id)
  const prevLesson = allLessons[currentIndex - 1]
  const nextLesson = allLessons[currentIndex + 1]

  const isCompleted = !!lesson.progress[0]?.isCompleted

  return (
    <div className="flex flex-col h-full">
      {/* TOP HEADER */}
      <div className="h-16 border-b bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-20">
         <div className="flex items-center gap-4">
            <Link 
                href={`/courses/${course.slug}`} 
                className="flex items-center gap-2 group transition-all"
            >
                <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                    <ChevronLeft className="w-4 h-4 text-zinc-500 group-hover:text-blue-600" />
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-blue-500 transition-colors">Khóa học</span>
                    <span className="text-sm font-bold text-zinc-900 dark:text-white line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {course.title}
                    </span>
                </div>
            </Link>
            <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-2" />
            <h1 className="font-black text-zinc-900 dark:text-white text-lg line-clamp-1">
                {lesson.title}
            </h1>
         </div>

         <div className="flex items-center gap-4">
            {/* Optional: Add a search icon or settings icon here for "premium" feel */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tighter">Đang học</span>
            </div>
         </div>
      </div>

      <div className="flex-1 p-8 space-y-8">
         {/* VIDEO PLAYER AREA */}
         <div className="max-w-5xl mx-auto space-y-6">
            <div className="aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl border border-zinc-200 dark:border-zinc-800 relative group">
               <VideoPlayer 
                  videoUrl={lesson.videoUrl || ""} 
                  lessonId={lesson.id}
                  courseId={course.id}
               />
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-4">
               <div className="flex gap-4">
                  {prevLesson ? (
                    <Button asChild variant="outline" className="rounded-2xl h-12 px-6 font-bold border-zinc-200 dark:border-zinc-800 gap-2">
                       <Link href={`/learn/${course.slug}/${prevLesson.id}`}>
                          <ChevronLeft className="w-4 h-4" />
                          Trước
                       </Link>
                    </Button>
                  ) : <div className="w-24" />}
                  
                  {nextLesson ? (
                    <Button asChild variant="outline" className="rounded-2xl h-12 px-6 font-bold border-zinc-200 dark:border-zinc-800 gap-2">
                       <Link href={`/learn/${course.slug}/${nextLesson.id}`}>
                          Tiếp theo
                          <ChevronRight className="w-4 h-4" />
                       </Link>
                    </Button>
                  ) : <div className="w-24" />}
               </div>

               <form action={async () => {
                  "use server"
                  await completeLesson(lesson.id)
               }}>
                  <Button 
                    type="submit"
                    className={cn(
                        "rounded-2xl h-12 px-8 font-black text-lg gap-2 shadow-lg transition-all active:scale-95",
                        isCompleted ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20" : "bg-blue-600 hover:bg-blue-700 shadow-blue-600/20"
                    )}
                  >
                     <CheckCircle className={cn("w-5 h-5", isCompleted && "fill-current")} />
                     {isCompleted ? "Đã hoàn thành" : "Đánh dấu hoàn thành"}
                  </Button>
               </form>
            </div>

            {/* CONTENT TABS */}
            <Tabs defaultValue="description" className="w-full">
               <TabsList className="w-full justify-start bg-transparent border-b rounded-none p-0 h-auto gap-8 mb-8">
                  <TabsTrigger value="description" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-0 py-4 font-bold text-lg">Mô tả</TabsTrigger>
                  <TabsTrigger value="resources" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-0 py-4 font-bold text-lg">Tài liệu</TabsTrigger>
                  <TabsTrigger value="qa" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-0 py-4 font-bold text-lg">Hỏi đáp (Q&A)</TabsTrigger>
                  {lesson.quiz && (
                    <TabsTrigger value="quiz" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-0 py-4 font-bold text-lg text-purple-600">Bài kiểm tra</TabsTrigger>
                  )}
               </TabsList>

               <TabsContent value="description" className="space-y-6">
                  <div className="flex items-center gap-3 text-zinc-900 dark:text-white font-bold">
                     <Info className="w-5 h-5 text-blue-500" />
                     Giới thiệu bài học
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed bg-white dark:bg-zinc-950 p-6 rounded-3xl border">
                     {lesson.description || "Bài giảng này hiện chưa có mô tả chi tiết."}
                  </p>
               </TabsContent>

               <TabsContent value="resources" className="space-y-4">
                  {lesson.attachments.length > 0 ? (
                    <div className="grid gap-4">
                      {lesson.attachments.map((file) => (
                        <a key={file.id} href={file.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 bg-white dark:bg-zinc-950 border rounded-2xl hover:border-blue-500 transition-all">
                          <FileText className="w-8 h-8 text-blue-500" />
                          <div className="font-medium">{file.name}</div>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-zinc-100 dark:bg-zinc-900/50 p-8 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center text-zinc-500 gap-4">
                       <FileText className="w-12 h-12 opacity-20" />
                       <p className="font-medium italic">Không có tài liệu đính kèm cho bài học này.</p>
                    </div>
                  )}
               </TabsContent>

               <TabsContent value="qa" className="space-y-6">
                   <QnaSection 
                      lessonId={lesson.id}
                      questions={lesson.questions}
                      userId={userId}
                      courseInstructorId={course.instructorId}
                      isAdmin={session?.user?.role === "ADMIN"}
                   />
               </TabsContent>

               {lesson.quiz && (
                 <TabsContent value="quiz" className="space-y-6">
                    <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-900/30 p-8 rounded-3xl">
                      <h3 className="text-2xl font-black mb-2 text-purple-900 dark:text-purple-100">{lesson.quiz.title}</h3>
                      <p className="text-purple-700 dark:text-purple-300 mb-6">Bạn cần đạt tối thiểu {lesson.quiz.passingScore}% để qua bài kiểm tra này.</p>
                      
                      {lesson.quiz.questions.length === 0 ? (
                        <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl text-center text-zinc-500">
                          Bài kiểm tra này hiện chưa có câu hỏi nào.
                        </div>
                      ) : (
                        <div className="space-y-6">
                           <div className="space-y-8">
                             {lesson.quiz.questions.map((question, i) => (
                               <div key={question.id} className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border space-y-4">
                                 <h4 className="font-bold text-lg"><span className="text-purple-600 mr-2">Câu {i + 1}:</span>{question.prompt}</h4>
                                 <div className="space-y-2">
                                   {question.options.map(opt => (
                                     <div key={opt.id} className="flex items-center gap-3 p-3 border rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer transition-colors">
                                       <div className="w-5 h-5 rounded-full border-2 border-zinc-300 flex-shrink-0" />
                                       <span className="text-sm">{opt.text}</span>
                                     </div>
                                   ))}
                                 </div>
                               </div>
                             ))}
                           </div>
                           <Button className="rounded-xl font-bold bg-purple-600 hover:bg-purple-700 h-12 px-8 w-full">
                             Nộp bài kiểm tra
                           </Button>
                        </div>
                      )}
                    </div>
                 </TabsContent>
               )}
            </Tabs>
         </div>
      </div>
    </div>
  )
}
