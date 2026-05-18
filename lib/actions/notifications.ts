"use server"

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

export async function markAllNotificationsAsRead() {
  try {
    const session = await auth()
    const userId = session?.user?.id
    if (!userId) {
      return { success: false, error: "Unauthorized" }
    }

    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true }
    })

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error: any) {
    console.error("Error marking all notifications as read:", error)
    return { success: false, error: error.message || "Failed to update notifications" }
  }
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    const session = await auth()
    const userId = session?.user?.id
    if (!userId) {
      return { success: false, error: "Unauthorized" }
    }

    await prisma.notification.update({
      where: { id: notificationId, userId },
      data: { isRead: true }
    })

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error: any) {
    console.error("Error marking notification as read:", error)
    return { success: false, error: error.message || "Failed to update notification" }
  }
}

export async function clearAllNotifications() {
  try {
    const session = await auth()
    const userId = session?.user?.id
    if (!userId) {
      return { success: false, error: "Unauthorized" }
    }

    await prisma.notification.deleteMany({
      where: { userId }
    })

    // Set a cookie so we know they explicitly cleared their notifications
    const cookieStore = await cookies()
    cookieStore.set("belearning_notifications_cleared", "true", { maxAge: 60 * 60 * 24 * 365 }) // 1 year

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error: any) {
    console.error("Error clearing notifications:", error)
    return { success: false, error: error.message || "Failed to delete notifications" }
  }
}

/* ==========================================================================
   ADVANCED PREMIUM NOTIFICATION ENGINE TRIGER FUNCTIONS
   ========================================================================== */

/**
 * 1. Automatically notify all student users when a new course is published.
 */
export async function notifyNewCourse(courseId: string) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { instructor: true }
    })
    if (!course || course.status !== "PUBLISHED") {
      return { success: false, error: "Course not found or not published" }
    }

    const students = await prisma.user.findMany({
      where: { role: "STUDENT", status: "ACTIVE" },
      select: { id: true }
    })

    if (students.length > 0) {
      await prisma.notification.createMany({
        data: students.map(student => ({
          userId: student.id,
          title: "Khóa học mới xuất hiện! 🚀",
          message: `Khóa học "${course.title}" vừa được giảng viên ${course.instructor.name || "chuyên gia"} phát hành. Khám phá ngay!`,
          link: `/courses/${course.slug}`,
          isRead: false
        }))
      })
    }
    return { success: true }
  } catch (error: any) {
    console.error("Error creating new course notification:", error)
    return { success: false, error: error.message }
  }
}

/**
 * 2. Notify all students enrolled in a course when the instructor adds a new lesson.
 */
export async function notifyNewLesson(courseId: string, lessonTitle: string) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { instructor: true }
    })
    if (!course) {
      return { success: false, error: "Course not found" }
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { courseId },
      select: { userId: true }
    })

    if (enrollments.length > 0) {
      await prisma.notification.createMany({
        data: enrollments.map(enrol => ({
          userId: enrol.userId,
          title: `Bài học mới trong ${course.title} 📚`,
          message: `Giảng viên ${course.instructor.name || "của bạn"} vừa đăng tải bài học mới: "${lessonTitle}". Vào học ngay!`,
          link: `/learn/${course.slug}`,
          isRead: false
        }))
      })
    }
    return { success: true }
  } catch (error: any) {
    console.error("Error creating new lesson notification:", error)
    return { success: false, error: error.message }
  }
}

/**
 * 3. Celebrate with the student when they finish a course and reward them with a certificate notification.
 */
export async function notifyCourseCompleted(userId: string, courseId: string) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    })
    if (!course) {
      return { success: false, error: "Course not found" }
    }

    await prisma.notification.create({
      data: {
        userId,
        title: "Chúc mừng bạn đã hoàn thành khóa học! 🏆🎓",
        message: `Bạn đã xuất sắc chinh phục 100% bài giảng của khóa học "${course.title}". Chứng chỉ vinh danh đã sẵn sàng dành cho bạn!`,
        link: `/my-courses`,
        isRead: false
      }
    })
    return { success: true }
  } catch (error: any) {
    console.error("Error creating course completion notification:", error)
    return { success: false, error: error.message }
  }
}

/**
 * 4. Notify a student when someone replies to their question in a Q&A discussion.
 */
export async function notifyQnaReply(userId: string, lessonId: string, replierName: string) {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { section: { include: { course: true } } }
    })
    if (!lesson) {
      return { success: false, error: "Lesson not found" }
    }

    await prisma.notification.create({
      data: {
        userId,
        title: "Thảo luận của bạn có phản hồi mới! 💬",
        message: `${replierName} đã trả lời câu hỏi của bạn trong bài giảng "${lesson.title}". Xem ngay!`,
        link: `/learn/${lesson.section.course.slug}/${lessonId}`,
        isRead: false
      }
    })
    return { success: true }
  } catch (error: any) {
    console.error("Error creating Q&A reply notification:", error)
    return { success: false, error: error.message }
  }
}

/**
 * 5. Broadly broadcast system updates or announcements to all active users.
 */
export async function notifySystemAnnouncement(title: string, message: string, link?: string) {
  try {
    const users = await prisma.user.findMany({
      where: { status: "ACTIVE" },
      select: { id: true }
    })

    if (users.length > 0) {
      await prisma.notification.createMany({
        data: users.map(user => ({
          userId: user.id,
          title: `📢 Cập nhật hệ thống: ${title}`,
          message,
          link: link || null,
          isRead: false
        }))
      })
    }
    return { success: true }
  } catch (error: any) {
    console.error("Error sending system announcement notification:", error)
    return { success: false, error: error.message }
  }
}
