'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'
import { useLanguageStore } from '@/store/languageStore'
import { type ArtworkLeaseResults, type ArtworkLeaseComparison, formatCurrency } from '@/utils/artworkLeaseCalculations'

interface ComparisonTabProps {
  leaseResults: ArtworkLeaseResults
  comparison: ArtworkLeaseComparison
}

export default function ComparisonTab({ leaseResults, comparison }: ComparisonTabProps) {
  const { t } = useLanguageStore()
  const isLeasingAdvantage = comparison.savings > 0

  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-6 font-bricolage">{t('loaSimulator.results.comparison.title')}</h2>
      
      <div className="space-y-6">
        {/* Résumé de l'avantage */}
        <div className={`rounded-xl p-4 border ${
          isLeasingAdvantage 
            ? 'bg-green-900/30 border-green-500/30' 
            : 'bg-red-900/30 border-red-500/30'
        }`}>
          <div className="flex items-center gap-3 mb-2">
            {isLeasingAdvantage ? (
              <TrendingUp className="w-6 h-6 text-green-400" />
            ) : (
              <TrendingDown className="w-6 h-6 text-red-400" />
            )}
            <h3 className="text-lg font-semibold text-white font-bricolage">
              {isLeasingAdvantage 
                ? t('loaSimulator.results.comparison.leaseAdvantage')
                : t('loaSimulator.results.comparison.purchaseAdvantage')
              }
            </h3>
          </div>
          
          <p className="text-white font-unbounded">
            {isLeasingAdvantage 
              ? t('loaSimulator.results.comparison.savingsWithLeasing').replace('{amount}', formatCurrency(Math.abs(comparison.savings)))
              : t('loaSimulator.results.comparison.savingsWithPurchase').replace('{amount}', formatCurrency(Math.abs(comparison.savings)))
            }
          </p>
          
          <p className="text-sm text-white/70 mt-1 font-unbounded">
            {Math.abs(comparison.savingsPercentage).toFixed(1)}% {t('loaSimulator.results.comparison.savingsPercentage')}
          </p>
        </div>

        {/* Comparaison détaillée */}
        <div className="bg-white/10 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-white mb-4 font-bricolage">{t('loaSimulator.results.comparison.detailedComparison')}</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-3 text-white/70 font-unbounded">{t('loaSimulator.results.comparison.criteria')}</th>
                  <th className="text-right py-3 text-white/70 font-unbounded">{t('loaSimulator.results.comparison.leasingWithPurchase')}</th>
                  <th className="text-right py-3 text-white/70 font-unbounded">{t('loaSimulator.results.comparison.directPurchase')}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/20">
                  <td className="py-3 text-white font-unbounded">{t('loaSimulator.results.comparison.costBeforeTax')}</td>
                  <td className="py-3 text-right text-white font-unbounded">{formatCurrency(leaseResults.totalCostWithPurchase)}</td>
                  <td className="py-3 text-right text-white font-unbounded">{formatCurrency(comparison.purchasePrice)}</td>
                </tr>
                
                <tr className="border-b border-white/20">
                  <td className="py-3 text-green-300 font-unbounded">{t('loaSimulator.results.comparison.taxSavings')}</td>
                  <td className="py-3 text-right text-green-300 font-unbounded">-{formatCurrency(leaseResults.taxSavings)}</td>
                  <td className="py-3 text-right text-white/70 font-unbounded">€0.00</td>
                </tr>
                
                <tr className="bg-white/10">
                  <td className="py-3 text-white font-semibold font-unbounded">{t('loaSimulator.results.comparison.finalNetCost')}</td>
                  <td className="py-3 text-right text-white font-semibold font-unbounded">{formatCurrency(leaseResults.netCostAfterTax)}</td>
                  <td className="py-3 text-right text-white font-semibold font-unbounded">{formatCurrency(comparison.purchasePrice)}</td>
                </tr>
                
                <tr>
                  <td className="py-3 text-white font-bold font-unbounded">{t('loaSimulator.results.comparison.difference')}</td>
                  <td className="py-3 text-right font-bold font-unbounded" colSpan={2}>
                    <span className={isLeasingAdvantage ? 'text-green-300' : 'text-red-300'}>
                      {isLeasingAdvantage ? '-' : '+'}{formatCurrency(Math.abs(comparison.savings))}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Avantages du leasing vs achat */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-4 font-bricolage">{t('loaSimulator.results.comparison.leasingAdvantages')}</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2 text-white/90 font-unbounded">
                <span className="text-green-400 mt-1">•</span>
                {t('loaSimulator.results.comparison.leasingBenefits.taxDeductibility')}
              </li>
              <li className="flex items-start gap-2 text-white/90 font-unbounded">
                <span className="text-green-400 mt-1">•</span>
                {t('loaSimulator.results.comparison.leasingBenefits.noCapitalImmobilization')}
              </li>
              <li className="flex items-start gap-2 text-white/90 font-unbounded">
                <span className="text-green-400 mt-1">•</span>
                {t('loaSimulator.results.comparison.leasingBenefits.flexibility')}
              </li>
              <li className="flex items-start gap-2 text-white/90 font-unbounded">
                <span className="text-green-400 mt-1">•</span>
                {t('loaSimulator.results.comparison.leasingBenefits.artworkRenewal')}
              </li>
            </ul>
          </div>
          
          <div className="bg-white/10 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-4 font-bricolage">{t('loaSimulator.results.comparison.purchaseAdvantages')}</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2 text-white/90 font-unbounded">
                <span className="text-blue-400 mt-1">•</span>
                {t('loaSimulator.results.comparison.purchaseBenefits.immediateOwnership')}
              </li>
              <li className="flex items-start gap-2 text-white/90 font-unbounded">
                <span className="text-blue-400 mt-1">•</span>
                {t('loaSimulator.results.comparison.purchaseBenefits.capitalGains')}
              </li>
              <li className="flex items-start gap-2 text-white/90 font-unbounded">
                <span className="text-blue-400 mt-1">•</span>
                {t('loaSimulator.results.comparison.purchaseBenefits.depreciation')}
              </li>
              <li className="flex items-start gap-2 text-white/90 font-unbounded">
                <span className="text-blue-400 mt-1">•</span>
                {t('loaSimulator.results.comparison.purchaseBenefits.noConstraints')}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 