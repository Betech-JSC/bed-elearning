import { LoginForm } from "@/components/auth/login-form"

export default function InstructorLoginPage() {
  return (
    <div className="min-h-screen bg-blue-50/30 dark:bg-zinc-950 flex flex-col items-center justify-center p-4">
      <LoginForm 
        role="INSTRUCTOR"
        title="Instructor Portal"
        description="Chào mừng Giảng viên. Đăng nhập để bắt đầu xây dựng và quản lý các khóa học của bạn."
        callbackUrl="/instructor/dashboard"
        showGoogle={true}
      />
    </div>
  )
}
