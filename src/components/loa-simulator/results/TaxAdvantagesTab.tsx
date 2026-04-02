'use client'

import { useTranslation } from '@/hooks/useTranslation'
import { type ArtworkLeaseResults, formatCurrency } from '@/utils/artworkLeaseCalculations'

interface TaxAdvantagesTabProps {
  leaseResults: ArtworkLeaseResults
}

export default function TaxAdvantagesTab({ leaseResults }: TaxAdvantagesTabProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      <h2 className="text-[10px] uppercase tracking-[0.25em] text-[var(--gray-text)] mb-4">{t('loaSimulator.results.tax.title')}</h2>

      {/* Total économies — bloc hero */}
      <div className="border border-[var(--ink-black)] bg-[var(--ink-black)] p-8 text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3">{t('loaSimulator.results.tax.totalTaxSavings')}</p>
        <p className="serif italic text-4xl text-[var(--gold-accent)]">
          {formatCurrency(leaseResults.taxSavings)}
        </p>
      </div>

      {/* Détail */}
      <div className="border border-[var(--border-light)]">
        <div className="px-4 py-3 border-b border-[var(--border-light)] bg-[var(--soft-gray)]">
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-[var(--gray-text)]">{t('loaSimulator.results.tax.taxAdvantagesDetail')}</h3>
        </div>
        <div className="divide-y divide-[var(--border-light)]">
          <div className="flex justify-between items-center px-4 py-3">
            <span className="text-[11px] text-[var(--gray-text)]">{t('loaSimulator.results.tax.monthlyDeduction')}</span>
            <span className="text-[12px] text-[var(--gold-accent)] font-medium">{formatCurrency(leaseResults.monthlyTaxDeduction)}</span>
          </div>
          <div className="flex justify-between items-center px-4 py-3">
            <span className="text-[11px] text-[var(--gray-text)]">{t('loaSimulator.results.tax.totalDeductibleRents')}</span>
            <span className="text-[12px] text-[var(--ink-black)] font-medium">{formatCurrency(leaseResults.totalLeaseAmount)}</span>
          </div>
          <div className="flex justify-between items-center px-4 py-3 bg-[var(--soft-gray)]">
            <span className="text-[11px] text-[var(--ink-black)]">{t('loaSimulator.results.tax.totalTaxSavingsLabel')}</span>
            <span className="serif italic text-xl text-[var(--gold-accent)]">{formatCurrency(leaseResults.taxSavings)}</span>
          </div>
        </div>
      </div>

      {/* À savoir */}
      <div className="border border-[var(--border-light)] p-5">
        <h4 className="text-[10px] uppercase tracking-[0.2em] text-[var(--gray-text)] mb-4">{t('loaSimulator.results.tax.goodToKnow')}</h4>
        <ul className="space-y-2">
          {['fullDeductibility', 'immediateAdvantage', 'noComplexDepreciation', 'positiveImpact'].map(key => (
            <li key={key} className="flex items-start gap-2 text-[12px] text-[var(--gray-text)] leading-loose">
              <span className="text-[var(--gold-accent)] mt-0.5">—</span>
              {t(`loaSimulator.results.tax.benefits.${key}` as any)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
