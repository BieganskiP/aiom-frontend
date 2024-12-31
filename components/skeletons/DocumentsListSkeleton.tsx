export function DocumentsListSkeleton() {
  return (
    <main className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 w-40 bg-bg-700 rounded animate-pulse" />
          <div className="flex gap-2">
            <div className="h-9 w-32 bg-bg-700 rounded animate-pulse" />
            <div className="h-9 w-32 bg-bg-700 rounded animate-pulse" />
          </div>
        </div>

        <div className="bg-bg-800 rounded-lg">
          <div className="border-b border-bg-700 p-4">
            <div className="grid grid-cols-5 gap-4">
              <div className="h-4 w-32 bg-bg-700 rounded animate-pulse" />
              <div className="h-4 w-20 bg-bg-700 rounded animate-pulse" />
              <div className="h-4 w-24 bg-bg-700 rounded animate-pulse" />
              <div className="h-4 w-28 bg-bg-700 rounded animate-pulse" />
              <div className="h-4 w-10 bg-bg-700 rounded animate-pulse" />
            </div>
          </div>
          <div className="divide-y divide-bg-700">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-4">
                <div className="grid grid-cols-5 gap-4">
                  <div className="h-4 w-48 bg-bg-700 rounded animate-pulse" />
                  <div className="h-4 w-16 bg-bg-700 rounded animate-pulse" />
                  <div className="h-4 w-20 bg-bg-700 rounded animate-pulse" />
                  <div className="h-4 w-24 bg-bg-700 rounded animate-pulse" />
                  <div className="flex gap-2 justify-end">
                    <div className="h-8 w-8 bg-bg-700 rounded animate-pulse" />
                    <div className="h-8 w-8 bg-bg-700 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
