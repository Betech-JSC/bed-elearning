"use client"

import { useCart } from "@/lib/store/use-cart"
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetFooter,
  SheetTrigger
} from "@/components/ui/sheet"
import { ShoppingCart, Trash2, ArrowRight } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function CartSheet() {
  const { items, removeItem, getTotalItems, getSubtotal } = useCart()
  const totalItems = getTotalItems()
  const subtotal = getSubtotal()

  return (
    <Sheet>
      <SheetTrigger>
        <div className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "relative cursor-pointer")}>
          <ShoppingCart className="w-5 h-5" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </div>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle>Giỏ hàng ({totalItems})</SheetTitle>
          <Separator />
        </SheetHeader>
        
        {totalItems > 0 ? (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="flex flex-col gap-5 py-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative aspect-video w-24 h-16 rounded-md overflow-hidden shrink-0 border">
                      <Image 
                        src={item.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&q=80"} 
                        alt={item.title} 
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <h4 className="text-sm font-bold truncate">{item.title}</h4>
                      <p className="text-xs text-zinc-500 truncate">Bởi {item.instructorName}</p>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="text-sm font-bold text-blue-600">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-zinc-400 hover:text-red-600"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between font-bold text-lg">
                <span>Tạm tính</span>
                <span className="text-blue-600">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subtotal)}
                </span>
              </div>
              <SheetFooter>
                <Link 
                  href="/checkout" 
                  className={cn(buttonVariants(), "w-full h-12 text-md font-bold bg-blue-600 hover:bg-blue-700")}
                >
                  Thanh toán ngay
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </SheetFooter>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4 text-center">
            <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-10 h-10 text-zinc-400" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-lg">Giỏ hàng của bạn đang trống</h3>
              <p className="text-sm text-zinc-500">Hãy khám phá các khoá học thú vị và quay lại đây nhé.</p>
            </div>
            <Link 
              href="/courses" 
              className={cn(buttonVariants({ variant: "outline" }), "mt-4")}
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
