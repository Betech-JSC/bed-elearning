import { PrismaClient, CourseStatus, CourseLevel, Role } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  // Seed Coupons
  await prisma.coupon.createMany({
    data: [
      {
        code: "VIBECODE10",
        type: "PERCENTAGE",
        value: 10,
        minOrderAmount: 200000,
        maxUses: 100,
        isActive: true,
      },
      {
        code: "CHAOXUAN50K",
        type: "FIXED",
        value: 50000,
        minOrderAmount: 100000,
        maxUses: 50,
        isActive: true,
      }
    ],
    skipDuplicates: true
  })

  // Create Categories
  const categoriesData = [
    { name: "Trí tuệ nhân tạo (AI)", slug: "ai", icon: "bot" },
    { name: "Phát triển Web", slug: "web-development", icon: "code" },
    { name: "Lập trình Mobile", slug: "mobile", icon: "smartphone" },
    { name: "DevOps & Cloud", slug: "devops", icon: "cloud" },
    { name: "Data Science", slug: "data-science", icon: "database" },
  ]

  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }
  const categories = await prisma.category.findMany()

  // Create Instructor
  const hashedPassword = await bcrypt.hash("Password123!", 10)

  const instructor = await prisma.user.upsert({
    where: { email: "instructor@vibecode.academy" },
    update: {},
    create: {
      name: "Chuyên gia Vibe",
      email: "instructor@vibecode.academy",
      password: hashedPassword,
      role: Role.INSTRUCTOR,
      bio: "Giảng viên có 10 năm kinh nghiệm và tiên phong áp dụng AI vào lập trình.",
      image: "https://i.pravatar.cc/150?u=instructor@vibecode.academy"
    }
  })

  // Create Student for Reviews
  const student = await prisma.user.upsert({
    where: { email: "student@vibecode.academy" },
    update: {},
    create: {
      name: "Học viên A",
      email: "student@vibecode.academy",
      password: hashedPassword,
      role: Role.STUDENT,
      image: "https://i.pravatar.cc/150?u=student@vibecode.academy"
    }
  })

  // Create Courses
  const coursesData = [
    {
      title: "Làm chủ AI Coding với Cursor và Claude",
      slug: "ai-coding-cursor-claude",
      description: "Học cách viết code nhanh gấp 10 lần nhờ sự trợ giúp của AI. Khóa học toàn diện nhất về Vibe Coding.",
      whatYouWillLearn: "Hiểu về tư duy Vibe Coding;Sử dụng thành thạo Cursor AI;Tối ưu prompt với Claude 3.5 Sonnet;Xây dựng ứng dụng Fullstack chỉ trong vài giờ",
      requirements: "Cơ bản về HTML/CSS/JS;Đã cài đặt Cursor AI",
      targetAudience: "Lập trình viên muốn tăng năng suất;Người mới bắt đầu muốn học nhanh",
      price: 990000,
      thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
      status: CourseStatus.PUBLISHED,
      level: CourseLevel.BEGINNER,
      isFeatured: true,
      categoryId: categories.find(c => c.slug === "ai")?.id,
      instructorId: instructor.id,
    },
    {
      title: "Xây dựng SaaS bằng Next.js 14 và Prisma",
      slug: "build-saas-nextjs-prisma",
      description: "Từ con số 0 đến ứng dụng SaaS hoàn chỉnh có thu tiền người dùng bằng Stripe/VNPay.",
      whatYouWillLearn: "Kiến trúc Next.js App Router;Quản lý Database với Prisma;Tích hợp thanh toán Stripe/VNPay;Triển khai ứng dụng lên Vercel",
      requirements: "Đã biết React cơ bản",
      targetAudience: "Developer muốn làm Freelance/SaaS",
      price: 1490000,
      thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
      status: CourseStatus.PUBLISHED,
      level: CourseLevel.INTERMEDIATE,
      isFeatured: true,
      categoryId: categories.find(c => c.slug === "web-development")?.id,
      instructorId: instructor.id,
    },
    {
      title: "Trở thành Data Scientist trong 3 tháng",
      slug: "data-scientist-3-months",
      description: "Phân tích dữ liệu với Python, Pandas và Machine Learning cơ bản.",
      whatYouWillLearn: "Lập trình Python cho Data Science;Xử lý dữ liệu với Pandas;Trực quan hóa dữ liệu;Cơ bản về Machine Learning",
      requirements: "Biết toán học cơ bản",
      targetAudience: "Người muốn chuyển ngành sang Data",
      price: 0,
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
      status: CourseStatus.PUBLISHED,
      level: CourseLevel.BEGINNER,
      isFeatured: false,
      categoryId: categories.find(c => c.slug === "data-science")?.id,
      instructorId: instructor.id,
    },
    {
      title: "DevOps Thực Chiến: Docker & Kubernetes",
      slug: "devops-docker-kubernetes",
      description: "Triển khai ứng dụng tự động, mở rộng quy mô dễ dàng với hệ sinh thái DevOps hiện đại.",
      whatYouWillLearn: "Containerization với Docker;Quản trị Kubernetes cluster;CI/CD với Github Actions;Monitoring & Logging",
      requirements: "Biết Linux cơ bản",
      targetAudience: "System Admin hoặc Backend Developer",
      price: 2000000,
      thumbnail: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&q=80&w=800",
      status: CourseStatus.PUBLISHED,
      level: CourseLevel.ADVANCED,
      isFeatured: true,
      categoryId: categories.find(c => c.slug === "devops")?.id,
      instructorId: instructor.id,
    },
    {
      title: "Lập trình React Native App cho iOS/Android",
      slug: "react-native-app-ios-android",
      description: "Tạo ứng dụng di động đa nền tảng chỉ với một mã nguồn Javascript/Typescript.",
      whatYouWillLearn: "Cơ bản về React Native;Sử dụng Expo;Quản lý state với Zustand;Triển khai lên App Store/Play Store",
      requirements: "Biết React Web là một lợi thế",
      targetAudience: "Web Dev muốn sang Mobile",
      price: 1200000,
      thumbnail: "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&q=80&w=800",
      status: CourseStatus.PUBLISHED,
      level: CourseLevel.INTERMEDIATE,
      isFeatured: false,
      categoryId: categories.find(c => c.slug === "mobile")?.id,
      instructorId: instructor.id,
    }
  ]

  for (const courseData of coursesData) {
    const course = await prisma.course.upsert({
      where: { slug: courseData.slug },
      update: {},
      create: courseData
    })

    // Create Sections and Lessons
    const section1 = await prisma.section.create({
      data: {
        title: "Chương 1: Giới thiệu và Cài đặt",
        order: 1,
        courseId: course.id,
      }
    })

    await prisma.lesson.createMany({
      data: [
        {
          title: "Bài 1: Tổng quan về nội dung học",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          isFreePreview: true,
          order: 1,
          sectionId: section1.id,
        },
        {
          title: "Bài 2: Hướng dẫn cài đặt môi trường",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          isFreePreview: false,
          order: 2,
          sectionId: section1.id,
        }
      ]
    })

    const section2 = await prisma.section.create({
      data: {
        title: "Chương 2: Kiến thức trọng tâm",
        order: 2,
        courseId: course.id,
      }
    })

    await prisma.lesson.create({
      data: {
        title: "Bài 3: Thực hành dự án thực tế",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        isFreePreview: false,
        order: 1,
        sectionId: section2.id,
      }
    })

    await prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: student.id,
          courseId: course.id
        }
      },
      update: {},
      create: {
        userId: student.id,
        courseId: course.id,
        progress: 100
      }
    })

    await prisma.review.upsert({
      where: {
        userId_courseId: {
          userId: student.id,
          courseId: course.id
        }
      },
      update: {},
      create: {
        userId: student.id,
        courseId: course.id,
        rating: 5,
        comment: "Khóa học cực kỳ chất lượng, giảng viên nhiệt tình. Nhờ có phương pháp Vibe Coding, tôi đã có thể tăng tốc độ code lên gấp nhiều lần. Highly recommend!"
      }
    })
  }

  console.log("Database seeded successfully.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
