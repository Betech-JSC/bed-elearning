"use client"

import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"

export function PrintButton() {
  return (
    <Button 
      onClick={() => window.print()} 
      className="gap-2 bg-[#FF6600] hover:bg-orange-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl h-11 px-6 shadow-md shadow-orange-500/10 hover:shadow-lg transition-all"
    >
      <Printer className="w-4 h-4" />
      In hóa đơn
    </Button>
  )
}
