'use client'

import { useLanguageStore } from '@/store/languageStore'
import { type ArtworkLeaseResults, formatCurrency } from '@/utils/artworkLeaseCalculations'

interface LeaseResultsTabProps {
  leaseResults: ArtworkLeaseResults
}

export default function LeaseResultsTab({ leaseResults }: LeaseResultsTabProps) {
  const { t } = useLanguageStore()

  return (
    <div className="space-y-4">
      <h2 className="text-[10px] uppercase tracking-[0.25em] text-[var(--gray-text)] mb-4">{t('loaSimulator.results.lease.title')}</h2>

      {/* Paiements mensuels */}
      <div className="border border-[var(--border-light)]">
        <div className="px-4 py-3 border-b border-[var(--border-light)] bg-[var(--soft-gray)]">
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-[var(--gray-text)]">{t('loaSimulator.results.lease.monthlyPayments')}</h3>
        </div>
        <div className="divide-y divide-[var(--border-light)]">
          <div className="flex justify-between items-center px-4 py-3">
            <span className="text-[11px] text-[var(--gray-text)]">{t('loaSimulator.results.lease.firstMonth')}</span>
            <span className="serif italic text-xl text-[var(--ink-black)]">{formatCurrency(leaseResults.firstMonthRent)}</span>
          </div>
          <div className="flex justify-between items-center px-4 py-3">
            <span className="text-[11px] text-[var(--gray-text)]">{t('loaSimulator.results.lease.followingMonths')}</span>
            <span className="serif italic text-xl text-[var(--ink-black)]">{formatCurrency(leaseResults.monthlyRent)}</span>
          </div>
          <div className="flex justify-between items-center px-4 py-3">
            <span className="text-[11px] text-[var(--gray-text)]">{t('loaSimulator.results.lease.totalLeaseAmount')}</span>
            <span className="text-[12px] text-[var(--ink-black)] font-medium">{formatCurrency(leaseResults.totalLeaseAmount)}</span>
          </div>
        </div>
      </div>

      {/* Économies fiscales */}
      <div className="border border-[var(--border-light)]">
        <div className="px-4 py-3 border-b border-[var(--border-light)] bg-[var(--soft-gray)]">
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-[var(--gray-text)]">{t('loaSimulator.results.lease.taxSavings')}</h3>
        </div>
        <div className="divide-y divide-[var(--border-light)]">
          <div className="flex justify-between items-center px-4 py-3">
            <span className="text-[11px] text-[var(--gray-text)]">{t('loaSimulator.results.lease.taxSavings')}</span>
            <span className="text-[12px] text-[var(--gold-accent)] font-medium">{formatCurrency(leaseResults.taxSavings)}</span>
          </div>
          <div className="flex justify-between items-center px-4 py-3 bg-[var(--ink-black)]">
            <span className="text-[11px] text-white/60">{t('loaSimulator.results.lease.netCostAfterTax')}</span>
            <span className="serif italic text-xl text-white">{formatCurrency(leaseResults.netCostAfterTax)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
