"use client"

import { useCart } from "@/lib/store/use-cart"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Trash2, ArrowRight } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export default function CartPage() {
  const { items, removeItem, getTotalItems, getSubtotal } = useCart()
  const totalItems = getTotalItems()
  const subtotal = getSubtotal()

  return (
    <div className="min-h-screen bg-zinc-50 pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-4xl font-black mb-10">Giỏ hàng của bạn</h1>

        {totalItems > 0 ? (
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Cart Items List */}
            <div className="flex-1">
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-zinc-100">
                <div className="flex items-center justify-between font-bold text-zinc-500 mb-6 px-4">
                  <span>{totalItems} Khóa học</span>
                </div>
                <div className="flex flex-col gap-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row gap-6 p-4 rounded-2xl hover:bg-zinc-50 transition-colors border border-transparent hover:border-zinc-100">
                      <div className="relative aspect-video w-full sm:w-48 rounded-xl overflow-hidden shrink-0 border border-zinc-100">
                        <Image 
                          src={item.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80"} 
                          alt={item.title} 
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col flex-1">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h3 className="text-lg font-bold line-clamp-2">{item.title}</h3>
                            <p className="text-sm text-zinc-500 mt-1">Bởi <span className="font-medium text-zinc-900">{item.instructorName}</span></p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xl font-black text-[#FF6600]">
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                            </span>
                          </div>
                        </div>
                        <div className="mt-auto pt-4 flex justify-end">
                          <Button 
                            variant="ghost" 
                            className="text-zinc-400 hover:text-red-600 hover:bg-red-50 gap-2"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                            Xóa khỏi giỏ
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-[400px] shrink-0">
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-zinc-100 sticky top-32">
                <h3 className="text-2xl font-black mb-6">Tổng cộng</h3>
                
                <div className="space-y-4 text-zinc-600 mb-6">
                  <div className="flex justify-between">
                    <span>Tạm tính</span>
                    <span className="font-bold text-zinc-900">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subtotal)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg">
                    <span className="font-bold text-zinc-900">Tổng thanh toán</span>
                    <span className="font-black text-[#FF6600] text-2xl">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subtotal)}
                    </span>
                  </div>
                </div>

                <Link 
                  href="/checkout" 
                  className={cn(buttonVariants({ size: "lg" }), "w-full h-14 rounded-2xl bg-[#FF6600] hover:bg-orange-600 text-white font-black uppercase tracking-widest text-sm shadow-xl shadow-orange-500/20 transition-all hover:scale-105 active:scale-95")}
                >
                  Thanh toán ngay
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] p-16 flex flex-col items-center justify-center text-center shadow-sm border border-zinc-100 min-h-[50vh]">
            <div className="w-32 h-32 bg-orange-50 rounded-full flex items-center justify-center mb-8">
              <ShoppingCart className="w-16 h-16 text-[#FF6600]" />
            </div>
            <h2 className="text-3xl font-black mb-4">Giỏ hàng của bạn đang trống</h2>
            <p className="text-zinc-500 mb-8 max-w-md mx-auto">
              Có vẻ như bạn chưa chọn khóa học nào. Hãy khám phá hàng trăm khóa học chất lượng trên hệ thống và quay lại đây nhé.
            </p>
            <Link 
              href="/courses" 
              className={cn(buttonVariants({ size: "lg" }), "h-14 px-8 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-black uppercase tracking-widest text-sm transition-all hover:scale-105 active:scale-95")}
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
