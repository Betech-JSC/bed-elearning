"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2, Award, CheckCircle2, XCircle, RotateCcw, HelpCircle, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import confetti from "canvas-confetti"

interface QuizOption {
  id: string
  text: string
  isCorrect: boolean
}

interface QuizQuestion {
  id: string
  prompt: string
  explanation: string | null
  options: QuizOption[]
}

interface QuizData {
  id: string
  title: string
  description: string | null
  passingScore: number
  questions: QuizQuestion[]
}

interface InteractiveQuizProps {
  quiz: QuizData
}

export function InteractiveQuiz({ quiz }: InteractiveQuizProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [result, setResult] = useState<{
    score: number
    passed: boolean
    correctAnswers: number
    totalQuestions: number
  } | null>(null)

  const questions = quiz.questions

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (result) return // Disable selection after submitting
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }))
  }

  const handleSubmit = async () => {
    // Check if all questions are answered
    const unansweredCount = questions.length - Object.keys(selectedAnswers).length
    if (unansweredCount > 0) {
      toast.warning(`Vui lòng trả lời đầy đủ tất cả các câu hỏi (Còn thiếu ${unansweredCount} câu)`)
      return
    }

    try {
      setIsSubmitting(true)
      const res = await fetch(`/api/quizzes/${quiz.id}/attempt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: selectedAnswers })
      })

      if (!res.ok) throw new Error("Gửi bài thất bại")

      const data = await res.json()
      
      const correctCount = questions.reduce((acc, q) => {
        const correctOpt = q.options.find(o => o.isCorrect)
        if (correctOpt && selectedAnswers[q.id] === correctOpt.id) {
          return acc + 1
        }
        return acc
      }, 0)

      setResult({
        score: data.score,
        passed: data.passed,
        correctAnswers: correctCount,
        totalQuestions: questions.length
      })

      setShowExplanation(true)

      if (data.passed) {
        toast.success(`Chúc mừng! Bạn đã vượt qua bài kiểm tra với điểm số ${data.score}%!`)
        // Trigger high quality confetti burst
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#FF6600", "#FF8533", "#8B5CF6", "#10B981"]
        })
      } else {
        toast.error(`Rất tiếc! Điểm số của bạn là ${data.score}%. Bạn cần đạt tối thiểu ${quiz.passingScore}% để vượt qua.`)
      }
    } catch (error) {
      console.error(error)
      toast.error("Đã xảy ra lỗi khi nộp bài. Vui lòng thử lại.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setSelectedAnswers({})
    setResult(null)
    setShowExplanation(false)
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-8 md:p-10 rounded-[3rem] shadow-sm overflow-hidden relative group">
      {/* Dynamic Background glow */}
      <div className={cn(
        "absolute top-0 right-0 w-80 h-80 rounded-bl-full -z-0 opacity-40 transition-all duration-700 blur-3xl",
        result 
          ? result.passed 
            ? "bg-emerald-500/10" 
            : "bg-red-500/10"
          : "bg-purple-500/10"
      )} />

      <div className="relative z-10 space-y-8">
        <div>
          <div className="flex items-center gap-3.5 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center text-purple-600 border border-purple-100/30">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">{quiz.title}</h3>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium text-sm leading-relaxed max-w-2xl">
            {quiz.description || `Bài kiểm tra trắc nghiệm giúp củng cố kiến thức bài học. Bạn cần đạt tối thiểu ${quiz.passingScore}% để vượt qua.`}
          </p>
        </div>

        {/* RESULTS CARD */}
        {result && (
          <div className={cn(
            "p-8 rounded-[2rem] border animate-in fade-in slide-in-from-bottom-4 duration-500 grid grid-cols-1 md:grid-cols-3 gap-6 items-center",
            result.passed
              ? "bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-300"
              : "bg-red-50/50 dark:bg-red-950/10 border-red-100 dark:border-red-900/30 text-red-800 dark:text-red-300"
          )}>
            <div className="flex items-center gap-4 md:col-span-2">
              {result.passed ? (
                <div className="w-14 h-14 bg-white dark:bg-emerald-900/40 rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm border border-emerald-100/50 flex-shrink-0">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
              ) : (
                <div className="w-14 h-14 bg-white dark:bg-red-900/40 rounded-2xl flex items-center justify-center text-red-500 shadow-sm border border-red-100/50 flex-shrink-0">
                  <XCircle className="w-8 h-8" />
                </div>
              )}
              <div>
                <h4 className="font-black text-xl mb-1">
                  {result.passed ? "Tuyệt vời! Bạn đã vượt qua!" : "Chưa đạt yêu cầu!"}
                </h4>
                <p className="text-xs font-semibold opacity-85 leading-relaxed">
                  {result.passed 
                    ? "Bạn đã hoàn thành xuất sắc nội dung kiểm tra năng lực của bài học này và tự động được đánh dấu hoàn tất bài học."
                    : `Bạn cần đạt ít nhất ${quiz.passingScore}% điểm. Hãy xem lại giải thích đáp án chi tiết bên dưới và thử sức lại nhé!`}
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border text-center flex flex-col justify-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-0.5">Điểm số đạt được</span>
              <span className={cn(
                "text-4xl font-black mb-1",
                result.passed ? "text-emerald-500" : "text-red-500"
              )}>
                {result.score}%
              </span>
              <span className="text-[10px] font-bold text-zinc-400">
                ({result.correctAnswers}/{result.totalQuestions} câu đúng)
              </span>
            </div>
          </div>
        )}

        {/* QUESTIONS LIST */}
        <div className="space-y-6">
          {questions.map((question, i) => {
            const isAnswered = selectedAnswers[question.id] !== undefined
            const selectedOptId = selectedAnswers[question.id]
            const correctOpt = question.options.find(o => o.isCorrect)

            return (
              <div 
                key={question.id} 
                className={cn(
                  "bg-[#F8F9FA] dark:bg-zinc-950/20 p-6 md:p-8 rounded-[2rem] border transition-all duration-300 space-y-4",
                  result
                    ? isAnswered
                      ? selectedOptId === correctOpt?.id
                        ? "border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/10 dark:bg-emerald-950/5"
                        : "border-red-200 dark:border-red-900/40 bg-red-50/10 dark:bg-red-950/5"
                      : "border-transparent"
                    : isAnswered
                      ? "border-purple-200 dark:border-purple-900/30"
                      : "border-transparent hover:border-zinc-200 dark:hover:border-zinc-800"
                )}
              >
                {/* Question Prompt */}
                <h4 className="font-black text-base text-zinc-900 dark:text-zinc-100 flex items-start gap-3">
                  <span className={cn(
                    "text-xs px-2.5 py-1 rounded-lg font-black uppercase tracking-wider shrink-0 mt-0.5",
                    result
                      ? selectedOptId === correctOpt?.id
                        ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400"
                        : "bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400"
                      : "bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400"
                  )}>
                    Câu {i + 1}
                  </span>
                  <span className="leading-snug">{question.prompt}</span>
                </h4>

                {/* Options Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {question.options.map(opt => {
                    const isSelected = selectedAnswers[question.id] === opt.id
                    
                    let optStyle = "bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800"
                    let badgeStyle = "border-zinc-200 dark:border-zinc-800"

                    if (result) {
                      // Post-submission styling
                      if (opt.isCorrect) {
                        optStyle = "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 cursor-default"
                        badgeStyle = "bg-emerald-500 border-emerald-500 text-white"
                      } else if (isSelected && !opt.isCorrect) {
                        optStyle = "bg-red-50 dark:bg-red-950/20 border-red-300 dark:border-red-800 text-red-900 dark:text-red-100 cursor-default"
                        badgeStyle = "bg-red-500 border-red-500 text-white"
                      } else {
                        optStyle = "bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 opacity-60 cursor-default"
                      }
                    } else if (isSelected) {
                      // Interactive active styling before submission
                      optStyle = "border-purple-600 dark:border-purple-500 bg-purple-50/20 dark:bg-purple-950/20 shadow-md shadow-purple-500/5 ring-1 ring-purple-600"
                      badgeStyle = "bg-purple-600 border-purple-600 text-white"
                    } else {
                      // Normal hover styling
                      optStyle = "hover:border-purple-200 dark:hover:border-purple-950 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40 hover:shadow-lg hover:shadow-purple-500/5"
                      badgeStyle = "group-hover/opt:border-purple-300"
                    }

                    return (
                      <div 
                        key={opt.id} 
                        onClick={() => handleSelectOption(question.id, opt.id)}
                        className={cn(
                          "flex items-center gap-3.5 p-4 border rounded-2xl cursor-pointer transition-all duration-300 group/opt select-none",
                          optStyle
                        )}
                      >
                        <div className={cn(
                          "w-5 h-5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-colors text-[10px] font-black",
                          badgeStyle
                        )}>
                          {isSelected && "✓"}
                        </div>
                        <span className="text-xs md:text-sm font-semibold leading-normal">{opt.text}</span>
                      </div>
                    )
                  })}
                </div>

                {/* Explanation text */}
                {result && showExplanation && question.explanation && (
                  <div className="mt-4 p-5 bg-white dark:bg-zinc-900/60 rounded-2xl border border-zinc-100 dark:border-zinc-800/60 flex gap-3 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400 font-medium animate-in fade-in duration-300">
                    <HelpCircle className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-black text-purple-600 dark:text-purple-400 mr-1.5 uppercase tracking-widest text-[9px] block mb-0.5">Lời giải chi tiết:</span>
                      {question.explanation}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* BOTTOM ACTIONS */}
        <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          {result ? (
            <Button 
              onClick={handleReset}
              variant="outline"
              className="rounded-2xl h-14 px-8 border-zinc-200 dark:border-zinc-800 font-black text-xs uppercase tracking-widest gap-2 hover:bg-white dark:hover:bg-zinc-900 hover:text-[#FF6600] hover:border-orange-100 dark:hover:border-orange-900 transition-all w-full sm:w-auto shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Thi lại bài kiểm tra
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="rounded-2xl h-14 px-10 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs uppercase tracking-widest gap-2 shadow-xl shadow-purple-500/10 active:scale-95 transition-all w-full sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang nộp bài...
                </>
              ) : (
                <>
                  Nộp bài kiểm tra
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
