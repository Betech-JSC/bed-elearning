import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export interface CartItem {
  id: string
  title: string
  slug: string
  price: number
  thumbnail: string | null
  instructorName: string | null
}

interface CartStore {
  items: CartItem[]
  coupon: {
    code: string
    type: "PERCENTAGE" | "FIXED"
    value: number
  } | null
  
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  clearCart: () => void
  applyCoupon: (coupon: CartStore["coupon"]) => void
  removeCoupon: () => void
  
  // Getters
  getIsEnrolled: (courseId: string, enrolledCourses: string[]) => boolean
  getTotalItems: () => number
  getSubtotal: () => number
  getDiscount: () => number
  getTotalAmount: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      
      addItem: (item) => {
        const { items } = get()
        const isExist = items.find((i) => i.id === item.id)
        if (!isExist) {
          set({ items: [...items, item] })
        }
      },
      
      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) })
      },
      
      clearCart: () => {
        set({ items: [], coupon: null })
      },
      
      applyCoupon: (coupon) => {
        set({ coupon })
      },
      
      removeCoupon: () => {
        set({ coupon: null })
      },
      
      getIsEnrolled: (courseId, enrolledCourses) => {
        return enrolledCourses.includes(courseId)
      },
      
      getTotalItems: () => get().items.length,
      
      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.price, 0)
      },
      
      getDiscount: () => {
        const { coupon, getSubtotal } = get()
        const subtotal = getSubtotal()
        
        if (!coupon) return 0
        
        if (coupon.type === "FIXED") {
          return Math.min(coupon.value, subtotal)
        }
        
        // PERCENTAGE: Cap at 50% as per business rules
        const discount = (subtotal * coupon.value) / 100
        return Math.min(discount, subtotal * 0.5)
      },
      
      getTotalAmount: () => {
        return Math.max(0, get().getSubtotal() - get().getDiscount())
      }
    }),
    {
      name: "vibecode-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
