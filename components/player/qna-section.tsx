"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { 
    MessageSquare, 
    Send, 
    Loader2, 
    CheckCircle2, 
    Trash2, 
    CornerDownRight,
    Search,
    UserCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { createQuestion, createAnswer, toggleResolve, deleteQuestion } from "@/lib/actions/qna"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

interface QnaSectionProps {
  lessonId: string
  questions: any[]
  userId: string
  courseInstructorId: string
  isAdmin: boolean
}

export function QnaSection({
  lessonId,
  questions,
  userId,
  courseInstructorId,
  isAdmin
}: QnaSectionProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [questionBody, setQuestionBody] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyBody, setReplyBody] = useState("")

  const filteredQuestions = questions.filter(q => 
    q.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.user.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const onQuestionSubmit = async () => {
    if (!questionBody.trim()) return

    startTransition(async () => {
      const result = await createQuestion({
        lessonId,
        body: questionBody
      })

      if (result.success) {
        toast.success("Đã gửi câu hỏi!")
        setQuestionBody("")
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  const onAnswerSubmit = async (questionId: string) => {
    if (!replyBody.trim()) return

    startTransition(async () => {
      const result = await createAnswer({
        questionId,
        body: replyBody,
        lessonId
      })

      if (result.success) {
        toast.success("Đã gửi phản hồi!")
        setReplyBody("")
        setReplyTo(null)
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  const onToggleResolve = async (questionId: string) => {
    startTransition(async () => {
        const result = await toggleResolve(questionId, lessonId)
        if (result.success) {
            router.refresh()
        }
    })
  }

  const onDelete = async (questionId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa câu hỏi này?")) return

    startTransition(async () => {
        const result = await deleteQuestion(questionId, lessonId)
        if (result.success) {
            toast.success("Đã xóa câu hỏi")
            router.refresh()
        }
    })
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* SEARCH & FILTER */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm câu hỏi..."
                className="pl-10 rounded-2xl border-zinc-200 focus:ring-blue-500"
            />
          </div>
          <div className="text-sm font-medium text-zinc-500">
              {filteredQuestions.length} câu hỏi
          </div>
      </div>

      {/* NEW QUESTION INPUT */}
      <div className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-4">
        <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 shrink-0">
                <UserCircle className="w-6 h-6" />
            </div>
            <div className="flex-1 space-y-3">
                <Textarea 
                    value={questionBody}
                    onChange={(e) => setQuestionBody(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none" 
                    placeholder="Đặt câu hỏi về bài học này..."
                    rows={3}
                />
                <div className="flex justify-end">
                    <Button 
                        onClick={onQuestionSubmit}
                        disabled={isPending || !questionBody.trim()}
                        className="rounded-xl font-bold bg-blue-600 hover:bg-blue-700 h-11 px-6 shadow-lg shadow-blue-600/20"
                    >
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4 mr-2" /> Gửi câu hỏi</>}
                    </Button>
                </div>
            </div>
        </div>
      </div>

      {/* QUESTIONS LIST */}
      <div className="space-y-6">
        {filteredQuestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-zinc-500 gap-4 py-12 bg-zinc-50 dark:bg-zinc-900/30 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
             <MessageSquare className="w-12 h-12 opacity-10" />
             <p className="text-sm font-medium italic">Không tìm thấy câu hỏi nào phù hợp.</p>
          </div>
        ) : (
          filteredQuestions.map((q) => (
            <div key={q.id} className={cn(
                "group bg-white dark:bg-zinc-950 p-6 rounded-3xl border transition-all hover:shadow-md",
                q.isResolved ? "border-emerald-100 bg-emerald-50/10" : "border-zinc-100 dark:border-zinc-800"
            )}>
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-600 dark:text-zinc-400 font-bold shrink-0">
                        {q.user.image ? <img src={q.user.image} className="w-full h-full rounded-full object-cover" /> : q.user.name?.[0] || "?"}
                    </div>
                    <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-zinc-900 dark:text-white">{q.user.name}</span>
                                <span className="text-[10px] font-medium text-zinc-500 bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded-full">
                                    {new Date(q.createdAt).toLocaleDateString("vi-VN")}
                                </span>
                                {q.isResolved && (
                                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-900/30">
                                        <CheckCircle2 className="w-3 h-3" />
                                        Đã giải quyết
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                {(q.userId === userId || isAdmin || courseInstructorId === userId) && (
                                    <>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="h-8 w-8 p-0 rounded-full text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50"
                                            onClick={() => onToggleResolve(q.id)}
                                        >
                                            <CheckCircle2 className="w-4 h-4" />
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="h-8 w-8 p-0 rounded-full text-zinc-400 hover:text-red-600 hover:bg-red-50"
                                            onClick={() => onDelete(q.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                        <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">{q.body}</p>
                        
                        <div className="pt-2">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-bold p-0 h-auto"
                                onClick={() => setReplyTo(replyTo === q.id ? null : q.id)}
                            >
                                <CornerDownRight className="w-3 h-3 mr-1" />
                                Phản hồi ({q.answers.length})
                            </Button>
                        </div>
                    </div>
                </div>

                {/* ANSWERS LIST */}
                {q.answers.length > 0 && (
                  <div className="ml-14 space-y-4 border-l-2 border-zinc-100 dark:border-zinc-800 pl-6 mt-4">
                    {q.answers.map((a: any) => (
                      <div key={a.id} className="flex gap-4 items-start group/answer">
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0 text-sm",
                            a.user.role === "INSTRUCTOR" ? "bg-emerald-100 text-emerald-600" : "bg-zinc-100 text-zinc-600"
                        )}>
                            {a.user.image ? <img src={a.user.image} className="w-full h-full rounded-full object-cover" /> : a.user.name?.[0] || "?"}
                        </div>
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-sm">{a.user.name}</span>
                                {a.user.role === "INSTRUCTOR" && (
                                    <span className="bg-emerald-500 text-white text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider">Giảng viên</span>
                                )}
                                <span className="text-[10px] text-zinc-400">{new Date(a.createdAt).toLocaleDateString("vi-VN")}</span>
                            </div>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{a.body}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* REPLY INPUT */}
                {replyTo === q.id && (
                    <div className="ml-14 mt-4 animate-in slide-in-from-top-2 duration-300">
                        <div className="flex gap-4 items-start bg-zinc-50 dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                            <div className="flex-1 space-y-3">
                                <Textarea 
                                    value={replyBody}
                                    onChange={(e) => setReplyBody(e.target.value)}
                                    className="w-full bg-white dark:bg-zinc-950 border-none rounded-xl p-3 text-xs focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none" 
                                    placeholder="Viết phản hồi..."
                                    rows={2}
                                />
                                <div className="flex justify-end gap-2">
                                    <Button 
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setReplyTo(null)}
                                        className="text-xs font-bold"
                                    >
                                        Hủy
                                    </Button>
                                    <Button 
                                        size="sm"
                                        onClick={() => onAnswerSubmit(q.id)}
                                        disabled={isPending || !replyBody.trim()}
                                        className="rounded-lg font-bold bg-zinc-900 hover:bg-black text-xs"
                                    >
                                        {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Gửi phản hồi"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
