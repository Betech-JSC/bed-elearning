import prisma from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle,
  FileText,
  MessageSquare,
  Info,
  PlayCircle,
  BookOpen,
  PenTool,
  Award
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VideoPlayer } from "@/components/player/video-player"
import { completeLesson } from "@/lib/actions/course"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { QnaSection } from "@/components/player/qna-section"
import { NotesSection } from "@/components/player/notes-section"

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
    <div className="flex flex-col h-screen bg-[#F8F9FA] dark:bg-zinc-950/20">
      {/* TOP HEADER - Glassmorphic Design */}
      <div className="h-20 border-b border-zinc-100/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl px-6 md:px-8 flex items-center justify-between sticky top-0 z-50">
         <div className="flex items-center gap-4 md:gap-6 min-w-0">
            <Link 
                href={`/courses/${course.slug}`} 
                className="flex items-center gap-3 group transition-all min-w-0"
            >
                <div className="w-10 h-10 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center group-hover:bg-orange-50 dark:group-hover:bg-orange-950/30 transition-colors border border-transparent group-hover:border-orange-100 dark:group-hover:border-orange-900 shrink-0">
                    <ChevronLeft className="w-5 h-5 text-zinc-500 group-hover:text-[#FF6600]" />
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-[#FF6600] transition-colors">Danh mục khóa học</span>
                    <span className="text-xs md:text-sm font-black text-zinc-900 dark:text-zinc-100 line-clamp-1 group-hover:text-[#FF6600] transition-colors">
                        {course.title}
                    </span>
                </div>
            </Link>
            <div className="h-8 w-px bg-zinc-200/60 dark:bg-zinc-800 mx-1 md:mx-2 shrink-0" />
            <div className="flex flex-col min-w-0">
               <span className="text-[9px] font-black uppercase tracking-widest text-[#FF6600]">Bài học hiện tại</span>
               <h1 className="font-black text-zinc-900 dark:text-zinc-100 text-xs md:text-sm line-clamp-1">
                  {lesson.title}
               </h1>
            </div>
         </div>

         <div className="flex items-center gap-4 md:gap-6 shrink-0">
            <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-orange-50 dark:bg-orange-950/20 border border-orange-100/50 dark:border-orange-900/30">
                <div className="w-2 h-2 rounded-full bg-[#FF6600] animate-pulse" />
                <span className="text-[9px] font-black text-[#FF6600] uppercase tracking-widest">Đang học</span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm flex items-center justify-center text-zinc-400 cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100 transition-all">
                <Info className="w-5 h-5" />
            </div>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* MAIN CONTENT AREA */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">
            <div className="max-w-5xl mx-auto space-y-8 pb-20">
                {/* VIDEO PLAYER AREA - Theater Mode Container */}
                <div className="space-y-6">
                    <div className="aspect-video rounded-[2.5rem] md:rounded-[3rem] overflow-hidden bg-black shadow-2xl border border-zinc-100/50 dark:border-zinc-800 ring-1 ring-black/5 dark:ring-white/5 relative group transition-all duration-500 shadow-orange-500/5">
                        <VideoPlayer 
                            videoUrl={lesson.videoUrl || ""} 
                            lessonId={lesson.id}
                            courseId={course.id}
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
                        <div className="flex gap-3 w-full sm:w-auto">
                            {prevLesson ? (
                                <Button asChild variant="outline" className="rounded-2xl h-12 px-6 font-bold border-zinc-200 dark:border-zinc-800 gap-2 hover:bg-white dark:hover:bg-zinc-900 hover:text-[#FF6600] hover:border-orange-100 dark:hover:border-orange-900 transition-all flex-1 sm:flex-none">
                                    <Link href={`/learn/${course.slug}/${prevLesson.id}`}>
                                        <ChevronLeft className="w-4 h-4" />
                                        Bài trước
                                    </Link>
                                </Button>
                            ) : <div className="hidden sm:block w-32" />}
                            
                            {nextLesson ? (
                                <Button asChild variant="outline" className="rounded-2xl h-12 px-6 font-bold border-zinc-200 dark:border-zinc-800 gap-2 hover:bg-white dark:hover:bg-zinc-900 hover:text-[#FF6600] hover:border-orange-100 dark:hover:border-orange-900 transition-all flex-1 sm:flex-none">
                                    <Link href={`/learn/${course.slug}/${nextLesson.id}`}>
                                        Bài tiếp theo
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </Button>
                            ) : <div className="hidden sm:block w-32" />}
                        </div>

                        <form action={async () => {
                            "use server"
                            await completeLesson(lesson.id)
                        }} className="w-full sm:w-auto">
                            <Button 
                                type="submit"
                                className={cn(
                                    "rounded-2xl h-12 px-8 font-black text-xs gap-2.5 shadow-xl transition-all active:scale-95 uppercase tracking-widest w-full sm:w-auto",
                                    isCompleted 
                                        ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/10 text-white" 
                                        : "bg-zinc-900 hover:bg-black dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 shadow-zinc-900/10 text-white"
                                )}
                            >
                                <CheckCircle className={cn("w-4 h-4", isCompleted && "fill-current")} />
                                {isCompleted ? "Đã hoàn thành" : "Đánh dấu hoàn thành"}
                            </Button>
                        </form>
                    </div>
                </div>

                {/* CONTENT TABS - Glassmorphic Redesign */}
                <Tabs defaultValue="description" className="w-full">
                    <TabsList className="w-full justify-start bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md rounded-3xl p-2 h-auto gap-2 mb-8 shadow-sm border border-zinc-100/80 dark:border-zinc-800/80">
                        <TabsTrigger 
                            value="description" 
                            className="rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF6600] data-[state=active]:to-[#FF8533] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-orange-500/20 px-6 py-3 font-bold text-sm text-zinc-500 dark:text-zinc-400 hover:text-[#FF6600] dark:hover:text-[#FF6600] transition-all flex items-center gap-2 duration-300"
                        >
                            <BookOpen className="w-4 h-4" />
                            Tổng quan
                        </TabsTrigger>
                        <TabsTrigger 
                            value="resources" 
                            className="rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF6600] data-[state=active]:to-[#FF8533] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-orange-500/20 px-6 py-3 font-bold text-sm text-zinc-500 dark:text-zinc-400 hover:text-[#FF6600] dark:hover:text-[#FF6600] transition-all flex items-center gap-2 duration-300"
                        >
                            <FileText className="w-4 h-4" />
                            Tài liệu
                        </TabsTrigger>
                        <TabsTrigger 
                            value="qa" 
                            className="rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF6600] data-[state=active]:to-[#FF8533] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-orange-500/20 px-6 py-3 font-bold text-sm text-zinc-500 dark:text-zinc-400 hover:text-[#FF6600] dark:hover:text-[#FF6600] transition-all flex items-center gap-2 duration-300"
                        >
                            <MessageSquare className="w-4 h-4" />
                            Hỏi đáp
                        </TabsTrigger>
                        <TabsTrigger 
                            value="notes" 
                            className="rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF6600] data-[state=active]:to-[#FF8533] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-orange-500/20 px-6 py-3 font-bold text-sm text-zinc-500 dark:text-zinc-400 hover:text-[#FF6600] dark:hover:text-[#FF6600] transition-all flex items-center gap-2 duration-300"
                        >
                            <PenTool className="w-4 h-4" />
                            Ghi chú
                        </TabsTrigger>
                        {lesson.quiz && (
                            <TabsTrigger 
                                value="quiz" 
                                className="rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/20 px-6 py-3 font-bold text-sm text-zinc-500 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-600 transition-all flex items-center gap-2 duration-300 sm:ml-auto"
                            >
                                <Award className="w-4 h-4" />
                                Bài kiểm tra
                            </TabsTrigger>
                        )}
                    </TabsList>

                    <TabsContent value="description" className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
                            <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-3">
                                <Info className="w-5 h-5 text-[#FF6600]" />
                                Tổng quan bài học
                            </h3>
                            <p className="text-zinc-600 dark:text-zinc-300 font-medium leading-relaxed text-sm">
                                {lesson.description || "Bài học này chưa có mô tả chi tiết."}
                            </p>
                        </div>
                    </TabsContent>

                    <TabsContent value="resources" className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {lesson.attachments.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {lesson.attachments.map((file) => (
                                    <a key={file.id} href={file.url} target="_blank" rel="noreferrer" className="flex items-center gap-4 p-5 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2rem] hover:border-orange-200 dark:hover:border-orange-900 hover:shadow-xl hover:shadow-orange-500/5 transition-all group">
                                        <div className="w-12 h-12 bg-orange-50 dark:bg-orange-950/30 rounded-2xl flex items-center justify-center text-[#FF6600] shrink-0 border border-orange-100/50 dark:border-orange-900 shadow-sm group-hover:scale-110 transition-transform">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div className="flex flex-col gap-0.5 min-w-0">
                                            <span className="font-black text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-[#FF6600] transition-colors truncate">{file.name}</span>
                                            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Tải file</span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-zinc-900 p-16 rounded-[3rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-500 gap-4">
                                <FileText className="w-12 h-12 opacity-20" />
                                <p className="font-black uppercase tracking-widest text-[10px]">Chưa có tài liệu đính kèm</p>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="qa" className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <QnaSection 
                            lessonId={lesson.id}
                            questions={lesson.questions}
                            userId={userId}
                            courseInstructorId={course.instructorId}
                            isAdmin={session?.user?.role === "ADMIN"}
                        />
                    </TabsContent>

                    <TabsContent value="notes" className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <NotesSection courseId={course.id} lessonId={lesson.id} />
                    </TabsContent>

                    {lesson.quiz && (
                        <TabsContent value="quiz" className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-8 md:p-10 rounded-[3rem] shadow-sm overflow-hidden relative group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 dark:bg-purple-950/10 rounded-bl-full -z-0 opacity-50" />
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-black mb-2 text-zinc-900 dark:text-zinc-100">{lesson.quiz.title}</h3>
                                    <p className="text-zinc-500 dark:text-zinc-400 font-medium mb-8 max-w-lg leading-relaxed text-sm">Bạn cần đạt ít nhất <span className="text-purple-600 font-black">{lesson.quiz.passingScore}%</span> điểm để vượt qua bài kiểm tra này.</p>
                                    
                                    {lesson.quiz.questions.length === 0 ? (
                                        <div className="bg-[#F8F9FA] dark:bg-zinc-950/40 p-8 rounded-3xl text-center flex flex-col items-center gap-4">
                                            <div className="w-14 h-14 bg-white dark:bg-zinc-900 rounded-2xl flex items-center justify-center shadow-sm">
                                               <Info className="w-6 h-6 text-zinc-200 dark:text-zinc-700" />
                                            </div>
                                            <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Bài kiểm tra đang cập nhật nội dung</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-8">
                                            <div className="space-y-6">
                                                {lesson.quiz.questions.map((question, i) => (
                                                    <div key={question.id} className="bg-[#F8F9FA] dark:bg-zinc-950/20 p-6 md:p-8 rounded-[2rem] border border-transparent hover:border-purple-100 dark:hover:border-purple-900/50 transition-all space-y-4">
                                                        <h4 className="font-black text-base text-zinc-900 dark:text-zinc-100"><span className="text-purple-600 mr-3">Câu {i + 1}</span>{question.prompt}</h4>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            {question.options.map(opt => (
                                                                <div key={opt.id} className="flex items-center gap-3.5 p-4 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl hover:border-purple-200 dark:hover:border-purple-950/50 hover:shadow-lg hover:shadow-purple-500/5 cursor-pointer transition-all group/opt">
                                                                    <div className="w-5 h-5 rounded-lg border-2 border-zinc-100 dark:border-zinc-800 flex-shrink-0 group-hover/opt:border-purple-300 transition-colors" />
                                                                    <span className="text-xs md:text-sm font-bold text-zinc-600 dark:text-zinc-400 group-hover/opt:text-zinc-900 dark:group-hover/opt:text-zinc-100">{opt.text}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <Button className="rounded-[1.25rem] font-black bg-purple-600 hover:bg-purple-700 h-14 px-10 shadow-xl shadow-purple-500/20 uppercase tracking-widest text-xs">
                                                Nộp bài
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </TabsContent>
                    )}
                </Tabs>
            </div>
        </div>
      </div>
    </div>
  )
}
