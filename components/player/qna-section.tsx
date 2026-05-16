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
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* SEARCH & FILTER */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions..."
                className="pl-12 h-12 rounded-2xl bg-[#F8F9FA] border-none text-sm font-medium focus-visible:ring-[#FF6600]/20"
            />
          </div>
          <div className="text-xs font-black text-zinc-400 uppercase tracking-widest bg-white px-4 py-2 rounded-xl border border-zinc-100 shadow-sm">
              {filteredQuestions.length} DISCUSSIONS
          </div>
      </div>

      {/* NEW QUESTION INPUT */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm space-y-6">
        <div className="flex gap-6 items-start">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-[#FF6600] shrink-0 border border-orange-100 shadow-sm">
                <MessageSquare className="w-6 h-6" />
            </div>
            <div className="flex-1 space-y-4">
                <Textarea 
                    value={questionBody}
                    onChange={(e) => setQuestionBody(e.target.value)}
                    className="w-full bg-[#F8F9FA] border-none rounded-2xl p-6 text-sm font-medium focus-visible:ring-[#FF6600]/10 outline-none transition-all resize-none min-h-[120px]" 
                    placeholder="Have a question about this lesson?"
                    rows={4}
                />
                <div className="flex justify-end">
                    <Button 
                        onClick={onQuestionSubmit}
                        disabled={isPending || !questionBody.trim()}
                        className="rounded-2xl font-black bg-[#FF6600] hover:bg-orange-600 h-12 px-8 shadow-xl shadow-orange-500/20"
                    >
                        {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4 mr-2" /> Post Question</>}
                    </Button>
                </div>
            </div>
        </div>
      </div>

      {/* QUESTIONS LIST */}
      <div className="space-y-8">
        {filteredQuestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-zinc-500 gap-6 py-20 bg-[#F8F9FA] rounded-[3rem] border-2 border-dashed border-zinc-200">
             <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <Search className="w-8 h-8 text-zinc-200" />
             </div>
             <p className="text-sm font-bold uppercase tracking-widest text-zinc-400">No questions found</p>
          </div>
        ) : (
          filteredQuestions.map((q) => (
            <div key={q.id} className={cn(
                "group bg-white p-8 rounded-[2.5rem] border transition-all hover:shadow-xl hover:shadow-orange-500/5",
                q.isResolved ? "border-emerald-100 bg-emerald-50/5" : "border-zinc-100"
            )}>
              <div className="space-y-6">
                <div className="flex gap-6 items-start">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-900 font-black shrink-0 shadow-sm border border-white">
                        {q.user.image ? <img src={q.user.image} className="w-full h-full rounded-2xl object-cover" /> : q.user.name?.[0] || "?"}
                    </div>
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="font-black text-zinc-900">{q.user.name}</span>
                                <span className="text-[10px] font-black text-zinc-400 bg-[#F8F9FA] px-3 py-1 rounded-lg border border-zinc-50 uppercase tracking-widest">
                                    {new Date(q.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric' })}
                                </span>
                                {q.isResolved && (
                                    <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100 uppercase tracking-widest">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        Resolved
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                {(q.userId === userId || isAdmin || courseInstructorId === userId) && (
                                    <>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="h-10 w-10 p-0 rounded-xl text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50"
                                            onClick={() => onToggleResolve(q.id)}
                                        >
                                            <CheckCircle2 className="w-5 h-5" />
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="h-10 w-10 p-0 rounded-xl text-zinc-400 hover:text-red-600 hover:bg-red-50"
                                            onClick={() => onDelete(q.id)}
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                        <p className="text-zinc-700 font-medium leading-relaxed">{q.body}</p>
                        
                        <div className="pt-4">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-[#FF6600] hover:text-orange-700 hover:bg-orange-50 font-black text-xs uppercase tracking-widest p-0 h-auto"
                                onClick={() => setReplyTo(replyTo === q.id ? null : q.id)}
                            >
                                <CornerDownRight className="w-4 h-4 mr-2" />
                                {q.answers.length} Replies
                            </Button>
                        </div>
                    </div>
                </div>

                {/* ANSWERS LIST */}
                {q.answers.length > 0 && (
                  <div className="ml-16 space-y-6 border-l-2 border-zinc-50 pl-10 mt-6">
                    {q.answers.map((a: any) => (
                      <div key={a.id} className="flex gap-5 items-start group/answer">
                        <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center font-black shrink-0 text-sm border border-white shadow-sm",
                            a.user.role === "INSTRUCTOR" ? "bg-orange-100 text-[#FF6600]" : "bg-[#F8F9FA] text-zinc-600"
                        )}>
                            {a.user.image ? <img src={a.user.image} className="w-full h-full rounded-xl object-cover" /> : a.user.name?.[0] || "?"}
                        </div>
                        <div className="flex-1 space-y-1.5">
                            <div className="flex items-center gap-3">
                                <span className="font-black text-zinc-900 text-sm">{a.user.name}</span>
                                {a.user.role === "INSTRUCTOR" && (
                                    <span className="bg-[#FF6600] text-white text-[8px] px-2.5 py-1 rounded-lg font-black uppercase tracking-widest">Instructor</span>
                                )}
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{new Date(a.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric' })}</span>
                            </div>
                            <p className="text-sm text-zinc-600 font-medium leading-relaxed">{a.body}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* REPLY INPUT */}
                {replyTo === q.id && (
                    <div className="ml-16 mt-6 animate-in slide-in-from-top-4 duration-500">
                        <div className="flex gap-5 items-start bg-[#F8F9FA] p-6 rounded-[2rem] border border-zinc-100">
                            <div className="flex-1 space-y-4">
                                <Textarea 
                                    value={replyBody}
                                    onChange={(e) => setReplyBody(e.target.value)}
                                    className="w-full bg-white border-none rounded-2xl p-4 text-sm font-medium focus-visible:ring-[#FF6600]/10 outline-none transition-all resize-none" 
                                    placeholder="Write a reply..."
                                    rows={3}
                                />
                                <div className="flex justify-end gap-3">
                                    <Button 
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setReplyTo(null)}
                                        className="text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900"
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        size="sm"
                                        onClick={() => onAnswerSubmit(q.id)}
                                        disabled={isPending || !replyBody.trim()}
                                        className="rounded-xl font-black bg-zinc-900 hover:bg-black text-xs uppercase tracking-widest h-10 px-6 shadow-xl"
                                    >
                                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Post Reply"}
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
