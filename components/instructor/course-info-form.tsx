"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Save, Image as ImageIcon } from "lucide-react"
import { toast } from "sonner"
import { Editor } from "./editor" // Custom Tiptap wrapper

const formSchema = z.object({
  title: z.string().min(1, "Tiêu đề là bắt buộc"),
  description: z.string().min(1, "Mô tả ngắn là bắt buộc"),
  whatYouWillLearn: z.string().optional(),
  categoryId: z.string().min(1, "Vui lòng chọn danh mục"),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "ALL"]),
  thumbnail: z.string().optional(),
})

interface CourseInfoFormProps {
  initialData: any
  categories: { id: string; name: string }[]
}

export function CourseInfoForm({ initialData, categories }: CourseInfoFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData.title || "",
      description: initialData.description || "",
      whatYouWillLearn: initialData.whatYouWillLearn || "",
      categoryId: initialData.categoryId || "",
      level: initialData.level || "ALL",
      thumbnail: initialData.thumbnail || "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/instructor/courses/${initialData.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) throw new Error("Cập nhật thất bại")

      toast.success("Thông tin khóa học đã được lưu!")
      router.refresh()
    } catch (error) {
      toast.error("Đã có lỗi xảy ra.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Tiêu đề khóa học</FormLabel>
              <FormControl>
                <Input disabled={isLoading} {...field} className="h-11 rounded-lg" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Danh mục</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || undefined}>
                  <FormControl>
                    <SelectTrigger className="h-11 rounded-lg w-full">
                      <SelectValue placeholder="Chọn danh mục">
                        {categories.find(c => c.id === field.value)?.name}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="level"
            render={({ field }) => {
              const levels: any = {
                BEGINNER: "Cơ bản",
                INTERMEDIATE: "Trung cấp",
                ADVANCED: "Nâng cao",
                ALL: "Mọi cấp độ",
              }
              return (
                <FormItem>
                  <FormLabel className="font-bold">Cấp độ</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || undefined}>
                    <FormControl>
                      <SelectTrigger className="h-11 rounded-lg w-full">
                        <SelectValue placeholder="Chọn cấp độ">
                          {levels[field.value]}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="BEGINNER">Cơ bản</SelectItem>
                      <SelectItem value="INTERMEDIATE">Trung cấp</SelectItem>
                      <SelectItem value="ADVANCED">Nâng cao</SelectItem>
                      <SelectItem value="ALL">Mọi cấp độ</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Mô tả ngắn</FormLabel>
              <FormControl>
                <Textarea disabled={isLoading} {...field} rows={3} className="rounded-lg" />
              </FormControl>
              <FormDescription>Tóm tắt ngắn gọn nội dung khóa học (hiển thị trên thẻ khóa học).</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="whatYouWillLearn"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Mô tả chi tiết</FormLabel>
              <FormControl>
                <Editor value={field.value || ""} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="thumbnail"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Ảnh đại diện (Thumbnail)</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <Input 
                      disabled={isLoading} 
                      {...field} 
                      placeholder="Dán link ảnh tại đây..." 
                      className="h-11 rounded-lg" 
                    />
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="thumbnail-upload"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            // In a real app, you would upload this to a server
                            // For now, we'll use a FileReader to show a preview
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              field.onChange(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <Button 
                        type="button" 
                        variant="secondary" 
                        className="h-11 gap-2"
                        onClick={() => document.getElementById('thumbnail-upload')?.click()}
                      >
                        <ImageIcon className="w-4 h-4" />
                        Tải lên
                      </Button>
                    </div>
                  </div>
                  {field.value && (
                    <div className="relative aspect-video w-64 rounded-xl overflow-hidden border shadow-sm">
                      <img src={field.value} alt="Preview" className="object-cover w-full h-full" />
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading} className="gap-2 bg-blue-600 hover:bg-blue-700 h-12 px-8 font-bold text-md">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Lưu thông tin
          </Button>
        </div>
      </form>
    </Form>
  )
}
