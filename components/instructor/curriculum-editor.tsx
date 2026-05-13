"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Plus, 
  GripVertical, 
  Pencil, 
  Trash2, 
  Video, 
  FileText, 
  ChevronDown, 
  Loader2,
  Settings2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import Link from "next/link"


interface CurriculumEditorProps {
  courseId: string
  initialSections: any[]
}

export function CurriculumEditor({ courseId, initialSections }: CurriculumEditorProps) {
  const router = useRouter()
  const [sections, setSections] = useState(initialSections)
  const [isLoading, setIsLoading] = useState(false)
  const [newSectionTitle, setNewSectionTitle] = useState("")

  const onAddSection = async () => {
    if (!newSectionTitle) return
    try {
      setIsLoading(true)
      const res = await fetch(`/api/instructor/courses/${courseId}/sections`, {
        method: "POST",
        body: JSON.stringify({ title: newSectionTitle })
      })
      if (!res.ok) throw new Error("Thêm chương thất bại")
      
      const data = await res.json()
      setSections([...sections, { ...data, lessons: [] }])
      setNewSectionTitle("")
      toast.success("Đã thêm chương mới!")
      router.refresh()
    } catch (error) {
      toast.error("Đã có lỗi xảy ra.")
    } finally {
      setIsLoading(false)
    }
  }

  const onAddLesson = async (sectionId: string) => {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/instructor/courses/${courseId}/sections/${sectionId}/lessons`, {
        method: "POST",
        body: JSON.stringify({ title: "Bài học mới" })
      })
      if (!res.ok) throw new Error("Thêm bài học thất bại")
      
      const data = await res.json()
      const newSections = sections.map(s => {
        if (s.id === sectionId) {
          return { ...s, lessons: [...s.lessons, data] }
        }
        return s
      })
      setSections(newSections)
      toast.success("Đã thêm bài học mới!")
      router.refresh()
    } catch (error) {
      toast.error("Đã có lỗi xảy ra.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <Accordion className="space-y-4">
          {sections.map((section) => (
            <AccordionItem key={section.id} value={section.id} className="border rounded-xl overflow-hidden bg-white dark:bg-zinc-950 px-0">
              <div className="flex items-center gap-2 px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border-b">
                <GripVertical className="w-4 h-4 text-zinc-400 cursor-grab" />
                <AccordionTrigger className="flex-1 py-2 hover:no-underline font-bold text-sm">
                  {section.title}
                </AccordionTrigger>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              <AccordionContent className="pt-4 pb-2 px-4 space-y-3">
                <div className="space-y-2">
                  {section.lessons.map((lesson: any) => (
                    <div key={lesson.id} className="flex items-center gap-3 p-3 border rounded-lg bg-white dark:bg-zinc-900 hover:border-blue-600/50 transition-colors group">
                      <GripVertical className="w-3.5 h-3.5 text-zinc-400 cursor-grab" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{lesson.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {lesson.videoUrl ? (
                            <Badge variant="outline" className="text-[9px] gap-1 h-4 bg-green-50 text-green-700">
                              <Video className="w-2 h-2" />
                              Video
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[9px] gap-1 h-4 bg-red-50 text-red-700">
                              <Video className="w-2 h-2" />
                              Chưa có video
                            </Badge>
                          )}
                          {lesson.isFreePreview && (
                            <Badge variant="outline" className="text-[9px] h-4 bg-blue-50 text-blue-700">Free</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/instructor/courses/${courseId}/lessons/${lesson.id}`}>
                           <Button variant="ghost" size="icon" className="h-8 w-8">
                             <Settings2 className="w-3.5 h-3.5" />
                           </Button>
                        </Link>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-2 border-dashed gap-2 h-10 font-bold"
                  onClick={() => onAddLesson(section.id)}
                  disabled={isLoading}
                >
                  <Plus className="w-4 h-4" />
                  Thêm bài học
                </Button>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="flex items-center gap-2 mt-4 bg-white dark:bg-zinc-900 p-2 border rounded-xl shadow-sm">
          <Input 
            placeholder="Tiêu đề chương mới..." 
            className="flex-1 h-11 border-none focus-visible:ring-0" 
            value={newSectionTitle}
            onChange={(e) => setNewSectionTitle(e.target.value)}
            disabled={isLoading}
          />
          <Button 
            className="bg-zinc-900 dark:bg-white dark:text-zinc-900 h-11 px-6 font-bold gap-2"
            onClick={onAddSection}
            disabled={isLoading || !newSectionTitle}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Thêm chương
          </Button>
        </div>
      </div>
    </div>
  )
}
