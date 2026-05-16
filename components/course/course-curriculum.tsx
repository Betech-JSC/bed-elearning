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
      <div className="space-y-6">
        {sections.map((section, idx) => (
          <div key={section.id} className="border border-zinc-100 rounded-[2rem] overflow-hidden shadow-sm bg-white">
            <div className="bg-[#F8F9FA] p-6 font-black flex items-center justify-between border-b border-zinc-100">
              <div className="flex items-center gap-4 text-zinc-900">
                <span className="text-[#FF6600] text-xs uppercase tracking-widest">Phần {idx + 1}</span>
                <span className="text-lg tracking-tight">{section.title}</span>
              </div>
              <div className="px-4 py-1.5 bg-white rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-400 border border-zinc-100">
                {section.lessons.length} bài giảng
              </div>
            </div>
            <div className="divide-y divide-zinc-50">
              {section.lessons.map((lesson) => (
                <div 
                  key={lesson.id} 
                  onClick={() => lesson.isFreePreview && lesson.videoUrl && setSelectedLesson(lesson)}
                  className={cn(
                    "p-6 flex items-center justify-between transition-all duration-300",
                    lesson.isFreePreview ? "hover:bg-orange-50/50 cursor-pointer group" : "bg-zinc-50/30"
                  )}
                >
                  <div className="flex items-center gap-4 text-sm font-medium">
                    <div className={cn(
                        "w-8 h-8 rounded-xl flex items-center justify-center transition-colors",
                        lesson.isFreePreview ? "bg-orange-50 text-[#FF6600] group-hover:bg-[#FF6600] group-hover:text-white" : "bg-zinc-100 text-zinc-400"
                    )}>
                        <Play className="w-3.5 h-3.5 fill-current" />
                    </div>
                    <span className={cn(
                        "transition-colors",
                        lesson.isFreePreview ? "text-zinc-700 group-hover:text-zinc-900 font-bold" : "text-zinc-400"
                    )}>
                      {lesson.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    {lesson.isFreePreview ? (
                      <Badge className="text-[10px] font-black uppercase tracking-widest text-[#FF6600] bg-white border border-orange-100 rounded-lg px-3 py-1 shadow-sm">Xem thử</Badge>
                    ) : (
                      <div className="w-8 h-8 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-300">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
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
