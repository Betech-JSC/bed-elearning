"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { signIn } from "next-auth/react"
import { toast } from "sonner"
import { Lock, Mail, User, ShieldCheck, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import Link from "next/link"
import Image from "next/image"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (response.ok) {
        toast.success("Account created successfully!")
        router.push("/login")
      } else {
        const data = await response.json()
        toast.error(data.message || "Something went wrong.")
      }
    } catch (error) {
      toast.error("Failed to register. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[4rem] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Left Side - Visual */}
      <div className="bg-[#FF6600] p-16 flex flex-col justify-between relative overflow-hidden group">
        <div className="relative z-10 space-y-12">
            <h1 className="text-6xl font-black text-white leading-[1.1]">
                Ignite Your <br/> Future
            </h1>
            <p className="text-white/80 font-medium text-lg max-w-sm leading-relaxed">
                Access world-class education designed to empower your career and personal growth. Experience a friction-free learning environment built for focus.
            </p>
            
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 flex items-center gap-6 group-hover:scale-105 transition-transform duration-500">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-[#FF6600]" />
                </div>
                <div>
                    <p className="text-white font-black text-sm uppercase tracking-widest">Community Impact</p>
                    <p className="text-white/70 text-xs font-bold">Join 10k+ active learners globally</p>
                </div>
            </div>
        </div>
        
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="mt-20 relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/20 aspect-video">
            <Image 
                src="/hero_vibe_coding_1778041166767.png" 
                alt="Create Account" 
                fill 
                className="object-cover grayscale brightness-125 opacity-40 group-hover:scale-110 transition-transform duration-1000"
            />
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="p-16 flex flex-col justify-center">
        <div className="mb-12">
            <h2 className="text-4xl font-black text-zinc-900 mb-3">Create Account</h2>
            <p className="text-zinc-500 font-medium">Start your learning journey today.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Full Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                        <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <Input 
                            placeholder="John Doe" 
                            {...field} 
                            disabled={isLoading}
                            className="h-16 rounded-2xl border-none bg-[#F1F3F5] pl-14 pr-6 text-sm font-medium focus-visible:ring-orange-500/20"
                        />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[10px] font-bold" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Email Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <Input 
                            placeholder="name@example.com" 
                            type="email" 
                            {...field} 
                            disabled={isLoading}
                            className="h-16 rounded-2xl border-none bg-[#F1F3F5] pl-14 pr-6 text-sm font-medium focus-visible:ring-orange-500/20"
                        />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[10px] font-bold" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <Input 
                                placeholder="••••••••" 
                                type="password" 
                                {...field} 
                                disabled={isLoading}
                                className="h-16 rounded-2xl border-none bg-[#F1F3F5] pl-14 pr-6 text-sm font-medium focus-visible:ring-orange-500/20"
                            />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                            <ShieldCheck className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <Input 
                                placeholder="••••••••" 
                                type="password" 
                                {...field} 
                                disabled={isLoading}
                                className="h-16 rounded-2xl border-none bg-[#F1F3F5] pl-14 pr-6 text-sm font-medium focus-visible:ring-orange-500/20"
                            />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold" />
                    </FormItem>
                  )}
                />
            </div>

            <div className="flex items-center gap-3 ml-1 pt-2">
                <Checkbox id="terms" className="w-5 h-5 rounded-lg border-zinc-200 data-[state=checked]:bg-[#FF6600] data-[state=checked]:border-none" />
                <label htmlFor="terms" className="text-[13px] font-medium text-zinc-500 cursor-pointer">
                    I agree to the <Link href="/terms" className="text-[#FF6600] font-bold hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-[#FF6600] font-bold hover:underline">Privacy Policy</Link>
                </label>
            </div>

            <Button type="submit" className="w-full h-16 rounded-2xl bg-[#FF6600] hover:bg-orange-600 transition-all font-black text-sm uppercase tracking-widest shadow-xl shadow-orange-500/20" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>
        </Form>

        <div className="mt-12 text-center">
            <p className="text-sm font-medium text-zinc-500">
                Already have an account? <Link href="/login" className="text-[#FF6600] font-black hover:underline">Log In</Link>
            </p>
        </div>
      </div>
    </div>
  )
}
