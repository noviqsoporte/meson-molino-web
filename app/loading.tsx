export default function Loading() {
  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      {/* Navbar Skeleton */}
      <div className="h-20 w-full bg-brand-bg relative z-50 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
        <div className="hidden md:flex gap-6">
          <div className="h-6 w-24 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </div>

      {/* Hero Skeleton */}
      <div className="h-screen min-h-[600px] w-full bg-gray-200 animate-pulse -mt-20"></div>

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="h-12 w-64 bg-gray-200 animate-pulse rounded mx-auto mb-16"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-96 bg-gray-200 animate-pulse rounded-xl"></div>
          ))}
        </div>
      </div>
    </div>
  )
}
