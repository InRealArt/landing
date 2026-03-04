export default function PartnersSkeleton() {
  return (
    <section className="mt-12">
      <div className="text-center mb-8">
        <div className="h-10 bg-gray-300 animate-pulse rounded-md w-1/3 mx-auto mb-4" />
        <div className="h-6 bg-gray-300 animate-pulse rounded-md w-1/2 mx-auto" />
      </div>
      <div className="flex gap-6 overflow-hidden justify-center flex-wrap">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="p-4 border rounded-lg bg-cardBackground min-w-[200px] md:min-w-[250px] flex-shrink-0"
          >
            <div className="bg-gray-300 animate-pulse h-32 md:h-40 w-full rounded-lg mb-4" />
            <div className="h-4 bg-gray-300 animate-pulse rounded-md w-3/4 mb-2" />
          </div>
        ))}
      </div>
    </section>
  )
}
