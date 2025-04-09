const TeamCardSkeleton = ({ isSlider }: { isSlider?: boolean }) => {
  return (
    <div className={`p-4 border rounded-lg bg-cardBackground animate-pulse ${isSlider ? 'h-full' : 'h-auto'}`}>
      <div className={`bg-gray-300 w-full rounded-lg ${isSlider ? 'h-48 md:h-80' : 'h-80'}`} />
      <div className="mt-4 h-8 bg-gray-300 rounded w-3/4"></div>
      <div className="mt-2 h-6 bg-gray-300 rounded w-1/2"></div>
      <div className="flex mt-4 gap-3">
        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  )
}

export default TeamCardSkeleton 