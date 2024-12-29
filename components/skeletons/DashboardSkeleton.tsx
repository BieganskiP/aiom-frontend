import { cn } from "@/lib/utils";

export function DashboardSkeleton() {
  return (
    <main className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <div className="h-8 w-40 bg-neutral-200 rounded animate-pulse mb-6" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Stats Cards Skeletons */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow">
              <div className="h-4 w-24 bg-neutral-200 rounded animate-pulse" />
              <div className="h-8 w-16 bg-neutral-200 rounded animate-pulse mt-2" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Charts Skeletons */}
          {[1, 2].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow">
              <div className="h-6 w-32 bg-neutral-200 rounded animate-pulse mb-4" />
              <div className="h-[300px] bg-neutral-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
