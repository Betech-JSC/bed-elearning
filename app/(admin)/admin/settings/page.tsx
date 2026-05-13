import prisma from "@/lib/prisma"
import { SettingsForm } from "@/components/admin/settings/settings-form"

export default async function AdminSettingsPage() {
  const settings = await prisma.globalSettings.findUnique({
    where: { id: "global" }
  })

  const publishedCourses = await prisma.course.findMany({
    where: { status: "PUBLISHED" },
    select: { id: true, title: true }
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black mb-2 tracking-tight">Cấu hình hệ thống</h1>
        <p className="text-zinc-500">Thiết lập các thông số vận hành và nội dung hiển thị của nền tảng.</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border rounded-2xl p-8 shadow-sm max-w-3xl">
        <SettingsForm 
            initialData={settings || { 
                platformFee: 30, 
                maintenanceMode: false, 
                bannerImage: "", 
                bannerLink: "", 
                featuredCourseIds: [] 
            }} 
            courses={publishedCourses}
        />
      </div>
    </div>
  )
}
