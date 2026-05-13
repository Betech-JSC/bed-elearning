"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle, FileQuestion, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { QuizQuestionsEditor } from "./quiz-questions-editor"

interface QuizEditorProps {
  courseId: string
  initialQuizzes: any[]
}

export const QuizEditor = ({ courseId, initialQuizzes }: QuizEditorProps) => {
  const [quizzes, setQuizzes] = useState(initialQuizzes)
  const [isCreating, setIsCreating] = useState(false)
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const router = useRouter()

  const onAddQuiz = async () => {
    if (!title.trim()) return

    try {
      const res = await fetch(`/api/courses/${courseId}/quizzes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, passingScore: 80 })
      })

      if (!res.ok) throw new Error("Lỗi mạng")

      const newQuiz = await res.json()
      setQuizzes([...quizzes, newQuiz])
      setIsCreating(false)
      setTitle("")
      toast.success("Đã tạo bài kiểm tra")
      router.refresh()
    } catch {
      toast.error("Đã có lỗi xảy ra")
    }
  }

  const onDeleteQuiz = async (quizId: string) => {
    try {
      const res = await fetch(`/api/courses/${courseId}/quizzes/${quizId}`, {
        method: "DELETE"
      })

      if (!res.ok) throw new Error("Lỗi mạng")

      setQuizzes(quizzes.filter(q => q.id !== quizId))
      toast.success("Đã xóa bài kiểm tra")
      router.refresh()
    } catch {
      toast.error("Đã có lỗi xảy ra")
    }
  }

  if (editingQuizId) {
    const quiz = quizzes.find(q => q.id === editingQuizId)
    return (
      <QuizQuestionsEditor 
        quiz={quiz} 
        onBack={() => setEditingQuizId(null)} 
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold">Danh sách Bài kiểm tra</h3>
        <Button onClick={() => setIsCreating(true)} size="sm" variant="outline" className="rounded-xl gap-2 font-bold border-blue-200 text-blue-600 hover:bg-blue-50">
          <PlusCircle className="w-4 h-4" />
          Tạo bài kiểm tra
        </Button>
      </div>

      {isCreating && (
        <div className="border rounded-2xl p-4 bg-zinc-50 dark:bg-zinc-900 flex items-center gap-4">
          <input 
            className="flex-1 bg-white dark:bg-zinc-950 border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tên bài kiểm tra (VD: Bài test cuối khóa)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Button onClick={onAddQuiz} size="sm" className="rounded-xl bg-blue-600 hover:bg-blue-700">Lưu</Button>
          <Button onClick={() => setIsCreating(false)} size="sm" variant="ghost" className="rounded-xl">Hủy</Button>
        </div>
      )}

      {quizzes.length === 0 && !isCreating ? (
        <div className="text-center py-8 text-zinc-500 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed">
          <FileQuestion className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p className="font-medium text-sm">Chưa có bài kiểm tra nào</p>
        </div>
      ) : (
        <div className="space-y-4">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="border rounded-2xl p-4 flex items-center justify-between bg-white dark:bg-zinc-950">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 flex items-center justify-center">
                  <FileQuestion className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold">{quiz.title}</h4>
                  <p className="text-xs text-zinc-500">{quiz.questions?.length || 0} câu hỏi • Điểm đạt: {quiz.passingScore}%</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  onClick={() => setEditingQuizId(quiz.id)}
                  variant="outline" 
                  size="sm" 
                  className="rounded-xl gap-2 border-zinc-200"
                >
                  <Pencil className="w-3.5 h-3.5" /> Chỉnh sửa
                </Button>
                <Button onClick={() => onDeleteQuiz(quiz.id)} variant="ghost" size="icon" className="rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

