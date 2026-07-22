import { Skeleton } from "@/components/ui/skeleton"

export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-32" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
            </div>
            <Skeleton className="h-7 w-16 mb-1" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-100">
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <div className="divide-y divide-gray-100">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4">
              <Skeleton className="h-4 w-20 shrink-0" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-24 shrink-0" />
              <Skeleton className="h-4 w-28 shrink-0" />
              <Skeleton className="h-6 w-20 shrink-0 rounded-full" />
              <Skeleton className="h-4 w-10 shrink-0" />
              <Skeleton className="h-8 w-16 shrink-0 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
