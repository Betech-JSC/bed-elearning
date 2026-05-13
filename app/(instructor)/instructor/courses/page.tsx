import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { 
  Plus, 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  ExternalLink,
  Users,
  DollarSign
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

export default async function InstructorCoursesPage() {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) return redirect("/")

  const courses = await prisma.course.findMany({
    where: { instructorId: userId },
    include: {
      _count: {
        select: { enrollments: true }
      },
      orderItems: {
        where: { order: { status: "PAID" } }
      }
    },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black mb-2">Khóa học của bạn</h1>
          <p className="text-zinc-500">Quản lý và cập nhật nội dung các khóa học đang giảng dạy.</p>
        </div>
        
        <Link 
          href="/instructor/courses/create" 
          className={cn(buttonVariants(), "bg-blue-600 hover:bg-blue-700 h-12 px-6 gap-2 font-bold shadow-lg shadow-blue-600/20")}
        >
          <Plus className="w-5 h-5" />
          Tạo khóa học mới
        </Link>
      </div>

      <div className="bg-white dark:bg-zinc-950 border rounded-2xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-50 dark:bg-zinc-900/50 h-14">
              <TableHead className="w-[400px] font-bold">Khóa học</TableHead>
              <TableHead className="font-bold">Trạng thái</TableHead>
              <TableHead className="font-bold text-center">Học viên</TableHead>
              <TableHead className="font-bold">Doanh thu (70%)</TableHead>
              <TableHead className="text-right font-bold pr-8">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.length > 0 ? courses.map((course) => {
              const revenue = course.orderItems.reduce((acc, item) => acc + item.price, 0) * 0.7
              
              return (
                <TableRow key={course.id} className="h-20">
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <div className="relative aspect-video w-24 rounded-lg overflow-hidden border">
                        <Image 
                          src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&q=80"} 
                          alt={course.title} 
                          fill 
                          className="object-cover" 
                        />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-zinc-900 dark:text-white line-clamp-1">{course.title}</span>
                        <span className="text-[10px] text-zinc-400 font-mono uppercase">#{course.id.slice(-8)}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "font-bold px-3 py-1",
                        course.status === "PUBLISHED" && "bg-green-50 text-green-700 border-green-200",
                        course.status === "DRAFT" && "bg-zinc-100 text-zinc-700 border-zinc-200",
                        course.status === "PENDING_REVIEW" && "bg-yellow-50 text-yellow-700 border-yellow-200"
                      )}
                    >
                      {course.status === "PUBLISHED" ? "Công khai" : course.status === "DRAFT" ? "Bản nháp" : "Chờ duyệt"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1.5 font-medium">
                      <Users className="w-3.5 h-3.5 text-zinc-400" />
                      {course._count.enrollments}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 font-bold text-blue-600">
                      <DollarSign className="w-3.5 h-3.5" />
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(revenue)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <div className="flex justify-end gap-2">
                      <Link href={`/instructor/courses/${course.id}/edit`}>
                        <Button variant="ghost" size="icon" className="hover:text-blue-600 hover:bg-blue-50">
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href={`/courses/${course.slug}`} target="_blank">
                        <Button variant="ghost" size="icon" className="hover:text-purple-600 hover:bg-purple-50">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" className="hover:text-red-600 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            }) : (
              <TableRow>
                <TableCell colSpan={5} className="h-40 text-center text-zinc-500 italic">
                  Bạn chưa tạo khóa học nào. Hãy bắt đầu tạo ngay khóa học đầu tiên!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
