"use client"

import { useState, useEffect } from "react"
import { useVideoStore } from "@/lib/store/use-video-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bookmark, Clock, Trash2, PlusCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface Note {
  id: string
  content: string
  timestamp: number
  createdAt: string
}

interface NotesSectionProps {
  courseId: string
  lessonId: string
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

export function NotesSection({ courseId, lessonId }: NotesSectionProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newNote, setNewNote] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { currentTime, setSeekTime } = useVideoStore()

  useEffect(() => {
    fetchNotes()
  }, [lessonId])

  const fetchNotes = async () => {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/courses/${courseId}/lessons/${lessonId}/notes`)
      if (res.ok) {
        const data = await res.json()
        setNotes(data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddNote = async () => {
    if (!newNote.trim()) return

    try {
      setIsSubmitting(true)
      const res = await fetch(`/api/courses/${courseId}/lessons/${lessonId}/notes`, {
        method: "POST",
        body: JSON.stringify({
          content: newNote,
          timestamp: currentTime
        }),
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (res.ok) {
        setNewNote("")
        toast.success("Đã lưu ghi chú!")
        fetchNotes()
      } else {
        toast.error("Lỗi khi lưu ghi chú.")
      }
    } catch (error) {
      toast.error("Lỗi khi lưu ghi chú.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (noteId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa ghi chú này?")) return

    try {
      const res = await fetch(`/api/courses/${courseId}/lessons/${lessonId}/notes/${noteId}`, {
        method: "DELETE"
      })
      if (res.ok) {
        toast.success("Đã xóa ghi chú")
        setNotes(notes.filter(n => n.id !== noteId))
      }
    } catch (error) {
      toast.error("Không thể xóa ghi chú")
    }
  }

  return (
    <div className="bg-white border border-zinc-100 p-10 rounded-[3rem] shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 border border-blue-100">
          <Bookmark className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-black text-zinc-900">Ghi chú của tôi</h3>
          <p className="text-sm font-medium text-zinc-500">Ghim lại kiến thức quan trọng theo thời gian video.</p>
        </div>
      </div>

      <div className="flex gap-4 mb-10 bg-zinc-50 p-4 rounded-[2rem] border border-zinc-100">
        <div className="flex-shrink-0 bg-white border border-zinc-200 text-[#FF6600] font-black text-xs px-4 rounded-xl flex items-center justify-center shadow-sm w-[80px]">
          {formatTime(currentTime)}
        </div>
        <Input 
          placeholder="Thêm ghi chú tại thời điểm này..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAddNote()
          }}
          className="h-12 bg-white rounded-xl border-zinc-200 focus-visible:ring-0 focus-visible:border-blue-400 font-medium"
        />
        <Button 
          onClick={handleAddNote} 
          disabled={isSubmitting || !newNote.trim()}
          className="h-12 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest gap-2 shadow-md"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
          Thêm
        </Button>
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-300" />
        </div>
      ) : notes.length === 0 ? (
        <div className="py-16 text-center border-2 border-dashed border-zinc-100 rounded-3xl flex flex-col items-center gap-4">
          <Bookmark className="w-12 h-12 text-zinc-200" />
          <p className="text-zinc-400 font-black uppercase tracking-widest text-[10px]">Chưa có ghi chú nào</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-4">
          {notes.map(note => (
            <div key={note.id} className="group flex items-start gap-4 p-5 bg-[#F8F9FA] hover:bg-white hover:shadow-md border border-transparent hover:border-zinc-200 rounded-2xl transition-all cursor-pointer" onClick={() => setSeekTime(note.timestamp)}>
              <div className="flex-shrink-0 bg-white border border-zinc-200 text-zinc-600 group-hover:text-[#FF6600] font-black text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors">
                <Clock className="w-3 h-3" />
                {formatTime(note.timestamp)}
              </div>
              <div className="flex-1 pt-1">
                <p className="text-sm font-semibold text-zinc-700 group-hover:text-zinc-900 leading-relaxed">{note.content}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete(note.id)
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
