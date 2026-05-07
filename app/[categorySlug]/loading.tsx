export default function CategoryLoading() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Skeleton */}
      <div className="relative h-[40vh] md:h-[55vh] bg-gray-200 animate-pulse" />

      {/* Filter Bar Skeleton */}
      <div className="sticky top-16 z-30 bg-white border-b border-black/5 px-6 py-4">
        <div className="flex gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-8 w-20 bg-gray-100 rounded-full animate-pulse" />
          ))}
        </div>
      </div>

      {/* Product Grid Skeleton */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-8 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-1 gap-y-12">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="flex flex-col">
              <div className="aspect-[3/4] bg-gray-100 animate-pulse mb-4" />
              <div className="flex flex-col items-center gap-2 px-2">
                <div className="h-2 w-12 bg-gray-100 animate-pulse rounded" />
                <div className="h-3 w-28 bg-gray-100 animate-pulse rounded" />
                <div className="h-3 w-16 bg-gray-100 animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
