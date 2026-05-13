"use client"

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
  FormMessage 
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { updateGlobalSettings } from "@/lib/actions/admin"
import { toast } from "sonner"
import { ScrollArea } from "@/components/ui/scroll-area"

const formSchema = z.object({
  platformFee: z.coerce.number().min(0).max(100),
  maintenanceMode: z.boolean(),
  bannerImage: z.string().optional(),
  bannerLink: z.string().optional(),
  featuredCourseIds: z.array(z.string()),
})

interface SettingsFormProps {
  initialData: any
  courses: { id: string, title: string }[]
}

export const SettingsForm = ({ initialData, courses }: SettingsFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(formSchema) as any,
    defaultValues: initialData
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await updateGlobalSettings(values)
      toast.success("Lưu cấu hình thành công")
    } catch {
      toast.error("Có lỗi xảy ra")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6">
          <h2 className="text-lg font-bold border-b pb-2">Vận hành</h2>
          
          <FormField
            control={form.control}
            name="platformFee"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-xl border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base font-bold">Phí nền tảng (%)</FormLabel>
                  <FormDescription>
                    Tỷ lệ phần trăm nền tảng giữ lại từ mỗi đơn hàng.
                  </FormDescription>
                </div>
                <FormControl>
                  <Input type="number" {...field} className="w-24 text-right rounded-xl" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maintenanceMode"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-xl border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base font-bold">Chế độ bảo trì</FormLabel>
                  <FormDescription>
                    Khi bật, người dùng không thể thực hiện thanh toán hoặc học bài.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-6">
          <h2 className="text-lg font-bold border-b pb-2">Marketing</h2>
          
          <FormField
            control={form.control}
            name="bannerImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Ảnh Banner (URL)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://..." className="rounded-xl" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bannerLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Link Banner</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="/courses/..." className="rounded-xl" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between border-b pb-2">
            <h2 className="text-lg font-bold">Khóa học nổi bật</h2>
            <span className="text-xs text-zinc-500 font-medium">Tối đa 8 khóa học</span>
          </div>
          
          <FormField
            control={form.control}
            name="featuredCourseIds"
            render={() => (
              <FormItem>
                <ScrollArea className="h-64 border rounded-xl p-4">
                  <div className="space-y-3">
                    {courses.map((course: any) => (
                      <FormField
                        key={course.id}
                        control={form.control}
                        name="featuredCourseIds"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={course.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(course.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, course.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value: string) => value !== course.id
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-medium leading-none">
                                {course.title}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                </ScrollArea>
                <FormDescription>
                  Các khóa học này sẽ hiển thị ở phần "Nổi bật" trên trang chủ.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" className="rounded-xl px-12 font-bold h-12">
            Lưu thay đổi
          </Button>
        </div>
      </form>
    </Form>
  )
}
