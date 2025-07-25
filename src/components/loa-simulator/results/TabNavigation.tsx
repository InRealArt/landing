'use client'

import { useLanguageStore } from '@/store/languageStore'
import TabNavigation, { TabItem } from '@/components/common/TabNavigation'

interface TabNavigationProps {
  activeTab: 'summary' | 'lease' | 'comparison' | 'tax'
  onTabChange: (tab: 'summary' | 'lease' | 'comparison' | 'tax') => void
}

export default function LoaTabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const { t } = useLanguageStore()
  
  const tabs: TabItem<'summary' | 'lease' | 'comparison' | 'tax'>[] = [
    { id: 'summary', label: t('loaSimulator.results.tabs.summary') },
    { id: 'lease', label: t('loaSimulator.results.tabs.lease') },
    { id: 'comparison', label: t('loaSimulator.results.tabs.comparison') },
    { id: 'tax', label: t('loaSimulator.results.tabs.tax') }
  ]

  return (
    <TabNavigation
      activeTab={activeTab}
      onTabChange={onTabChange}
      tabs={tabs}
    />
  )
} 