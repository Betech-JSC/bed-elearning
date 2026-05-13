import prisma from "@/lib/prisma"
import { UserTable } from "@/components/admin/users/user-table"

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { enrollments: true }
      }
    }
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black mb-2 tracking-tight">Quản lý người dùng</h1>
        <p className="text-zinc-500">Quản lý tài khoản, phân quyền và trạng thái người dùng trên hệ thống.</p>
      </div>

      <UserTable users={users} />
    </div>
  )
}
