"use client"

import { useEffect, useState } from "react"
import { useCart } from "@/lib/store/use-cart"
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetFooter,
  SheetTrigger
} from "@/components/ui/sheet"
import { ShoppingCart, Trash2, ArrowRight, ShoppingBag, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function CartSheet() {
  const [mounted, setMounted] = useState(false)
  const { items, removeItem, getTotalItems, getSubtotal } = useCart()

  useEffect(() => {
    setMounted(true)
  }, [])

  const totalItems = mounted ? getTotalItems() : 0
  const subtotal = mounted ? getSubtotal() : 0

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price)

  return (
    <Sheet>
      <SheetTrigger>
        <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400 hover:text-[#FF6600] hover:bg-orange-50 transition-all relative cursor-pointer">
          <ShoppingCart className="w-5 h-5" />
          {totalItems > 0 && (
            <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#FF6600] rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-[8px] font-black text-white">{totalItems}</span>
            </div>
          )}
        </div>
      </SheetTrigger>

      <SheetContent className="flex flex-col w-full sm:max-w-[420px] p-0 gap-0 border-l border-zinc-100">
        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5 text-[#FF6600]" />
            </div>
            <div>
              <SheetTitle className="text-lg font-black text-zinc-900 leading-none">
                Giỏ hàng
              </SheetTitle>
              <p className="text-xs text-zinc-400 font-medium mt-0.5">
                {totalItems > 0 ? `${totalItems} khóa học đã chọn` : "Chưa có khóa học nào"}
              </p>
            </div>
          </div>
        </SheetHeader>

        {totalItems > 0 ? (
          <>
            {/* Items */}
            <ScrollArea className="flex-1">
              <div className="flex flex-col divide-y divide-zinc-50 px-4 py-2">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 py-4 group">
                    {/* Thumbnail */}
                    <div className="relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border border-zinc-100">
                      <Image
                        src={item.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&q=80"}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    {/* Info */}
                    <div className="flex flex-col flex-1 min-w-0 justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-zinc-900 line-clamp-2 leading-snug">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-zinc-400 font-medium mt-0.5">
                          {item.instructorName}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-black text-[#FF6600]">
                          {formatPrice(item.price)}
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Footer */}
            <SheetFooter className="flex-col p-6 gap-4 border-t border-zinc-100 bg-zinc-50/50">
              {/* Promo badge */}
              <div className="flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-2xl px-4 py-3">
                <Sparkles className="w-4 h-4 text-[#FF6600] shrink-0" />
                <p className="text-[11px] font-bold text-orange-700">
                  Bạn đang tiết kiệm được rất nhiều! Hoàn thành thanh toán ngay.
                </p>
              </div>

              {/* Summary */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-zinc-500">
                  <span className="font-medium">Tạm tính ({totalItems} khóa học)</span>
                  <span className="font-bold text-zinc-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-zinc-900">Tổng cộng</span>
                  <span className="text-2xl font-black text-[#FF6600]">{formatPrice(subtotal)}</span>
                </div>
              </div>

              {/* CTA */}
              <Link
                href="/checkout"
                className="w-full h-14 rounded-2xl bg-[#FF6600] hover:bg-orange-600 text-white font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-95"
              >
                Thanh toán ngay
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/cart"
                className="text-center text-xs font-bold text-zinc-400 hover:text-[#FF6600] transition-colors"
              >
                Xem giỏ hàng đầy đủ →
              </Link>
            </SheetFooter>
          </>
        ) : (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-4">
            <div className="relative">
              <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-10 h-10 text-orange-200" />
              </div>
              <div className="absolute -top-1 -right-1 w-8 h-8 bg-[#FF6600] rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30">
                <span className="text-white font-black text-sm">0</span>
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="font-black text-zinc-900 text-lg">Giỏ hàng đang trống</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Khám phá hàng trăm khóa học chất lượng và bắt đầu hành trình học tập của bạn.
              </p>
            </div>
            <Link
              href="/courses"
              className="mt-2 h-12 px-6 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              Khám phá khóa học
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
