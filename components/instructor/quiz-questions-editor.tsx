"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle, Trash2, CheckCircle2, ChevronLeft, Save } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface QuizQuestionsEditorProps {
  quiz: any
  onBack: () => void
}

export const QuizQuestionsEditor = ({ quiz, onBack }: QuizQuestionsEditorProps) => {
  const [questions, setQuestions] = useState(quiz.questions || [])
  const [isAddingQuestion, setIsAddingQuestion] = useState(false)
  const [newQuestionPrompt, setNewQuestionPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const onAddQuestion = async () => {
    if (!newQuestionPrompt.trim()) return
    try {
      setIsLoading(true)
      const res = await fetch(`/api/quizzes/${quiz.id}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: newQuestionPrompt })
      })
      if (!res.ok) throw new Error()
      const newQuestion = await res.json()
      setQuestions([...questions, { ...newQuestion, options: [] }])
      setNewQuestionPrompt("")
      setIsAddingQuestion(false)
      toast.success("Đã thêm câu hỏi")
    } catch {
      toast.error("Không thể thêm câu hỏi")
    } finally {
      setIsLoading(false)
    }
  }

  const onAddOption = async (questionId: string, text: string, isCorrect: boolean) => {
    try {
      const res = await fetch(`/api/questions/${questionId}/options`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, isCorrect })
      })
      if (!res.ok) throw new Error()
      const newOption = await res.json()
      
      setQuestions(questions.map((q: any) => {
        if (q.id === questionId) {
          return { ...q, options: [...q.options, newOption] }
        }
        return q
      }))
      toast.success("Đã thêm lựa chọn")
    } catch {
      toast.error("Không thể thêm lựa chọn")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button onClick={onBack} variant="ghost" size="sm" className="rounded-xl">
          <ChevronLeft className="w-4 h-4 mr-2" /> Quay lại
        </Button>
        <h3 className="font-bold text-xl">{quiz.title} - Quản lý câu hỏi</h3>
      </div>

      <div className="space-y-8">
        {questions.map((question: any, index: number) => (
          <div key={question.id} className="border rounded-3xl p-6 bg-white dark:bg-zinc-950 shadow-sm space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Câu hỏi {index + 1}</span>
                <h4 className="text-lg font-bold mt-1">{question.prompt}</h4>
              </div>
              <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50 rounded-xl">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-medium text-zinc-500 uppercase">Các lựa chọn trả lời</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {question.options.map((option: any) => (
                  <div key={option.id} className={`flex items-center justify-between p-3 border rounded-2xl ${option.isCorrect ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-900/30" : ""}`}>
                    <div className="flex items-center gap-3">
                      {option.isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-zinc-300" />
                      )}
                      <span className={`text-sm ${option.isCorrect ? "font-bold text-emerald-900 dark:text-emerald-100" : ""}`}>{option.text}</span>
                    </div>
                  </div>
                ))}
                <AddOptionForm onAdd={(text, isCorrect) => onAddOption(question.id, text, isCorrect)} />
              </div>
            </div>
          </div>
        ))}

        {isAddingQuestion ? (
          <div className="border-2 border-dashed border-blue-200 rounded-3xl p-6 bg-blue-50/30 space-y-4">
            <textarea 
              className="w-full bg-white dark:bg-zinc-950 border rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Nhập nội dung câu hỏi..."
              rows={3}
              value={newQuestionPrompt}
              onChange={(e) => setNewQuestionPrompt(e.target.value)}
            />
            <div className="flex gap-2 justify-end">
              <Button onClick={onAddQuestion} disabled={isLoading} size="sm" className="rounded-xl bg-blue-600">Lưu câu hỏi</Button>
              <Button onClick={() => setIsAddingQuestion(false)} variant="ghost" size="sm" className="rounded-xl">Hủy</Button>
            </div>
          </div>
        ) : (
          <Button onClick={() => setIsAddingQuestion(true)} variant="outline" className="w-full py-8 border-dashed border-2 rounded-3xl hover:bg-zinc-50 hover:border-blue-500 group transition-all">
            <PlusCircle className="w-6 h-6 mr-2 text-zinc-400 group-hover:text-blue-500" />
            <span className="font-bold text-zinc-500 group-hover:text-blue-600">Thêm câu hỏi mới</span>
          </Button>
        )}
      </div>
    </div>
  )
}

const AddOptionForm = ({ onAdd }: { onAdd: (text: string, isCorrect: boolean) => void }) => {
  const [text, setText] = useState("")
  const [isCorrect, setIsCorrect] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  if (!isExpanded) {
    return (
      <Button onClick={() => setIsExpanded(true)} variant="ghost" className="h-full border-dashed border-2 rounded-2xl text-xs font-bold text-zinc-400 hover:text-blue-600 hover:border-blue-200">
        + Thêm lựa chọn
      </Button>
    )
  }

  return (
    <div className="border-2 border-dashed border-zinc-200 rounded-2xl p-3 space-y-3">
      <input 
        className="w-full bg-transparent text-sm outline-none border-b border-zinc-100 pb-1"
        placeholder="Nội dung lựa chọn..."
        autoFocus
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={isCorrect} onChange={(e) => setIsCorrect(e.target.checked)} className="rounded" />
          <span className="text-[10px] font-bold uppercase text-zinc-500">Đáp án đúng</span>
        </label>
        <div className="flex gap-1">
          <Button onClick={() => { onAdd(text, isCorrect); setText(""); setIsCorrect(false); setIsExpanded(false); }} size="sm" className="h-6 text-[10px] bg-blue-600">Thêm</Button>
          <Button onClick={() => setIsExpanded(false)} size="sm" variant="ghost" className="h-6 text-[10px]">Hủy</Button>
        </div>
      </div>
    </div>
  )
}
