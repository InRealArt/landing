'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { type ArtworkLeaseResults, type ArtworkLeaseComparison, formatCurrency } from '@/utils/artworkLeaseCalculations'

interface ComparisonTabProps {
  leaseResults: ArtworkLeaseResults
  comparison: ArtworkLeaseComparison
}

export default function ComparisonTab({ leaseResults, comparison }: ComparisonTabProps) {
  const { t } = useTranslation()
  const isLeasingAdvantage = comparison.savings > 0

  return (
    <div className="space-y-4">
      <h2 className="text-xs uppercase tracking-[0.25em] text-[var(--gray-text)] mb-4">{t('loaSimulator.results.comparison.title')}</h2>

      {/* Résumé de l'avantage */}
      <div className={`border p-4 flex items-start gap-3 ${isLeasingAdvantage ? 'border-[var(--gold-accent)]/40 bg-[var(--soft-gray)]' : 'border-[var(--border-light)]'}`}>
        {isLeasingAdvantage ? (
          <TrendingUp className="w-4 h-4 text-[var(--gold-accent)] mt-0.5 flex-shrink-0" />
        ) : (
          <TrendingDown className="w-4 h-4 text-[var(--gray-text)] mt-0.5 flex-shrink-0" />
        )}
        <div>
          <p className="text-sm uppercase tracking-[0.15em] text-[var(--ink-black)] mb-1">
            {isLeasingAdvantage
              ? t('loaSimulator.results.comparison.leaseAdvantage')
              : t('loaSimulator.results.comparison.purchaseAdvantage')
            }
          </p>
          <p className="text-sm text-[var(--gray-text)]">
            {isLeasingAdvantage
              ? t('loaSimulator.results.comparison.savingsWithLeasing').replace('{amount}', formatCurrency(Math.abs(comparison.savings)))
              : t('loaSimulator.results.comparison.savingsWithPurchase').replace('{amount}', formatCurrency(Math.abs(comparison.savings)))
            }
          </p>
          <p className="text-xs text-[var(--gray-text)] mt-1">
            {Math.abs(comparison.savingsPercentage).toFixed(1)}% {t('loaSimulator.results.comparison.savingsPercentage')}
          </p>
        </div>
      </div>

      {/* Tableau comparatif */}
      <div className="border border-[var(--border-light)]">
        <div className="px-4 py-3 border-b border-[var(--border-light)] bg-[var(--soft-gray)]">
          <h3 className="text-xs uppercase tracking-[0.2em] text-[var(--gray-text)]">{t('loaSimulator.results.comparison.detailedComparison')}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border-light)]">
                <th className="text-left px-4 py-3 text-xs uppercase tracking-[0.2em] text-[var(--gray-text)] font-normal">{t('loaSimulator.results.comparison.criteria')}</th>
                <th className="text-right px-4 py-3 text-xs uppercase tracking-[0.2em] text-[var(--gray-text)] font-normal">{t('loaSimulator.results.comparison.leasingWithPurchase')}</th>
                <th className="text-right px-4 py-3 text-xs uppercase tracking-[0.2em] text-[var(--gray-text)] font-normal">{t('loaSimulator.results.comparison.directPurchase')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-light)]">
              <tr>
                <td className="px-4 py-3 text-sm text-[var(--gray-text)]">{t('loaSimulator.results.comparison.costBeforeTax')}</td>
                <td className="px-4 py-3 text-right text-sm text-[var(--ink-black)]">{formatCurrency(leaseResults.totalLeaseAmount)}</td>
                <td className="px-4 py-3 text-right text-sm text-[var(--ink-black)]">{formatCurrency(comparison.purchasePrice)}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-[var(--gold-accent)]">{t('loaSimulator.results.comparison.taxSavings')}</td>
                <td className="px-4 py-3 text-right text-sm text-[var(--gold-accent)]">-{formatCurrency(leaseResults.taxSavings)}</td>
                <td className="px-4 py-3 text-right text-sm text-[var(--gray-text)]">€0.00</td>
              </tr>
              <tr className="bg-[var(--soft-gray)]">
                <td className="px-4 py-3 text-sm text-[var(--ink-black)] font-medium">{t('loaSimulator.results.comparison.finalNetCost')}</td>
                <td className="px-4 py-3 text-right text-sm text-[var(--ink-black)] font-medium">{formatCurrency(leaseResults.netCostAfterTax)}</td>
                <td className="px-4 py-3 text-right text-sm text-[var(--ink-black)] font-medium">{formatCurrency(comparison.purchasePrice)}</td>
              </tr>
              <tr className="bg-[var(--ink-black)]">
                <td className="px-4 py-3 text-sm text-white/60 uppercase tracking-[0.15em]">{t('loaSimulator.results.comparison.difference')}</td>
                <td className="px-4 py-3 text-right" colSpan={2}>
                  <span className={`serif italic text-xl ${isLeasingAdvantage ? 'text-[var(--gold-accent)]' : 'text-white'}`}>
                    {isLeasingAdvantage ? '-' : '+'}{formatCurrency(Math.abs(comparison.savings))}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Avantages leasing vs achat */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-[var(--border-light)] p-5">
          <h3 className="text-xs uppercase tracking-[0.2em] text-[var(--gray-text)] mb-4">{t('loaSimulator.results.comparison.leasingAdvantages')}</h3>
          <ul className="space-y-2">
            {['taxDeductibility', 'noCapitalImmobilization', 'flexibility', 'artworkRenewal'].map(key => (
              <li key={key} className="flex items-start gap-2 text-sm text-[var(--gray-text)] leading-loose">
                <span className="text-[var(--gold-accent)] mt-0.5">—</span>
                {t(`loaSimulator.results.comparison.leasingBenefits.${key}` as any)}
              </li>
            ))}
          </ul>
        </div>
        <div className="border border-[var(--border-light)] p-5">
          <h3 className="text-xs uppercase tracking-[0.2em] text-[var(--gray-text)] mb-4">{t('loaSimulator.results.comparison.purchaseAdvantages')}</h3>
          <ul className="space-y-2">
            {['immediateOwnership', 'capitalGains', 'depreciation', 'noConstraints'].map(key => (
              <li key={key} className="flex items-start gap-2 text-sm text-[var(--gray-text)] leading-loose">
                <span className="text-[var(--ink-black)] mt-0.5">—</span>
                {t(`loaSimulator.results.comparison.purchaseBenefits.${key}` as any)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
