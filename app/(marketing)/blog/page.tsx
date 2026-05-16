import prisma from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Clock, Sparkles } from "lucide-react"

export default async function BlogPage() {
  const articles = await prisma.article.findMany({
    where: { isPublished: true },
    include: { author: true },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="bg-[#F8F9FA] min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="text-center space-y-8 mb-24 animate-in fade-in slide-in-from-top-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100/50 border border-orange-200 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-[#FF6600]" />
                <span className="text-[10px] font-black text-[#FF6600] uppercase tracking-widest text-center">Belearning Blog</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-black tracking-tight leading-tight text-zinc-900">
                Góc nhìn chuyên sâu <br/>
                <span className="text-[#FF6600]">& Công nghệ.</span>
            </h1>
            <p className="text-zinc-500 font-medium text-lg max-w-2xl mx-auto leading-relaxed">
                Khám phá những xu hướng công nghệ mới nhất, hướng dẫn học tập và kiến thức chuyên sâu từ đội ngũ giảng viên tại Belearning.
            </p>
        </div>

        {/* Featured Post Placeholder / First Post */}
        {articles.length > 0 && (
            <div className="mb-24 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                <Link href={`/blog/${articles[0].slug}`} className="group relative block w-full aspect-[21/9] rounded-[4rem] overflow-hidden shadow-2xl shadow-zinc-200/50">
                    <Image 
                        src={articles[0].thumbnail || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80"}
                        alt={articles[0].title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-16 space-y-6 max-w-3xl">
                        <Badge className="bg-[#FF6600] text-white border-none px-4 py-1.5 font-black text-[10px] uppercase tracking-widest">Bài viết nổi bật</Badge>
                        <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">{articles[0].title}</h2>
                        <div className="flex items-center gap-6 text-zinc-300 text-sm font-bold">
                            <span className="text-white">By {articles[0].author?.name || "Belearning Team"}</span>
                            <span>•</span>
                            <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> 10 phút đọc</span>
                        </div>
                    </div>
                </Link>
            </div>
        )}

        {/* Article Grid */}
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400">
            <div className="flex items-center justify-between">
                <h3 className="text-3xl font-black text-zinc-900 tracking-tight">Bài viết mới nhất</h3>
                <div className="h-px flex-1 bg-zinc-100 mx-10 hidden md:block" />
            </div>

            {articles.length === 0 ? (
                <div className="text-center py-32 bg-white rounded-[4rem] border border-dashed border-zinc-200 shadow-sm">
                    <div className="w-24 h-24 bg-orange-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <BookOpen className="w-10 h-10 text-[#FF6600]" />
                    </div>
                    <h3 className="text-3xl font-black text-zinc-900 mb-3">Chưa có bài viết nào</h3>
                    <p className="text-zinc-500 max-w-sm mx-auto mb-10 font-medium leading-relaxed">
                        Các bài viết mới về công nghệ và giáo dục đang được chúng tôi biên tập. Vui lòng quay lại sau nhé!
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {articles.slice(1).map((article) => (
                    <Link href={`/blog/${article.slug}`} key={article.id} className="group flex flex-col h-full bg-white rounded-[3.5rem] border border-zinc-100 overflow-hidden hover:shadow-2xl hover:shadow-orange-500/5 hover:-translate-y-2 transition-all duration-500">
                        <div className="aspect-[16/10] relative overflow-hidden bg-zinc-100">
                            <Image 
                                src={article.thumbnail || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80"}
                                alt={article.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-1000"
                            />
                            <div className="absolute top-4 left-4">
                                <Badge className="bg-white/90 backdrop-blur-md text-zinc-900 border-none px-4 py-1.5 font-black text-[10px] uppercase tracking-widest shadow-sm">Tin tức</Badge>
                            </div>
                        </div>
                        <div className="p-10 flex flex-col flex-1 space-y-6">
                            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                <span className="text-[#FF6600]">{article.author?.name || "Belearning"}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {new Date(article.createdAt).toLocaleDateString("vi-VN")}</span>
                            </div>
                            <h3 className="text-2xl font-black text-zinc-900 leading-tight group-hover:text-[#FF6600] transition-colors line-clamp-2">{article.title}</h3>
                            <p className="text-zinc-500 text-sm font-medium leading-relaxed line-clamp-3 flex-1">{article.content?.substring(0, 150)}...</p>
                            <div className="pt-6 border-t border-zinc-50 flex items-center justify-between group/btn">
                                <span className="text-zinc-900 font-black text-xs uppercase tracking-widest group-hover:text-[#FF6600] transition-colors">Đọc tiếp</span>
                                <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-[#FF6600] group-hover:text-white transition-all">
                                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </Link>
                    ))}
                    {/* If only 1 article, show it in grid too if we want, but usually grid is for remaining items */}
                    {articles.length === 1 && (
                         <p className="col-span-full text-center text-zinc-400 italic py-10">Đang cập nhật thêm bài viết...</p>
                    )}
                </div>
            )}
        </div>

        {/* Newsletter / CTA */}
        <div className="mt-32 bg-zinc-900 rounded-[4rem] p-16 md:p-24 relative overflow-hidden text-center">
            <div className="absolute top-0 left-0 w-full h-full bg-orange-600/5 pointer-events-none" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">Đăng ký nhận <br/> bản tin công nghệ</h2>
                <p className="text-zinc-400 font-medium text-lg leading-relaxed">
                    Nhận những bài viết mới nhất và thông tin ưu đãi từ Belearning trực tiếp qua email của bạn.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 p-2 bg-white/5 rounded-3xl backdrop-blur-md border border-white/10">
                    <input 
                        type="email" 
                        placeholder="Địa chỉ email của bạn..." 
                        className="flex-1 bg-transparent border-none text-white px-6 py-4 focus:outline-none font-medium"
                    />
                    <Button className="h-14 px-10 rounded-2xl bg-[#FF6600] hover:bg-orange-600 font-black text-xs uppercase tracking-widest border-none text-white shadow-xl shadow-orange-500/20">
                        Đăng ký ngay
                    </Button>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
