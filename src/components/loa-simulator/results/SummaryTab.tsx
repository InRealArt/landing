'use client'

import { useLanguageStore } from '@/store/languageStore'
import { type ArtworkLeaseResults, type ArtworkLeaseComparison, formatCurrency } from '@/utils/artworkLeaseCalculations'
import { textSimulatorClassName } from '@/utils/classes'

interface SummaryTabProps {
  leaseResults: ArtworkLeaseResults
  comparison: ArtworkLeaseComparison
  formData: {
    company: string
    email: string
    taxRate: number
    artworkValue: number
    leaseDuration: number
    firstRentIncrease: boolean
  }
}

export default function SummaryTab({ leaseResults, comparison, formData }: SummaryTabProps) {
  const { t } = useLanguageStore()
  return (
    <div className="space-y-0">
      <h2 className="text-[10px] uppercase tracking-[0.25em] text-[var(--gray-text)] mb-4">{t('loaSimulator.results.summary.title')}</h2>

      <div className="divide-y divide-[var(--border-light)] border border-[var(--border-light)]">
        <div className="grid grid-cols-2">
          <div className="flex justify-between items-center px-4 py-3 border-r border-[var(--border-light)]">
            <span className="text-[11px] text-[var(--gray-text)]">{t('loaSimulator.results.summary.email')}</span>
            <span className="text-[11px] text-[var(--ink-black)] font-medium truncate ml-2">{formData.email}</span>
          </div>
          <div className="flex justify-between items-center px-4 py-3">
            <span className="text-[11px] text-[var(--gray-text)]">{t('loaSimulator.results.summary.company')}</span>
            <span className="text-[11px] text-[var(--ink-black)] font-medium">{formData.company}</span>
          </div>
        </div>

        <div className="grid grid-cols-2">
          <div className="flex justify-between items-center px-4 py-3 border-r border-[var(--border-light)]">
            <span className="text-[11px] text-[var(--gray-text)]">{t('loaSimulator.results.summary.taxRate')}</span>
            <span className="text-[11px] text-[var(--ink-black)] font-medium">{formData.taxRate}%</span>
          </div>
          <div className="flex justify-between items-center px-4 py-3">
            <span className="text-[11px] text-[var(--gray-text)]">{t('loaSimulator.results.summary.artworkValue')}</span>
            <span className="text-[11px] text-[var(--ink-black)] font-medium">{formatCurrency(formData.artworkValue)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2">
          <div className="flex justify-between items-center px-4 py-3 border-r border-[var(--border-light)]">
            <span className="text-[11px] text-[var(--gray-text)]">{t('loaSimulator.results.summary.leaseDuration')}</span>
            <span className="text-[11px] text-[var(--ink-black)] font-medium">{formData.leaseDuration} {t('loaSimulator.results.summary.months')}</span>
          </div>
          <div className="flex justify-between items-center px-4 py-3">
            <span className="text-[11px] text-[var(--gray-text)]">{t('loaSimulator.results.summary.firstRentIncrease')}</span>
            <span className="text-[11px] text-[var(--ink-black)] font-medium">{formData.firstRentIncrease ? t('loaSimulator.results.summary.yes') : t('loaSimulator.results.summary.no')}</span>
          </div>
        </div>

        <div className="flex justify-between items-center px-4 py-3">
          <span className="text-[11px] text-[var(--gray-text)]">{t('loaSimulator.results.summary.totalLeaseAmount')}</span>
          <span className="text-[11px] text-[var(--ink-black)] font-medium">{formatCurrency(leaseResults.totalLeaseAmount)}</span>
        </div>

        <div className="grid grid-cols-2">
          <div className="flex justify-between items-center px-4 py-3 border-r border-[var(--border-light)]">
            <span className="text-[11px] text-[var(--gray-text)]">{t('loaSimulator.results.summary.firstMonthRent')}</span>
            <span className="text-[11px] text-[var(--ink-black)] font-medium">{formatCurrency(leaseResults.firstMonthRent)}</span>
          </div>
          <div className="flex justify-between items-center px-4 py-3">
            <span className="text-[11px] text-[var(--gray-text)]">{t('loaSimulator.results.summary.monthlyRent')}</span>
            <span className="text-[11px] text-[var(--ink-black)] font-medium">{formatCurrency(leaseResults.monthlyRent)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2">
          <div className="flex justify-between items-center px-4 py-3 border-r border-[var(--border-light)] bg-[var(--soft-gray)]">
            <span className="text-[11px] text-[var(--gray-text)]">{t('loaSimulator.results.summary.taxSavings')}</span>
            <span className="text-[11px] text-[var(--gold-accent)] font-medium">{formatCurrency(leaseResults.taxSavings)}</span>
          </div>
          <div className="flex justify-between items-center px-4 py-3 bg-[var(--ink-black)]">
            <span className="text-[11px] text-white/60">{t('loaSimulator.results.summary.netCost')}</span>
            <span className="serif italic text-lg text-white">{formatCurrency(leaseResults.netCostAfterTax)}</span>
          </div>
        </div>
      </div>
    </div>
  )
} 