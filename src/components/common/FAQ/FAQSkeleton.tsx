export default function FAQSkeleton() {
  return (
    <section className="w-full m-auto mt-36 flex flex-col md:flex-row gap-16 max-w-90 xl:max-w-screen-xl">
      <div className="w-full md:w-1/3">
        <div className="h-12 bg-gray-300 animate-pulse rounded-md w-3/4 mb-8" />
        <div className="h-4 bg-gray-300 animate-pulse rounded-md w-full mb-2" />
        <div className="h-4 bg-gray-300 animate-pulse rounded-md w-5/6 mb-8" />
        <div className="h-10 bg-gray-300 animate-pulse rounded-md w-40" />
      </div>
      <div className="h-full w-full md:w-2/3 space-y-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="border-b border-gray-200 pb-4">
            <div className="h-6 bg-gray-300 animate-pulse rounded-md w-full mb-2" />
          </div>
        ))}
      </div>
    </section>
  )
}
