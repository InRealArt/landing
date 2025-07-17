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
    <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-6 font-bricolage">{t('loaSimulator.results.summary.title')}</h2>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between py-2 border-b border-white/20">
            <span className="font-medium text-white/70 font-unbounded">{t('loaSimulator.results.summary.email')}</span>
            <span className={textSimulatorClassName}>{formData.email}</span>
          </div>

          <div className="flex justify-between py-2 border-b border-white/20">
            <span className="font-medium text-white/70 font-unbounded">{t('loaSimulator.results.summary.company')}</span>
            <span className={textSimulatorClassName}>{formData.company}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between py-2 border-b border-white/20">
            <span className="font-medium text-white/70 font-unbounded">{t('loaSimulator.results.summary.taxRate')}</span>
            <span className={textSimulatorClassName}>{formData.taxRate}%</span>
          </div>

          <div className="flex justify-between py-2 border-b border-white/20">
            <span className="font-medium text-white/70 font-unbounded">{t('loaSimulator.results.summary.artworkValue')}</span>
            <span className={textSimulatorClassName}>{formatCurrency(formData.artworkValue)}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between py-2 border-b border-white/20">
            <span className="font-medium text-white/70 font-unbounded">{t('loaSimulator.results.summary.leaseDuration')}</span>
            <span className={textSimulatorClassName}>{formData.leaseDuration} {t('loaSimulator.results.summary.months')}</span>
          </div>

          <div className="flex justify-between py-2 border-b border-white/20">
            <span className="font-medium text-white/70 font-unbounded">{t('loaSimulator.results.summary.firstRentIncrease')}</span>
            <span className={textSimulatorClassName}>{formData.firstRentIncrease ? t('loaSimulator.results.summary.yes') : t('loaSimulator.results.summary.no')}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between py-2 border-b border-white/20">
            <span className="font-medium text-white/70 font-unbounded">{t('loaSimulator.results.summary.totalLeaseAmount')}</span>
            <span className={textSimulatorClassName}>{formatCurrency(leaseResults.totalLeaseAmount)}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between py-2 border-b border-white/20">
            <span className="font-medium text-white/70 font-unbounded">{t('loaSimulator.results.summary.firstMonthRent')}</span>
            <span className={textSimulatorClassName}>{formatCurrency(leaseResults.firstMonthRent)}</span>
          </div>

          <div className="flex justify-between py-2 border-b border-white/20">
            <span className="font-medium text-white/70 font-unbounded">{t('loaSimulator.results.summary.monthlyRent')}</span>
            <span className={textSimulatorClassName}>{formatCurrency(leaseResults.monthlyRent)}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between py-2 border-b border-white/20">
            <span className="font-medium text-white/70 font-unbounded">{t('loaSimulator.results.summary.taxSavings')}</span>
            <span className="text-green-300 font-semibold font-unbounded">{formatCurrency(leaseResults.taxSavings)}</span>
          </div>

          <div className="flex justify-between py-2 border-b border-white/20">
            <span className="font-medium text-white/70 font-unbounded">{t('loaSimulator.results.summary.netCost')}</span>
            <span className="text-white font-semibold font-unbounded">{formatCurrency(leaseResults.netCostAfterTax)}</span>
          </div>
        </div>
      </div>
    </div>
  )
} 