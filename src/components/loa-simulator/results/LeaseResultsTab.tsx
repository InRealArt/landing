'use client'

import { CheckCircle, ArrowRight } from 'lucide-react'
import { useLanguageStore } from '@/store/languageStore'
import { type ArtworkLeaseResults, formatCurrency } from '@/utils/artworkLeaseCalculations'

interface LeaseResultsTabProps {
  leaseResults: ArtworkLeaseResults
}

export default function LeaseResultsTab({ leaseResults }: LeaseResultsTabProps) {
  const { t } = useLanguageStore()

  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-6 font-bricolage">{t('loaSimulator.results.lease.title')}</h2>
      
      <div className="space-y-6">
        {/* Paiements mensuels */}
        <div className="bg-white/10 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-white mb-4 font-bricolage">{t('loaSimulator.results.lease.monthlyPayments')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
              <span className="text-white/70 font-unbounded">{t('loaSimulator.results.lease.firstMonth')}</span>
              <span className="text-white font-semibold text-lg font-unbounded">{formatCurrency(leaseResults.firstMonthRent)}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
              <span className="text-white/70 font-unbounded">{t('loaSimulator.results.lease.followingMonths')}</span>
              <span className="text-white font-semibold text-lg font-unbounded">{formatCurrency(leaseResults.monthlyRent)}</span>
            </div>
          </div>
        </div>

        {/* Détail financier */}
        <div className="bg-white/10 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-white mb-4 font-bricolage">{t('loaSimulator.results.lease.financialDetails')}</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-white/20">
              <span className="text-white/70 font-unbounded">{t('loaSimulator.results.lease.totalLeaseAmount')}</span>
              <span className="text-white font-semibold font-unbounded">{formatCurrency(leaseResults.totalLeaseAmount)}</span>
            </div>
            
            <div className="flex justify-between py-2 border-b border-white/20">
              <span className="text-white/70 font-unbounded">{t('loaSimulator.results.lease.purchaseOption')}</span>
              <span className="text-white font-semibold font-unbounded">{formatCurrency(leaseResults.purchaseOption)}</span>
            </div>
            
            <div className="flex justify-between py-2 border-b border-white/20">
              <span className="text-white/70 font-unbounded">{t('loaSimulator.results.lease.totalCostWithPurchase')}</span>
              <span className="text-white font-semibold font-unbounded">{formatCurrency(leaseResults.totalCostWithPurchase)}</span>
            </div>
          </div>
        </div>

        {/* Économies fiscales */}
        <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-xl p-4 border border-green-500/30">
          <h3 className="text-lg font-semibold text-white mb-4 font-bricolage">{t('loaSimulator.results.lease.taxSavings')}</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2">
              <span className="text-green-300 font-unbounded">{t('loaSimulator.results.lease.taxSavings')}</span>
              <span className="text-green-300 font-bold text-lg font-unbounded">{formatCurrency(leaseResults.taxSavings)}</span>
            </div>
            
            <div className="flex justify-between py-2 border-t border-green-500/30">
              <span className="text-white/70 font-unbounded">{t('loaSimulator.results.lease.netCostAfterTax')}</span>
              <span className="text-white font-bold text-lg font-unbounded">{formatCurrency(leaseResults.netCostAfterTax)}</span>
            </div>
          </div>
        </div>

        {/* Options en fin de bail */}
        {/* <div className="bg-white/10 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-white mb-4 font-bricolage">{t('loaSimulator.results.lease.endOfLeaseOptions')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3 bg-white/10 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
              <div>
                <div className="text-white font-semibold font-unbounded">{t('loaSimulator.results.lease.returnArtwork')}</div>
                <div className="text-white/70 text-sm font-unbounded">{t('loaSimulator.results.lease.returnDescription')}</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-white/10 rounded-lg">
              <ArrowRight className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <div className="text-white font-semibold font-unbounded">{t('loaSimulator.results.lease.purchaseArtwork')}</div>
                <div className="text-white/70 text-sm font-unbounded">{t('loaSimulator.results.lease.purchaseDescription')} {formatCurrency(leaseResults.purchaseOption)}</div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  )
} 