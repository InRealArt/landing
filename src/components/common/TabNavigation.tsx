'use client'

export interface TabItem<T extends string = string> {
  id: T
  label: string
}

interface TabNavigationProps<T extends string = string> {
  activeTab: T
  onTabChange: (tab: T) => void
  tabs: TabItem<T>[]
  className?: string
}

export default function TabNavigation<T extends string = string>({ 
  activeTab, 
  onTabChange, 
  tabs, 
  className = "" 
}: TabNavigationProps<T>) {
  return (
    <div className={`border border-[var(--border-light)] overflow-hidden ${className}`}>
      <div className="grid grid-cols-2 sm:flex sm:overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 min-h-11 py-3 px-3 sm:px-4 text-xs sm:whitespace-nowrap max-sm:[&:nth-child(-n+2)]:border-b border-[var(--border-light)] uppercase tracking-[0.12em] sm:tracking-[0.2em] font-montserrat transition-colors duration-300 ${
              activeTab === tab.id
                ? 'bg-[var(--ink-black)] text-white'
                : 'text-[var(--gray-text)] hover:text-[var(--ink-black)] hover:bg-[var(--canvas-bg)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
} 