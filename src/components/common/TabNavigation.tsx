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
      <div className="flex overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 py-3 px-4 text-xs uppercase tracking-[0.2em] font-montserrat transition-colors duration-300 ${
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