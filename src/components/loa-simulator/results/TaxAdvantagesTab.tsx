'use client'

import { PiggyBank } from 'lucide-react'
import { useLanguageStore } from '@/store/languageStore'
import { type ArtworkLeaseResults, formatCurrency } from '@/utils/artworkLeaseCalculations'

interface TaxAdvantagesTabProps {
  leaseResults: ArtworkLeaseResults
}

export default function TaxAdvantagesTab({ leaseResults }: TaxAdvantagesTabProps) {
  const { t } = useLanguageStore()

  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-6 font-bricolage">{t('loaSimulator.results.tax.title')}</h2>
      
      <div className="space-y-6">
        <div className="text-center bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-xl p-6 border border-green-500/30">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
            <PiggyBank className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-2 font-bricolage">
            {formatCurrency(leaseResults.taxSavings)}
          </h3>
          <p className="text-white/70 font-unbounded">{t('loaSimulator.results.tax.totalTaxSavings')}</p>
        </div>

        <div className="bg-white/10 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-white mb-4 font-bricolage">{t('loaSimulator.results.tax.taxAdvantagesDetail')}</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-white/20">
              <span className="text-white/70 font-unbounded">{t('loaSimulator.results.tax.monthlyDeduction')}</span>
              <span className="text-green-300 font-semibold font-unbounded">{formatCurrency(leaseResults.monthlyTaxDeduction)}</span>
            </div>
            
            <div className="flex justify-between py-2 border-b border-white/20">
              <span className="text-white/70 font-unbounded">{t('loaSimulator.results.tax.totalDeductibleRents')}</span>
              <span className="text-white font-semibold font-unbounded">{formatCurrency(leaseResults.totalLeaseAmount)}</span>
            </div>
            
            <div className="flex justify-between py-2 bg-green-900/30 px-4 rounded-lg border border-green-500/30">
              <span className="text-white font-medium font-unbounded">{t('loaSimulator.results.tax.totalTaxSavingsLabel')}</span>
              <span className="text-green-300 font-bold text-lg font-unbounded">{formatCurrency(leaseResults.taxSavings)}</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-500/20 rounded-xl p-4 border border-blue-400/30">
          <h4 className="text-blue-300 font-bold mb-3 font-bricolage">{t('loaSimulator.results.tax.goodToKnow')}</h4>
          <ul className="space-y-2 text-sm text-blue-200">
            <li className="font-unbounded">• {t('loaSimulator.results.tax.benefits.fullDeductibility')}</li>
            <li className="font-unbounded">• {t('loaSimulator.results.tax.benefits.immediateAdvantage')}</li>
            <li className="font-unbounded">• {t('loaSimulator.results.tax.benefits.noComplexDepreciation')}</li>
            <li className="font-unbounded">• {t('loaSimulator.results.tax.benefits.positiveImpact')}</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 