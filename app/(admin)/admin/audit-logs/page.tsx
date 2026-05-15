import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { ShieldAlert, Activity, User, FileText } from "lucide-react"

export default async function AuditLogsPage() {
  const session = await auth()
  
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return redirect("/")
  }

  const logs = await prisma.auditLog.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
    take: 100 // Limit for performance
  })

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-black flex items-center gap-2">
          <Activity className="w-6 h-6 text-indigo-600" />
          Nhật ký hệ thống (Audit Logs)
        </h1>
        <p className="text-zinc-500">Giám sát các hoạt động quan trọng trên hệ thống.</p>
      </div>

      <div className="bg-white dark:bg-zinc-950 border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-900 border-b">
              <tr>
                <th className="p-4 font-medium text-zinc-500">Thời gian</th>
                <th className="p-4 font-medium text-zinc-500">Hành động</th>
                <th className="p-4 font-medium text-zinc-500">Mục tiêu (Entity)</th>
                <th className="p-4 font-medium text-zinc-500">Người thực hiện</th>
                <th className="p-4 font-medium text-zinc-500">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                  <td className="p-4 whitespace-nowrap text-xs text-zinc-500">
                    {new Date(log.createdAt).toLocaleString("vi-VN")}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase
                      ${log.action.includes("CREATE") ? "bg-emerald-100 text-emerald-700" :
                        log.action.includes("UPDATE") ? "bg-blue-100 text-blue-700" :
                        log.action.includes("DELETE") ? "bg-red-100 text-red-700" :
                        "bg-zinc-100 text-zinc-700"}
                    `}>
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 font-medium">
                    {log.entityType} <span className="text-xs text-zinc-400 font-normal block">{log.entityId}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                        {log.user?.name?.[0] || <User className="w-3 h-3" />}
                      </div>
                      <span className="font-medium">{log.user?.name || "System"}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <pre className="text-[10px] bg-zinc-100 dark:bg-zinc-900 p-2 rounded-lg max-w-[250px] overflow-x-auto">
                      {log.details ? JSON.stringify(log.details, null, 2) : "-"}
                    </pre>
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-zinc-500">
                    <ShieldAlert className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    Chưa có nhật ký hoạt động nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
