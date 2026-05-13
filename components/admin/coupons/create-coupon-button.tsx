"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Plus, Wand2 } from "lucide-react"
import { createCoupon } from "@/lib/actions/admin"
import { toast } from "sonner"

const formSchema = z.object({
  code: z.string().min(3, "Mã code tối thiểu 3 ký tự").max(20),
  type: z.enum(["PERCENTAGE", "FIXED"]),
  value: z.coerce.number().min(1),
  minOrderAmount: z.coerce.number().min(0),
  maxUses: z.coerce.number().min(1),
  expiresAt: z.string().optional(),
})

export const CreateCouponButton = () => {
  const [open, setOpen] = useState(false)
  
  const form = useForm<z.infer<typeof formSchema>>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      code: "",
      type: "PERCENTAGE",
      value: 10,
      minOrderAmount: 0,
      maxUses: 100,
    }
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createCoupon({
        ...values,
        expiresAt: values.expiresAt ? new Date(values.expiresAt) : null
      })
      toast.success("Tạo mã giảm giá thành công")
      setOpen(false)
      form.reset()
    } catch {
      toast.error("Có lỗi xảy ra")
    }
  }

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let code = ""
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    form.setValue("code", code)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="rounded-xl font-bold gap-2">
            <Plus className="w-4 h-4" />
            Tạo mã mới
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[500px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black">Tạo mã giảm giá mới</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel className="font-bold">Mã Code</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input placeholder="Ví dụ: VIBE2024" {...field} className="rounded-xl font-mono uppercase" />
                      </FormControl>
                      <Button type="button" variant="outline" size="icon" onClick={generateCode} className="shrink-0 rounded-xl">
                        <Wand2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Loại giảm giá</FormLabel>
                    <Select onValueChange={(val) => field.onChange(val ?? field.value)} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Chọn loại" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PERCENTAGE">Phần trăm (%)</SelectItem>
                        <SelectItem value="FIXED">Số tiền cố định (VND)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Giá trị</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="minOrderAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Đơn tối thiểu</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxUses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Lượt dùng tối đa</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expiresAt"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel className="font-bold">Ngày hết hạn (không bắt buộc)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="rounded-xl">
                Hủy
              </Button>
              <Button type="submit" className="rounded-xl px-8 font-bold">
                Xác nhận tạo
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
