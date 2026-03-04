import SkeletonSlider from './SkeletonSlider'

export default function TeamSkeleton() {
  return (
    <section className="mt-36 max-w-screen-2xl m-auto">
      <div className="max-w-90 xl:max-w-screen-xl md:flex justify-between w-full m-auto items-center">
        <div className="h-12 bg-gray-300 animate-pulse rounded-md w-64" />
      </div>
      <SkeletonSlider context="team" additionnalClassName="relative bg-gradient" />
    </section>
  )
}
