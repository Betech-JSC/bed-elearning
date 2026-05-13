import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { toast } from "sonner"

interface Course {
  id: string
  title: string
  price: number
  thumbnail: string | null
  instructorName: string
}

interface CartStore {
  items: Course[]
  addItem: (data: Course) => void
  removeItem: (id: string) => void
  clearCart: () => void
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (data: Course) => {
        const currentItems = get().items
        const isExisting = currentItems.find((item) => item.id === data.id)

        if (isExisting) {
          return toast.info("Khóa học đã có trong giỏ hàng")
        }

        set({ items: [...get().items, data] })
        toast.success("Đã thêm vào giỏ hàng")
      },
      removeItem: (id: string) => {
        set({ items: [...get().items.filter((item) => item.id !== id)] })
        toast.success("Đã xóa khỏi giỏ hàng")
      },
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
