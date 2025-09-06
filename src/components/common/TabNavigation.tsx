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
    <div className={`bg-backgroundColor/30 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden shadow-2xl ${className}`}>
      <div className="flex overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors font-unbounded ${
              activeTab === tab.id
                ? 'bg-backgroundColor/20 text-textColor' 
                : 'text-textColor/70 hover:text-textColor hover:bg-backgroundColor/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
} 