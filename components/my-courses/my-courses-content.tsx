"use client"

import { useState } from "react"
import { CourseCard } from "@/components/ui-custom/course-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, BookOpen, GraduationCap, LayoutGrid, Sparkles } from "lucide-react"
import Link from "next/link"

interface MyCoursesContentProps {
  initialEnrollments: any[]
}

export function MyCoursesContent({ initialEnrollments }: MyCoursesContentProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter based on search query in real time
  const filteredEnrollments = initialEnrollments.filter(e => 
    e.course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (e.course.instructor?.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  )

  const inProgress = filteredEnrollments.filter(e => e.progress > 0 && e.progress < 100)
  const completed = filteredEnrollments.filter(e => e.progress === 100)

  return (
    <div className="relative space-y-10">
      {/* Decorative Premium Glow Backgrounds */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-200/20 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse duration-[8s]" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-orange-100/10 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse duration-[10s]" />

      {/* Header section with sparkles */}
      <div className="flex flex-col gap-2 mb-12">
        <div className="inline-flex items-center gap-2 bg-orange-50 dark:bg-orange-950/30 text-[#FF6600] px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest w-fit shadow-sm border border-orange-100/30">
          <Sparkles className="w-3.5 h-3.5 animate-spin duration-[4s]" />
          Khu vực học tập
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-white leading-tight">
          Khoá học của tôi
        </h1>
        <p className="text-zinc-500 font-medium text-sm md:text-base">
          Tiếp tục hành trình chinh phục kiến thức và nâng tầm kỹ năng của bạn mỗi ngày.
        </p>
      </div>

      <Tabs defaultValue="all" className="space-y-10">
        {/* Navigation & Live Search Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-6 border-b border-zinc-100 dark:border-zinc-800">
          <TabsList className="bg-zinc-100/80 dark:bg-zinc-900/80 backdrop-blur-md p-1.5 h-16 rounded-[1.25rem] border border-zinc-200/50 dark:border-zinc-800/50 inline-flex items-center gap-1 shadow-sm">
            <TabsTrigger 
              value="all" 
              className="h-full px-6 sm:px-8 rounded-xl gap-3 text-xs font-black uppercase tracking-wider transition-all duration-300 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-[#FF6600] data-[state=active]:shadow-sm data-[state=active]:scale-[1.02] hover:text-[#FF6600]"
            >
              <LayoutGrid className="w-4 h-4" />
              Tất cả ({filteredEnrollments.length})
            </TabsTrigger>
            <TabsTrigger 
              value="active" 
              className="h-full px-6 sm:px-8 rounded-xl gap-3 text-xs font-black uppercase tracking-wider transition-all duration-300 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-[#FF6600] data-[state=active]:shadow-sm data-[state=active]:scale-[1.02] hover:text-[#FF6600]"
            >
              <BookOpen className="w-4 h-4" />
              Đang học ({inProgress.length})
            </TabsTrigger>
            <TabsTrigger 
              value="completed" 
              className="h-full px-6 sm:px-8 rounded-xl gap-3 text-xs font-black uppercase tracking-wider transition-all duration-300 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-[#FF6600] data-[state=active]:shadow-sm data-[state=active]:scale-[1.02] hover:text-[#FF6600]"
            >
              <GraduationCap className="w-4 h-4" />
              Đã hoàn thành ({completed.length})
            </TabsTrigger>
          </TabsList>

          {/* Search Box */}
          <div className="relative w-full lg:w-80 group shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-[#FF6600] transition-colors" />
            <Input 
              placeholder="Tìm tên khóa học hoặc giảng viên..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 rounded-2xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm text-sm font-medium focus-visible:ring-[#FF6600]/20 focus-visible:border-[#FF6600] transition-all" 
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                Xóa
              </button>
            )}
          </div>
        </div>

        {/* Live Search Badge */}
        {searchQuery && (
          <div className="text-sm font-bold text-[#FF6600] bg-orange-50/50 dark:bg-orange-950/20 border border-orange-100/30 px-4 py-2 rounded-xl w-fit animate-fade-in">
            🔍 Tìm thấy {filteredEnrollments.length} khóa học khớp với từ khóa của bạn.
          </div>
        )}

        {/* Tab Contents */}
        <TabsContent value="all" className="mt-0 focus-visible:outline-none">
          <CourseGrid enrollments={filteredEnrollments} />
        </TabsContent>
        
        <TabsContent value="active" className="mt-0 focus-visible:outline-none">
          <CourseGrid enrollments={inProgress} />
        </TabsContent>

        <TabsContent value="completed" className="mt-0 focus-visible:outline-none">
          <CourseGrid enrollments={completed} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function CourseGrid({ enrollments }: { enrollments: any[] }) {
  if (enrollments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl bg-zinc-50/20 dark:bg-zinc-900/10 backdrop-blur-[2px] transition-all">
        <div className="w-20 h-20 bg-white dark:bg-zinc-800 rounded-2xl flex items-center justify-center shadow-md mb-6 border border-zinc-100 dark:border-zinc-700">
          <BookOpen className="w-10 h-10 text-zinc-300 dark:text-zinc-600" />
        </div>
        <h3 className="text-xl font-black mb-2 text-zinc-800 dark:text-zinc-100">Không tìm thấy khoá học nào</h3>
        <p className="text-zinc-400 dark:text-zinc-500 max-w-xs mx-auto mb-8 text-sm font-medium leading-relaxed">
          Thử thay đổi từ khóa tìm kiếm hoặc khám phá thêm nhiều khóa học hấp dẫn mới tại Belearning.
        </p>
        <Link 
          href="/courses" 
          className="bg-[#FF6600] hover:bg-orange-600 text-white font-black text-xs uppercase tracking-widest py-4.5 px-10 rounded-2xl transition-all shadow-xl shadow-orange-500/20 inline-block"
        >
          Khám phá ngay
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
      {enrollments.map((enrollment) => {
        const rating = enrollment.course.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / (enrollment.course.reviews.length || 1)
        
        return (
          <div key={enrollment.id} className="transition-all duration-500 hover:-translate-y-1">
            <CourseCard 
              course={enrollment.course}
              rating={rating}
              totalStudents={enrollment.course.enrollments.length}
              isMyCourse={true}
              progress={enrollment.progress}
            />
          </div>
        )
      })}
    </div>
  )
}
