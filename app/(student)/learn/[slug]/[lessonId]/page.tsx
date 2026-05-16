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
  PlayCircle
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
    <div className="flex flex-col h-screen bg-[#F8F9FA]">
      {/* TOP HEADER */}
      <div className="h-20 border-b bg-white/80 backdrop-blur-xl px-10 flex items-center justify-between sticky top-0 z-50">
         <div className="flex items-center gap-6">
            <Link 
                href={`/courses/${course.slug}`} 
                className="flex items-center gap-4 group transition-all"
            >
                <div className="w-10 h-10 rounded-2xl bg-zinc-100 flex items-center justify-center group-hover:bg-orange-50 transition-colors border border-transparent group-hover:border-orange-100">
                    <ChevronLeft className="w-5 h-5 text-zinc-500 group-hover:text-[#FF6600]" />
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-[#FF6600] transition-colors">Danh mục khóa học</span>
                    <span className="text-sm font-black text-zinc-900 line-clamp-1 group-hover:text-[#FF6600] transition-colors">
                        {course.title}
                    </span>
                </div>
            </Link>
            <div className="h-8 w-px bg-zinc-100 mx-2" />
            <div className="flex flex-col">
               <span className="text-[10px] font-black uppercase tracking-widest text-[#FF6600]">Bài học hiện tại</span>
               <h1 className="font-black text-zinc-900 text-sm line-clamp-1">
                  {lesson.title}
               </h1>
            </div>
         </div>

         <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-orange-50 border border-orange-100">
                <div className="w-2 h-2 rounded-full bg-[#FF6600] animate-pulse" />
                <span className="text-[10px] font-black text-[#FF6600] uppercase tracking-widest">Đang học</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white border border-zinc-100 shadow-sm flex items-center justify-center text-zinc-400 cursor-pointer hover:text-zinc-900 transition-all">
                <Info className="w-5 h-5" />
            </div>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* MAIN CONTENT AREA */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-10">
            <div className="max-w-5xl mx-auto space-y-10 pb-20">
                {/* VIDEO PLAYER AREA */}
                <div className="space-y-8">
                    <div className="aspect-video rounded-[3rem] overflow-hidden bg-black shadow-2xl border border-zinc-100 relative group">
                        <VideoPlayer 
                            videoUrl={lesson.videoUrl || ""} 
                            lessonId={lesson.id}
                            courseId={course.id}
                        />
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex gap-4">
                            {prevLesson ? (
                                <Button asChild variant="outline" className="rounded-2xl h-14 px-8 font-black border-zinc-200 gap-3 hover:bg-white hover:text-[#FF6600] hover:border-orange-100 transition-all">
                                    <Link href={`/learn/${course.slug}/${prevLesson.id}`}>
                                        <ChevronLeft className="w-5 h-5" />
                                        Bài trước
                                    </Link>
                                </Button>
                            ) : <div className="w-32" />}
                            
                            {nextLesson ? (
                                <Button asChild variant="outline" className="rounded-2xl h-14 px-8 font-black border-zinc-200 gap-3 hover:bg-white hover:text-[#FF6600] hover:border-orange-100 transition-all">
                                    <Link href={`/learn/${course.slug}/${nextLesson.id}`}>
                                        Bài tiếp theo
                                        <ChevronRight className="w-5 h-5" />
                                    </Link>
                                </Button>
                            ) : <div className="w-32" />}
                        </div>

                        <form action={async () => {
                            "use server"
                            await completeLesson(lesson.id)
                        }}>
                            <Button 
                                type="submit"
                                className={cn(
                                    "rounded-[1.5rem] h-14 px-10 font-black text-sm gap-3 shadow-2xl transition-all active:scale-95 uppercase tracking-widest",
                                    isCompleted 
                                        ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20 text-white" 
                                        : "bg-zinc-900 hover:bg-black shadow-zinc-900/20 text-white"
                                )}
                            >
                                <CheckCircle className={cn("w-5 h-5", isCompleted && "fill-current")} />
                                {isCompleted ? "Đã hoàn thành" : "Đánh dấu hoàn thành"}
                            </Button>
                        </form>
                    </div>
                </div>

                {/* CONTENT TABS */}
                <Tabs defaultValue="description" className="w-full">
                    <TabsList className="w-full justify-start bg-white rounded-3xl p-2 h-auto gap-2 mb-10 shadow-sm border border-zinc-50">
                        <TabsTrigger value="description" className="rounded-2xl data-[state=active]:bg-orange-50 data-[state=active]:text-[#FF6600] px-8 py-3 font-black text-xs uppercase tracking-widest transition-all">Tổng quan</TabsTrigger>
                        <TabsTrigger value="resources" className="rounded-2xl data-[state=active]:bg-orange-50 data-[state=active]:text-[#FF6600] px-8 py-3 font-black text-xs uppercase tracking-widest transition-all">Tài liệu</TabsTrigger>
                        <TabsTrigger value="qa" className="rounded-2xl data-[state=active]:bg-orange-50 data-[state=active]:text-[#FF6600] px-8 py-3 font-black text-xs uppercase tracking-widest transition-all">Hỏi đáp</TabsTrigger>
                        <TabsTrigger value="notes" className="rounded-2xl data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 px-8 py-3 font-black text-xs uppercase tracking-widest transition-all">Ghi chú</TabsTrigger>
                        {lesson.quiz && (
                            <TabsTrigger value="quiz" className="rounded-2xl data-[state=active]:bg-purple-50 data-[state=active]:text-purple-600 px-8 py-3 font-black text-xs uppercase tracking-widest transition-all ml-auto">Bài kiểm tra</TabsTrigger>
                        )}
                    </TabsList>

                    <TabsContent value="description" className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="bg-white p-10 rounded-[2.5rem] border border-zinc-50 shadow-sm">
                            <h3 className="text-xl font-black text-zinc-900 mb-6 flex items-center gap-3">
                                <Info className="w-6 h-6 text-[#FF6600]" />
                                Tổng quan bài học
                            </h3>
                            <p className="text-zinc-600 font-medium leading-relaxed">
                                {lesson.description || "Bài học này chưa có mô tả chi tiết."}
                            </p>
                        </div>
                    </TabsContent>

                    <TabsContent value="resources" className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {lesson.attachments.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {lesson.attachments.map((file) => (
                                    <a key={file.id} href={file.url} target="_blank" rel="noreferrer" className="flex items-center gap-5 p-6 bg-white border border-zinc-100 rounded-[2rem] hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5 transition-all group">
                                        <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-[#FF6600] shrink-0 border border-orange-100 shadow-sm group-hover:scale-110 transition-transform">
                                            <FileText className="w-7 h-7" />
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="font-black text-zinc-900 group-hover:text-[#FF6600] transition-colors">{file.name}</span>
                                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Tải file</span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-zinc-100 flex flex-col items-center justify-center text-zinc-400 gap-6">
                                <FileText className="w-16 h-16 opacity-10" />
                                <p className="font-black uppercase tracking-widest text-xs">Chưa có tài liệu đính kèm</p>
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
                            <div className="bg-white border border-zinc-100 p-12 rounded-[3rem] shadow-sm overflow-hidden relative group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-bl-full -z-0 opacity-50" />
                                <div className="relative z-10">
                                    <h3 className="text-3xl font-black mb-2 text-zinc-900">{lesson.quiz.title}</h3>
                                    <p className="text-zinc-500 font-medium mb-10 max-w-lg leading-relaxed">Bạn cần đạt ít nhất <span className="text-purple-600 font-black">{lesson.quiz.passingScore}%</span> điểm để vượt qua bài kiểm tra này.</p>
                                    
                                    {lesson.quiz.questions.length === 0 ? (
                                        <div className="bg-[#F8F9FA] p-10 rounded-3xl text-center flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                               <Info className="w-8 h-8 text-zinc-200" />
                                            </div>
                                            <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Bài kiểm tra đang cập nhật nội dung</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-10">
                                            <div className="space-y-8">
                                                {lesson.quiz.questions.map((question, i) => (
                                                    <div key={question.id} className="bg-[#F8F9FA] p-8 rounded-[2rem] border border-transparent hover:border-purple-100 transition-all space-y-6">
                                                        <h4 className="font-black text-lg text-zinc-900"><span className="text-purple-600 mr-3">Câu {i + 1}</span>{question.prompt}</h4>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            {question.options.map(opt => (
                                                                <div key={opt.id} className="flex items-center gap-4 p-5 bg-white border border-zinc-50 rounded-2xl hover:border-purple-200 hover:shadow-lg hover:shadow-purple-500/5 cursor-pointer transition-all group/opt">
                                                                    <div className="w-6 h-6 rounded-lg border-2 border-zinc-100 flex-shrink-0 group-hover/opt:border-purple-300 transition-colors" />
                                                                    <span className="text-sm font-bold text-zinc-600 group-hover/opt:text-zinc-900">{opt.text}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <Button className="rounded-[1.5rem] font-black bg-purple-600 hover:bg-purple-700 h-16 px-12 shadow-xl shadow-purple-500/20 uppercase tracking-widest text-sm">
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
