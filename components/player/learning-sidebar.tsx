"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { CheckCircle2, PlayCircle, Lock, ChevronDown, ChevronRight, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Lesson {
  id: string
  title: string
  isCompleted: boolean
  isLocked: boolean
}

interface Section {
  id: string
  title: string
  lessons: Lesson[]
}

interface LearningSidebarProps {
  sections: Section[]
  courseSlug: string
  completedCount: number
  totalCount: number
}

export function LearningSidebar({
  sections,
  courseSlug,
  completedCount,
  totalCount
}: LearningSidebarProps) {
  const params = useParams()
  const activeLessonId = params.lessonId as string
  
  const progressPercentage = Math.round((completedCount / totalCount) * 100) || 0

  return (
    <div className="h-full border-r bg-white dark:bg-zinc-950 flex flex-col w-80 shrink-0 z-30 shadow-xl shadow-zinc-200/50 dark:shadow-none relative">
      <div className="p-8 border-b space-y-6">
        <div className="flex items-center justify-between">
           <h2 className="font-black text-xl tracking-tight">Nội dung</h2>
           <span className="text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full text-zinc-500">{completedCount}/{totalCount} Bài</span>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-zinc-500">
            <span>Tiến độ học tập</span>
            <div className="flex items-center gap-2">
               {progressPercentage === 100 && (
                  <span className="bg-emerald-500 text-white text-[9px] px-1.5 py-0.5 rounded-md animate-bounce">Hoàn thành</span>
               )}
               <span className="text-blue-600">{progressPercentage}%</span>
            </div>
          </div>
          <div className="h-2.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(37,99,235,0.5)]" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <Accordion defaultValue={sections.map(s => s.id)} className="w-full">
          {sections.map((section, idx) => (
            <AccordionItem key={section.id} value={section.id} className="border-b last:border-b-0">
              <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-zinc-50/80 dark:hover:bg-zinc-900/30 transition-all group">
                <div className="flex flex-col items-start gap-1">
                   <span className="text-[10px] text-blue-600 font-black uppercase tracking-widest">Phần {idx + 1}</span>
                   <span className="text-sm font-bold text-left group-hover:text-blue-600 transition-colors line-clamp-1">{section.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-0 bg-zinc-50/30 dark:bg-zinc-900/10">
                <div className="flex flex-col">
                  {section.lessons.map((lesson) => {
                    const isActive = lesson.id === activeLessonId
                    
                    return (
                      <Link
                        key={lesson.id}
                        href={`/learn/${courseSlug}/${lesson.id}`}
                        className={cn(
                          "flex items-center gap-4 px-6 py-4 text-sm transition-all border-l-4 relative",
                          isActive 
                            ? "bg-white dark:bg-zinc-950 border-blue-600 text-blue-600 font-bold shadow-sm z-10" 
                            : "border-transparent hover:bg-white/50 dark:hover:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400",
                          lesson.isLocked && "pointer-events-none opacity-40 grayscale"
                        )}
                      >
                        <div className={cn(
                            "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                            isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                        )}>
                            {lesson.isCompleted ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : lesson.isLocked ? (
                              <Lock className="w-4 h-4" />
                            ) : (
                              <PlayCircle className="w-4 h-4" />
                            )}
                        </div>
                        <span className="line-clamp-2 leading-tight">{lesson.title}</span>
                        {isActive && (
                           <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                        )}
                      </Link>
                    )
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>
      
      <div className="p-6 bg-zinc-50 dark:bg-zinc-900/50 border-t mt-auto">
         <Link href={`/courses/${courseSlug}`} className="flex items-center justify-center gap-2 text-xs font-bold text-zinc-500 hover:text-blue-600 transition-colors py-2 group">
            <BookOpen className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            Quay lại tổng quan
         </Link>
      </div>
    </div>
  )
}
