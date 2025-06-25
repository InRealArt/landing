'use client'

import { useLanguageStore } from '@/store/languageStore'

interface TabNavigationProps {
  activeTab: 'summary' | 'lease' | 'comparison' | 'tax'
  onTabChange: (tab: 'summary' | 'lease' | 'comparison' | 'tax') => void
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const { t } = useLanguageStore()
  
  const tabs = [
    { id: 'summary' as const, label: t('loaSimulator.results.tabs.summary') },
    { id: 'lease' as const, label: t('loaSimulator.results.tabs.lease') },
    { id: 'comparison' as const, label: t('loaSimulator.results.tabs.comparison') },
    { id: 'tax' as const, label: t('loaSimulator.results.tabs.tax') }
  ]

  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden shadow-2xl">
      <div className="flex overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors font-unbounded ${
              activeTab === tab.id
                ? 'bg-white/20 text-white' 
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
} 