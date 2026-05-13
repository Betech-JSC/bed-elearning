"use client"

import { useState } from "react"
import { Play, Lock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { PreviewModal } from "./preview-modal"
import { cn } from "@/lib/utils"

interface Lesson {
  id: string
  title: string
  isFreePreview: boolean
  videoUrl: string | null
}

interface Section {
  id: string
  title: string
  lessons: Lesson[]
}

interface CourseCurriculumProps {
  sections: Section[]
}

export const CourseCurriculum = ({ sections }: CourseCurriculumProps) => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)

  return (
    <>
      <div className="space-y-4">
        {sections.map((section, idx) => (
          <div key={section.id} className="border rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-zinc-950">
            <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 font-bold flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-blue-600">Phần {idx + 1}:</span>
                {section.title}
              </div>
              <span className="text-xs text-zinc-500 font-normal">{section.lessons.length} bài giảng</span>
            </div>
            <div className="divide-y">
              {section.lessons.map((lesson) => (
                <div 
                  key={lesson.id} 
                  onClick={() => lesson.isFreePreview && lesson.videoUrl && setSelectedLesson(lesson)}
                  className={cn(
                    "p-4 flex items-center justify-between transition-colors",
                    lesson.isFreePreview ? "hover:bg-blue-50/50 cursor-pointer group" : "opacity-70"
                  )}
                >
                  <div className="flex items-center gap-3 text-sm">
                    <Play className={cn("w-3.5 h-3.5", lesson.isFreePreview ? "text-blue-600" : "text-zinc-400")} />
                    <span className={cn(lesson.isFreePreview && "group-hover:text-blue-600 font-medium")}>
                      {lesson.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    {lesson.isFreePreview ? (
                      <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-200 bg-emerald-50">Xem thử</Badge>
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-zinc-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedLesson && (
        <PreviewModal 
          isOpen={!!selectedLesson}
          onClose={() => setSelectedLesson(null)}
          videoUrl={selectedLesson.videoUrl || ""}
          lessonTitle={selectedLesson.title}
        />
      )}
    </>
  )
}
