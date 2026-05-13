"use client"

import { useState } from "react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Search, Shield, Ban, CheckCircle, UserCircle, ExternalLink } from "lucide-react"
import { format } from "date-fns"
import { updateUserStatus, updateUserRole } from "@/lib/actions/admin"
import { toast } from "sonner"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface UserTableProps {
  users: any[]
}

export const UserTable = ({ users }: UserTableProps) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("ALL")
  const [statusFilter, setStatusFilter] = useState("ALL")

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = roleFilter === "ALL" || user.role === roleFilter
    const matchesStatus = statusFilter === "ALL" || user.status === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  const onStatusChange = async (userId: string, status: string) => {
    try {
      await updateUserStatus(userId, status as any)
      toast.success("Cập nhật trạng thái thành công")
    } catch (error) {
      toast.error("Có lỗi xảy ra")
    }
  }

  const onRoleChange = async (userId: string, role: string) => {
    try {
      await updateUserRole(userId, role as any)
      toast.success("Cập nhật vai trò thành công")
    } catch (error) {
      toast.error("Có lỗi xảy ra")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-zinc-900 p-4 rounded-2xl border shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input 
            placeholder="Tìm theo tên hoặc email..." 
            className="pl-10 rounded-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <Select value={roleFilter} onValueChange={(val) => setRoleFilter(val ?? "ALL")}>
            <SelectTrigger className="w-full md:w-[150px] rounded-xl">
              <SelectValue placeholder="Vai trò" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả vai trò</SelectItem>
              <SelectItem value="STUDENT">Học viên</SelectItem>
              <SelectItem value="INSTRUCTOR">Giảng viên</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val ?? "ALL")}>
            <SelectTrigger className="w-full md:w-[150px] rounded-xl">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
              <SelectItem value="ACTIVE">Hoạt động</SelectItem>
              <SelectItem value="BANNED">Đã chặn</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border rounded-2xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-50/50 dark:bg-zinc-800/50">
              <TableHead className="w-[250px]">Người dùng</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tham gia</TableHead>
              <TableHead>Khóa học</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-zinc-500 italic">
                  Không tìm thấy người dùng nào.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border">
                        <AvatarImage src={user.image || ""} />
                        <AvatarFallback className="font-bold bg-zinc-100">{user.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm line-clamp-1">{user.name}</span>
                        <span className="text-xs text-zinc-500 line-clamp-1">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "font-bold uppercase text-[10px] px-2 py-0.5",
                        user.role === "ADMIN" ? "bg-red-50 text-red-600 border-red-200" :
                        user.role === "INSTRUCTOR" ? "bg-blue-50 text-blue-600 border-blue-200" :
                        "bg-zinc-50 text-zinc-600 border-zinc-200"
                      )}
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        user.status === "ACTIVE" ? "bg-green-500" : "bg-red-500"
                      )} />
                      <span className="text-sm font-medium">
                        {user.status === "ACTIVE" ? "Hoạt động" : "Đã chặn"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-500 text-sm">
                    {format(new Date(user.createdAt), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-sm">{user._count.enrollments}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>} />
                      <DropdownMenuContent align="end" className="w-48 rounded-xl p-2">
                        <DropdownMenuLabel className="text-xs text-zinc-500">Hành động</DropdownMenuLabel>
                        <DropdownMenuItem className="rounded-lg cursor-pointer p-0">
                          <Link href={`/admin/users/${user.id}`} className="flex items-center w-full px-2 py-1.5">
                            <UserCircle className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel className="text-xs text-zinc-500">Thay đổi vai trò</DropdownMenuLabel>
                        <DropdownMenuItem 
                          className="rounded-lg cursor-pointer"
                          disabled={user.role === "STUDENT"}
                          onClick={() => onRoleChange(user.id, "STUDENT")}
                        >
                          Chuyển sang Học viên
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="rounded-lg cursor-pointer"
                          disabled={user.role === "INSTRUCTOR"}
                          onClick={() => onRoleChange(user.id, "INSTRUCTOR")}
                        >
                          Chuyển sang Giảng viên
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="rounded-lg cursor-pointer"
                          disabled={user.role === "ADMIN"}
                          onClick={() => onRoleChange(user.id, "ADMIN")}
                        >
                          Chuyển sang Admin
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user.status === "ACTIVE" ? (
                          <DropdownMenuItem 
                            className="rounded-lg text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                            onClick={() => onStatusChange(user.id, "BANNED")}
                          >
                            <Ban className="mr-2 h-4 w-4" />
                            Chặn người dùng
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem 
                            className="rounded-lg text-green-600 focus:text-green-600 focus:bg-green-50 cursor-pointer"
                            onClick={() => onStatusChange(user.id, "ACTIVE")}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Bỏ chặn
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
