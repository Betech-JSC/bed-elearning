import { Resend } from "resend"

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const domain = process.env.NEXT_PUBLIC_APP_URL

export const sendCourseApprovalEmail = async (email: string, courseTitle: string) => {
  if (!resend) return
  await resend.emails.send({
    from: "Vibecode Academy <noreply@vibecode.academy>",
    to: email,
    subject: "Chúc mừng! Khóa học của bạn đã được phê duyệt",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 20px;">
        <h1 style="color: #2563eb;">Tuyệt vời!</h1>
        <p>Chào bạn,</p>
        <p>Khóa học <strong>${courseTitle}</strong> của bạn đã được quản trị viên phê duyệt và hiện đã công khai trên hệ thống.</p>
        <p>Bây giờ bạn có thể bắt đầu quảng bá khóa học và chào đón những học viên đầu tiên.</p>
        <div style="margin-top: 30px;">
          <a href="${domain}/instructor/courses" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 12px; font-weight: bold;">Quản lý khóa học</a>
        </div>
      </div>
    `
  })
}

export const sendCourseRejectionEmail = async (email: string, courseTitle: string, reason: string) => {
  if (!resend) return
  await resend.emails.send({
    from: "Vibecode Academy <noreply@vibecode.academy>",
    to: email,
    subject: "Thông báo về việc phê duyệt khóa học",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 20px;">
        <h1 style="color: #dc2626;">Thông báo</h1>
        <p>Chào bạn,</p>
        <p>Khóa học <strong>${courseTitle}</strong> của bạn tạm thời chưa được phê duyệt với lý do:</p>
        <blockquote style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0;">
          ${reason}
        </blockquote>
        <p>Vui lòng cập nhật lại nội dung theo góp ý trên và gửi lại để chúng tôi xét duyệt nhé.</p>
        <div style="margin-top: 30px;">
          <a href="${domain}/instructor/courses" style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 12px; font-weight: bold;">Cập nhật khóa học</a>
        </div>
      </div>
    `
  })
}

export const sendOrderSuccessEmail = async (email: string, orderId: string, total: number) => {
  if (!resend) return
  await resend.emails.send({
    from: "Vibecode Academy <noreply@vibecode.academy>",
    to: email,
    subject: "Xác nhận đơn hàng thành công",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 20px;">
        <h1 style="color: #2563eb;">Cảm ơn bạn!</h1>
        <p>Đơn hàng <strong>#${orderId.slice(-8)}</strong> của bạn đã được thanh toán thành công.</p>
        <p>Tổng thanh toán: <strong>${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}</strong></p>
        <p>Bây giờ bạn có thể truy cập vào khóa học và bắt đầu học ngay lập tức.</p>
        <div style="margin-top: 30px;">
          <a href="${domain}/my-courses" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 12px; font-weight: bold;">Bắt đầu học ngay</a>
        </div>
      </div>
    `
  })
}

export const sendWelcomeEmail = async (email: string, name: string) => {
  if (!resend) return
  await resend.emails.send({
    from: "Vibecode Academy <noreply@vibecode.academy>",
    to: email,
    subject: "Chào mừng bạn đến với Vibecode Academy!",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 20px;">
        <h1 style="color: #2563eb;">Chào mừng ${name}!</h1>
        <p>Cảm ơn bạn đã đăng ký tài khoản tại Vibecode Academy.</p>
        <p>Chúng tôi rất vui mừng được đồng hành cùng bạn trên con đường học tập và phát triển kỹ năng lập trình.</p>
        <p>Hãy khám phá ngay các khóa học chất lượng trên nền tảng của chúng tôi.</p>
        <div style="margin-top: 30px;">
          <a href="${domain}/courses" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 12px; font-weight: bold;">Khám phá khóa học</a>
        </div>
      </div>
    `
  })
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
  if (!resend) return
  const resetUrl = `${domain}/reset-password?token=${token}`
  await resend.emails.send({
    from: "Vibecode Academy <noreply@vibecode.academy>",
    to: email,
    subject: "Khôi phục mật khẩu - Vibecode Academy",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 20px;">
        <h1 style="color: #2563eb;">Khôi phục mật khẩu</h1>
        <p>Chào bạn,</p>
        <p>Chúng tôi nhận được yêu cầu khôi phục mật khẩu cho tài khoản của bạn. Nhấn vào nút bên dưới để đặt lại mật khẩu:</p>
        <div style="margin-top: 30px; margin-bottom: 30px;">
          <a href="${resetUrl}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 12px; font-weight: bold;">Đặt lại mật khẩu</a>
        </div>
        <p style="color: #6b7280; font-size: 14px;">Link này sẽ hết hạn sau 1 giờ. Nếu bạn không yêu cầu đổi mật khẩu, vui lòng bỏ qua email này.</p>
      </div>
    `
  })
}
