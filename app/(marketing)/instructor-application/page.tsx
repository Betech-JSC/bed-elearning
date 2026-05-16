"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Globe, DollarSign, Zap, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Image from "next/image"

export default function InstructorApplicationPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // In a real app, this would send data to an API
    setTimeout(() => {
      toast.success("Application submitted successfully! Our board will review it soon.")
      router.push("/")
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Header */}
        <div className="text-center space-y-6 mb-20 animate-in fade-in slide-in-from-top-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-100 rounded-full">
                <Star className="w-3.5 h-3.5 text-[#FF6600] fill-[#FF6600]" />
                <span className="text-[10px] font-black text-[#FF6600] uppercase tracking-widest">Elite Instructor Network</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-black tracking-tight leading-tight text-zinc-900">
                Shape the Future of <br/> Global Education
            </h1>
            <p className="text-zinc-500 font-medium text-lg max-w-2xl mx-auto leading-relaxed">
                Join a community of world-class educators and industry leaders. Share your expertise with millions of learners worldwide on Belearning.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start w-full">
            {/* Left Column - Benefits */}
            <div className="lg:col-span-5 space-y-12 animate-in fade-in slide-in-from-left-8 duration-1000 delay-200">
                <div className="space-y-10">
                    <h3 className="text-2xl font-black text-[#8B3D00]">Why Teach Here?</h3>
                    
                    <div className="space-y-8">
                        <div className="flex gap-6">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/5 shrink-0 border border-zinc-100">
                                <Globe className="w-6 h-6 text-[#FF6600]" />
                            </div>
                            <div>
                                <h4 className="font-black text-zinc-900 mb-1">Global Impact</h4>
                                <p className="text-zinc-500 text-sm font-medium leading-relaxed">Reach learners across 190 countries and make a difference at scale.</p>
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/5 shrink-0 border border-zinc-100">
                                <DollarSign className="w-6 h-6 text-[#FF6600]" />
                            </div>
                            <div>
                                <h4 className="font-black text-zinc-900 mb-1">Revenue Share</h4>
                                <p className="text-zinc-500 text-sm font-medium leading-relaxed">Competitive compensation for your knowledge with monthly payouts.</p>
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/5 shrink-0 border border-zinc-100">
                                <Zap className="w-6 h-6 text-[#FF6600]" />
                            </div>
                            <div>
                                <h4 className="font-black text-zinc-900 mb-1">Premium Tools</h4>
                                <p className="text-zinc-500 text-sm font-medium leading-relaxed">Access high-end course management software and production support.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white group">
                    <Image 
                        src="/hero_vibe_coding_1778041166767.png" 
                        alt="Testimonial" 
                        width={600} 
                        height={600} 
                        className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-10 left-10 right-10">
                        <p className="text-white font-bold italic text-lg leading-relaxed mb-4">
                            &quot;Belearning gave me the platform to scale my teaching beyond the classroom.&quot; — Dr. Sarah Chen
                        </p>
                        <div className="flex gap-1">
                            {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-orange-400 fill-orange-400" />)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column - Form */}
            <div className="lg:col-span-7 animate-in fade-in slide-in-from-right-8 duration-1000 delay-400">
                <Card className="border-none shadow-2xl shadow-zinc-200/50 rounded-[4rem] bg-white overflow-hidden p-12 md:p-16">
                    <div className="mb-12">
                        <h2 className="text-4xl font-black text-zinc-900 mb-3">Instructor Application</h2>
                        <p className="text-zinc-500 font-medium">Please provide your details for our academic board.</p>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Full Name</label>
                                <Input 
                                    placeholder="e.g. Dr. Jonathan Smith" 
                                    className="h-16 rounded-2xl border-none bg-[#F1F3F5] px-6 text-sm font-medium focus-visible:ring-orange-500/20"
                                    required
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Professional Email</label>
                                <Input 
                                    placeholder="jonathan@university.edu" 
                                    type="email"
                                    className="h-16 rounded-2xl border-none bg-[#F1F3F5] px-6 text-sm font-medium focus-visible:ring-orange-500/20"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Area of Expertise</label>
                            <Select>
                                <SelectTrigger className="h-16 rounded-2xl border-none bg-[#F1F3F5] px-6 text-sm font-medium focus:ring-orange-500/20">
                                    <SelectValue placeholder="Select your specialty" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-zinc-100 shadow-2xl">
                                    <SelectItem value="it">Information Technology</SelectItem>
                                    <SelectItem value="business">Business & Management</SelectItem>
                                    <SelectItem value="design">Creative Arts & Design</SelectItem>
                                    <SelectItem value="language">Languages & Linguistics</SelectItem>
                                    <SelectItem value="science">Applied Sciences</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Why do you want to teach?</label>
                            <Textarea 
                                placeholder="Tell us about your pedagogical vision and what makes your approach unique..." 
                                className="min-h-[160px] rounded-2xl border-none bg-[#F1F3F5] p-6 text-sm font-medium focus-visible:ring-orange-500/20 resize-none"
                                required
                            />
                        </div>

                        <div className="flex items-center gap-4 bg-[#F1F3F5] p-6 rounded-2xl border border-transparent hover:border-orange-200 transition-all cursor-pointer">
                            <Checkbox id="honor-code" className="w-6 h-6 rounded-lg border-zinc-300 data-[state=checked]:bg-[#FF6600] data-[state=checked]:border-none" />
                            <label htmlFor="honor-code" className="text-xs font-medium text-zinc-500 leading-relaxed cursor-pointer">
                                I agree to the <span className="text-zinc-900 font-bold underline">Instructor Honor Code</span> and the <span className="text-zinc-900 font-bold underline">Terms of Service</span>.
                            </label>
                        </div>

                        <Button type="submit" className="w-48 h-16 rounded-full bg-[#FF6600] hover:bg-orange-600 transition-all font-black text-sm shadow-xl shadow-orange-500/20" disabled={isLoading}>
                            {isLoading ? "Submitting..." : "Apply as Instructor"}
                        </Button>

                        <div className="pt-8 border-t border-zinc-50">
                            <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest leading-relaxed">
                                All applications are reviewed by our Academic Board. Response time is typically 3-5 business days.
                            </p>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
      </div>
    </div>
  )
}
