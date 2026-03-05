export default function FirebaseImageLoader() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-backgroundGrey z-10">
      <div className="relative flex items-center justify-center">
        <span
          className="absolute inline-flex h-12 w-12 rounded-full bg-purpleColor/20"
          style={{ animation: 'ping 1.4s cubic-bezier(0,0,0.2,1) infinite' }}
          aria-hidden="true"
        />
        <svg
          className="h-8 w-8 text-purpleColor"
          style={{ animation: 'spin 1s linear infinite' }}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="12" cy="12" r="10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="40 20"
            opacity="0.25"
          />
          <path
            d="M12 2a10 10 0 0 1 10 10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="flex items-center gap-1" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1 w-1 rounded-full bg-purpleColor/50"
            style={{ animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </div>
    </div>
  )
}
