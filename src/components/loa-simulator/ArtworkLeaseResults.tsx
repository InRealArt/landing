'use client'

import { useState } from 'react'
import { type ArtworkLeaseResults, type ArtworkLeaseComparison } from '@/utils/artworkLeaseCalculations'
import { useLanguageStore } from '@/store/languageStore'
import { toast } from 'sonner'
import { Send } from 'lucide-react'
import LoaTabNavigation from './results/TabNavigation'
import SummaryTab from './results/SummaryTab'
import LeaseResultsTab from './results/LeaseResultsTab'
import ComparisonTab from './results/ComparisonTab'
import TaxAdvantagesTab from './results/TaxAdvantagesTab'
import ActionButtons from './results/ActionButtons'
import Button from '../common/Button'

interface ArtworkLeaseResultsProps {
  leaseResults: ArtworkLeaseResults
  comparison: ArtworkLeaseComparison
  formData?: {
    company: string
    email: string
    phoneNumber: string
    taxRate: number
    artworkValue: number
    leaseDuration: number
    firstRentIncrease: boolean
  }
}

export default function ArtworkLeaseResults({ leaseResults, comparison, formData }: ArtworkLeaseResultsProps) {
  const { t } = useLanguageStore()
  const [activeTab, setActiveTab] = useState<'summary' | 'lease' | 'comparison' | 'tax'>('summary')
  const [isSendingPDF, setIsSendingPDF] = useState(false)

  const handleSendPDF = async () => {
    if (!formData) {
      toast.error(t('loaSimulator.toast.formDataRequired'))
      return
    }

    setIsSendingPDF(true)
    try {
      const response = await fetch('/api/loa-simulator/send-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData,
          leaseResults,
          comparison
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success(t('loaSimulator.toast.pdfSentSuccess'))
      } else {
        toast.error(result.message || t('loaSimulator.toast.pdfSentError'))
      }
    } catch (error) {
      console.error('Error sending PDF:', error)
      toast.error(t('loaSimulator.toast.pdfSentError'))
    } finally {
      setIsSendingPDF(false)
    }
  }

  const handlePreviewPDF = async () => {
    if (!formData) {
      toast.error(t('loaSimulator.toast.formDataRequired'))
      return
    }

    try {
      const response = await fetch('/api/loa-simulator/preview-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData,
          leaseResults,
          comparison
        }),
      })

      if (response.ok) {
        // Create a blob from the response and open it in a new tab
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        window.open(url, '_blank')

        // Clean up the blob URL after a short delay
        setTimeout(() => window.URL.revokeObjectURL(url), 1000)
      } else {
        const result = await response.json()
        toast.error(result.message || 'Failed to preview PDF')
      }
    } catch (error) {
      console.error('Error previewing PDF:', error)
      toast.error('Failed to preview PDF')
    }
  }

  return (
    <div className="space-y-6">
      <LoaTabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Blurred content container */}
      <div className="relative">

        {/* Content */}
        {/* <div className="blur-sm"> */}
          {activeTab === 'summary' && formData && (
            <SummaryTab
              leaseResults={leaseResults}
              comparison={comparison}
              formData={formData}
            />
          )}

          {activeTab === 'lease' && (
            <LeaseResultsTab leaseResults={leaseResults} />
          )}

          {activeTab === 'comparison' && (
            <ComparisonTab leaseResults={leaseResults} comparison={comparison} />
          )}

          {activeTab === 'tax' && (
            <TaxAdvantagesTab leaseResults={leaseResults} />
          )}
        {/* </div> */}
      </div>

      {/* Send PDF Button */}
      <div className="flex justify-center gap-4 pt-6">
        {/* Preview PDF Button (for debugging) */}
        {/* <button
          onClick={handlePreviewPDF}
          disabled={!formData}
          className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${!formData
            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
            : 'bg-gray-600 text-textColor hover:bg-gray-700 border border-gray-500'
            }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Preview PDF
        </button> */}

        <Button
          action={handleSendPDF}
          disabled={isSendingPDF || !formData}
          additionalClassName={`px-8 py-4 rounded-xl transition-all items-center ${!formData
            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-textColor hover:from-purple-600 hover:to-indigo-700'
            } ${isSendingPDF ? 'opacity-50 cursor-not-allowed' : ''}`}
          center
          text={isSendingPDF ? t('loaSimulator.form.sendingPDF') : t('loaSimulator.form.sendPDF')}
          icon={isSendingPDF ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> : <Send className="w-5 h-5" />}
          iconBefore
        />
      </div>
    </div>
  )
} 