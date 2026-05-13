"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { Role, UserStatus, CourseStatus, OrderStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { sendCourseApprovalEmail, sendCourseRejectionEmail } from "@/lib/mail"

async function checkAdmin() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }
  return session
}

// USER ACTIONS
export async function updateUserStatus(userId: string, status: UserStatus) {
  await checkAdmin()
  await prisma.user.update({
    where: { id: userId },
    data: { status }
  })
  revalidatePath("/admin/users")
}

export async function updateUserRole(userId: string, role: Role) {
  await checkAdmin()
  await prisma.user.update({
    where: { id: userId },
    data: { role }
  })
  revalidatePath("/admin/users")
}

// COURSE ACTIONS
export async function updateCourseStatus(courseId: string, status: CourseStatus, rejectionReason?: string) {
  console.log(`[ADMIN_ACTION] Updating course ${courseId} to status ${status}`);
  try {
    await checkAdmin()
    console.log("[ADMIN_ACTION] Admin check passed");

    const course = await prisma.course.update({
      where: { id: courseId },
      data: { 
          status,
          rejectionReason: status === "REJECTED" ? rejectionReason : null
      },
      include: { instructor: true }
    })
    console.log("[ADMIN_ACTION] Database update successful");

    try {
      if (course.instructor.email) {
        if (status === "PUBLISHED") {
            await sendCourseApprovalEmail(course.instructor.email, course.title)
        } else if (status === "REJECTED" && rejectionReason) {
            await sendCourseRejectionEmail(course.instructor.email, course.title, rejectionReason)
        }
      }
      console.log("[ADMIN_ACTION] Email sent (if applicable)");
    } catch (emailError) {
      console.error("[ADMIN_SEND_EMAIL_ERROR]", emailError)
    }

    revalidatePath("/admin/courses")
    console.log("[ADMIN_ACTION] Path revalidated");
    return { success: true };
  } catch (error: any) {
    console.error("[ADMIN_UPDATE_COURSE_ERROR]", error);
    throw new Error(error.message || "Failed to update course status");
  }
}

export async function toggleCourseFeatured(courseId: string, isFeatured: boolean) {
  await checkAdmin()
  await prisma.course.update({
    where: { id: courseId },
    data: { isFeatured }
  })
  revalidatePath("/admin/courses")
}

export async function toggleCourseHidden(courseId: string, isHidden: boolean) {
  await checkAdmin()
  await prisma.course.update({
    where: { id: courseId },
    data: { isHidden }
  })
  revalidatePath("/admin/courses")
}

// ORDER ACTIONS
export async function refundOrder(orderId: string) {
  await checkAdmin()
  await prisma.order.update({
    where: { id: orderId },
    data: { status: "REFUNDED" }
  })
  revalidatePath("/admin/orders")
}

// COUPON ACTIONS
export async function toggleCouponActive(couponId: string, isActive: boolean) {
  await checkAdmin()
  await prisma.coupon.update({
    where: { id: couponId },
    data: { isActive }
  })
  revalidatePath("/admin/coupons")
}

export async function createCoupon(data: {
  code: string
  type: "PERCENTAGE" | "FIXED"
  value: number
  minOrderAmount: number
  maxUses: number
  expiresAt: Date | null
}) {
  await checkAdmin()
  await prisma.coupon.create({
    data
  })
  revalidatePath("/admin/coupons")
}

// SETTINGS ACTIONS
export async function updateGlobalSettings(data: {
    platformFee: number
    maintenanceMode: boolean
    bannerImage?: string
    bannerLink?: string
    featuredCourseIds: string[]
}) {
    await checkAdmin()
    await prisma.globalSettings.upsert({
        where: { id: "global" },
        update: data,
        create: { id: "global", ...data }
    })
    revalidatePath("/admin/settings")
}
