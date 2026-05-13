"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Save, BadgePercent } from "lucide-react"
import { toast } from "sonner"

const formSchema = z.object({
  price: z.coerce.number().min(0),
  salePrice: z.coerce.number().min(0).optional(),
})

interface PricingFormProps {
  initialData: any
}

export function PricingForm({ initialData }: PricingFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: initialData.price || 0,
      salePrice: initialData.salePrice || 0,
    },
  })

  const onSubmit = async (values: any) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/instructor/courses/${initialData.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(errorData || "Cập nhật thất bại")
      }

      toast.success("Đã cập nhật giá khóa học!")
      router.refresh()
    } catch (error: any) {
      console.error("[PRICING_FORM]", error)
      toast.error(error.message || "Đã có lỗi xảy ra.")
    } finally {
      setIsLoading(false)
    }
  }

  const price = form.watch("price")
  const salePrice = form.watch("salePrice")
  const discount = price > 0 && salePrice && salePrice < price 
    ? Math.round(((price - salePrice) / price) * 100) 
    : 0

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control as any}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-zinc-900 dark:text-white">Giá gốc (VND)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      type="number" 
                      disabled={isLoading} 
                      placeholder="0" 
                      {...field} 
                      className="h-12 pl-12 rounded-xl text-lg font-bold" 
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">₫</span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control as any}
            name="salePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-zinc-900 dark:text-white">Giá khuyến mãi (VND)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      type="number" 
                      disabled={isLoading} 
                      placeholder="0" 
                      {...field} 
                      className="h-12 pl-12 rounded-xl text-lg font-bold text-green-600" 
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">₫</span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {discount > 0 && (
          <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 rounded-xl border border-green-200">
            <BadgePercent className="w-5 h-5" />
            <p className="text-sm font-bold">Học viên sẽ được giảm {discount}% khi mua khóa học này!</p>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading} className="gap-2 bg-blue-600 hover:bg-blue-700 h-12 px-8 font-bold text-md">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Lưu thiết lập giá
          </Button>
        </div>
      </form>
    </Form>
  )
}
