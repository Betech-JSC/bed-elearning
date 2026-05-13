"use client"

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { 
  Eye, 
  CheckCircle, 
  XCircle, 
  Star, 
  MoreHorizontal 
} from "lucide-react"
import { toggleCourseFeatured, toggleCourseHidden } from "@/lib/actions/admin"
import { toast } from "sonner"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface AdminCourseListProps {
  courses: any[]
}

export const AdminCourseList = ({ courses }: AdminCourseListProps) => {
  
  const onToggleFeatured = async (id: string, current: boolean) => {
    try {
      await toggleCourseFeatured(id, !current)
      toast.success("Cập nhật thành công")
    } catch {
      toast.error("Có lỗi xảy ra")
    }
  }

  const onToggleHidden = async (id: string, current: boolean) => {
    try {
      await toggleCourseHidden(id, !current)
      toast.success("Cập nhật thành công")
    } catch {
      toast.error("Có lỗi xảy ra")
    }
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border rounded-2xl overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-zinc-50/50 dark:bg-zinc-800/50">
            <TableHead>Khóa học</TableHead>
            <TableHead>Giảng viên</TableHead>
            <TableHead>Danh mục</TableHead>
            <TableHead>Giá</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead>Ẩn</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10 text-zinc-500 italic">
                Trống.
              </TableCell>
            </TableRow>
          ) : (
            courses.map((course) => (
              <TableRow key={course.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm line-clamp-1">{course.title}</span>
                    <span className="text-xs text-zinc-500">{course._count.sections} chương • {course._count.enrollments} học viên</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  {course.instructor.name}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="font-medium">
                    {course.category?.name || "N/A"}
                  </Badge>
                </TableCell>
                <TableCell className="font-bold text-sm">
                  {course.price === 0 ? "Miễn phí" : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)}
                </TableCell>
                <TableCell>
                   <Switch 
                      checked={course.isFeatured} 
                      onCheckedChange={() => onToggleFeatured(course.id, course.isFeatured)}
                      disabled={course.status !== "PUBLISHED"}
                   />
                </TableCell>
                <TableCell>
                   <Switch 
                      checked={course.isHidden} 
                      onCheckedChange={() => onToggleHidden(course.id, course.isHidden)}
                   />
                </TableCell>
                <TableCell>
                   <Badge 
                      className={cn(
                        "font-bold uppercase text-[10px]",
                        course.status === "PUBLISHED" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                        course.status === "PENDING_REVIEW" ? "bg-blue-50 text-blue-600 border-blue-200" :
                        course.status === "REJECTED" ? "bg-red-50 text-red-600 border-red-200" :
                        "bg-zinc-50 text-zinc-600 border-zinc-200"
                      )}
                      variant="outline"
                   >
                      {course.status}
                   </Badge>
                </TableCell>
                <TableCell className="text-right">
                   <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" asChild className="rounded-xl h-8 px-3 gap-2">
                         <Link href={`/admin/courses/${course.id}`}>
                            <Eye className="w-3.5 h-3.5" />
                            Xem & Duyệt
                         </Link>
                      </Button>
                   </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
