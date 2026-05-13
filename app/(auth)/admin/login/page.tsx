import { LoginForm } from "@/components/auth/login-form"

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4">
      <LoginForm 
        role="ADMIN"
        title="Admin Portal"
        description="Chào mừng Quản trị viên quay trở lại. Hãy đăng nhập để quản lý hệ thống Vibecode."
        callbackUrl="/admin/dashboard"
        showGoogle={false} // Bảo mật hơn, chỉ dùng credentials
      />
    </div>
  )
}
