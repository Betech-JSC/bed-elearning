export default function AdminDashboardLoading() {
  return (
    <div className="space-y-10 animate-pulse">
      <div>
        <div className="h-9 w-64 bg-zinc-200 dark:bg-zinc-800 rounded-xl mb-3" />
        <div className="h-4 w-96 bg-zinc-100 dark:bg-zinc-900 rounded-lg" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-3 w-28 bg-zinc-100 dark:bg-zinc-800 rounded" />
              <div className="h-7 w-36 bg-zinc-200 dark:bg-zinc-700 rounded-lg" />
            </div>
            <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-xl" />
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border">
            <div className="h-5 w-48 bg-zinc-200 dark:bg-zinc-700 rounded mb-8" />
            <div className="h-[300px] bg-zinc-50 dark:bg-zinc-800 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  )
}
