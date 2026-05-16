import prisma from "@/lib/prisma"
import { Trophy, Flame, Medal, Star } from "lucide-react"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

export default async function LeaderboardPage() {
  const users = await prisma.user.findMany({
    where: {
      role: "STUDENT",
      xp: { gt: 0 }
    },
    orderBy: [
      { xp: "desc" },
      { streak: "desc" }
    ],
    take: 10,
    select: {
      id: true,
      name: true,
      image: true,
      xp: true,
      streak: true
    }
  })

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-8 md:p-12">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 p-12 text-white shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-sm font-black uppercase tracking-widest">
                <Trophy className="w-5 h-5 text-yellow-300" />
                Bảng xếp hạng
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight">Top Học Viên Xuất Sắc</h1>
              <p className="text-purple-100 font-medium max-w-lg">
                Thi đua học tập để nhận điểm XP, duy trì chuỗi ngày học liên tiếp và ghi danh lên bảng vàng của BeLearning.
              </p>
            </div>
            <div className="w-32 h-32 md:w-48 md:h-48 relative">
              {/* Decorative 3D trophy or abstract element could go here. For now, large icon */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-[2rem] border border-white/20 shadow-2xl rotate-3 flex items-center justify-center">
                 <Trophy className="w-16 h-16 md:w-24 md:h-24 text-yellow-300 drop-shadow-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Top 3 Podium (Desktop) */}
        {users.length >= 3 && (
          <div className="hidden md:flex items-end justify-center gap-6 pt-10 pb-8">
            {/* Rank 2 */}
            <PodiumCard user={users[1]} rank={2} color="from-zinc-300 to-zinc-400" height="h-48" />
            {/* Rank 1 */}
            <PodiumCard user={users[0]} rank={1} color="from-yellow-300 to-yellow-500" height="h-64" isWinner />
            {/* Rank 3 */}
            <PodiumCard user={users[2]} rank={3} color="from-orange-300 to-orange-500" height="h-40" />
          </div>
        )}

        {/* List Ranking */}
        <div className="bg-white rounded-[3rem] p-4 md:p-8 shadow-xl shadow-zinc-200/50 border border-zinc-100">
          <div className="space-y-4">
            {users.map((user, index) => (
              <div 
                key={user.id} 
                className={cn(
                  "flex items-center justify-between p-4 md:p-6 rounded-[2rem] transition-all border border-transparent hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 group",
                  index < 3 ? "bg-gradient-to-r from-zinc-50 to-white" : "bg-white"
                )}
              >
                <div className="flex items-center gap-6">
                  {/* Rank Badge */}
                  <div className={cn(
                    "w-12 h-12 md:w-16 md:h-16 rounded-[1.5rem] flex items-center justify-center text-xl md:text-2xl font-black shadow-sm shrink-0",
                    index === 0 ? "bg-yellow-100 text-yellow-600 border border-yellow-200" :
                    index === 1 ? "bg-zinc-100 text-zinc-600 border border-zinc-200" :
                    index === 2 ? "bg-orange-100 text-orange-600 border border-orange-200" :
                    "bg-zinc-50 text-zinc-400"
                  )}>
                    {index === 0 ? <Medal className="w-8 h-8" /> : `#${index + 1}`}
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="font-black text-zinc-900 md:text-lg group-hover:text-indigo-600 transition-colors">
                      {user.name || "Học viên ẩn danh"}
                    </span>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1.5 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
                        <Star className="w-3.5 h-3.5 text-indigo-500 fill-current" />
                        <span className="text-[10px] md:text-xs font-black text-indigo-600">{user.xp} XP</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-orange-50 px-2 py-0.5 rounded-lg border border-orange-100">
                        <Flame className="w-3.5 h-3.5 text-[#FF6600] fill-current" />
                        <span className="text-[10px] md:text-xs font-black text-[#FF6600]">{user.streak} chuỗi</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {users.length === 0 && (
              <div className="text-center py-20">
                <Trophy className="w-16 h-16 text-zinc-200 mx-auto mb-4" />
                <p className="text-zinc-500 font-bold">Chưa có ai ghi danh lên bảng xếp hạng.</p>
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  )
}

function PodiumCard({ user, rank, color, height, isWinner = false }: { user: any, rank: number, color: string, height: string, isWinner?: boolean }) {
  if (!user) return null;
  return (
    <div className="flex flex-col items-center group">
      <div className={cn(
        "relative w-20 h-20 md:w-24 md:h-24 rounded-[2rem] border-4 border-white shadow-xl mb-4 bg-zinc-100 flex items-center justify-center font-black text-2xl text-zinc-400",
        isWinner && "w-24 h-24 md:w-32 md:h-32 -translate-y-4"
      )}>
        {/* Avatar Placeholder */}
        {user.name?.charAt(0) || "?"}
        {isWinner && (
          <div className="absolute -top-6 bg-white rounded-full p-2 shadow-lg animate-bounce">
            <Trophy className="w-6 h-6 text-yellow-500" />
          </div>
        )}
      </div>
      <div className={cn(
        "w-28 md:w-40 rounded-t-[2rem] flex flex-col items-center justify-start pt-6 shadow-2xl relative overflow-hidden transition-all group-hover:-translate-y-2",
        height,
        `bg-gradient-to-t ${color}`
      )}>
        <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" />
        <span className="relative z-10 text-white font-black text-3xl opacity-80">#{rank}</span>
        <span className="relative z-10 text-white font-bold text-sm mt-2 px-2 text-center truncate w-full">{user.name}</span>
        <span className="relative z-10 text-white font-black text-lg">{user.xp} XP</span>
      </div>
    </div>
  )
}
