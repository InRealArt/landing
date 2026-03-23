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
      <div className="pt-6 border-t border-[var(--border-light)]">
        <Button
          action={handleSendPDF}
          disabled={isSendingPDF || !formData}
          additionalClassName={`w-full bg-purpleColor ${!formData || isSendingPDF ? 'opacity-40 cursor-not-allowed' : ''}`}
          center
          text={isSendingPDF ? t('loaSimulator.form.sendingPDF') : t('loaSimulator.form.sendPDF')}
          icon={isSendingPDF ? <div className="animate-spin h-4 w-4 border border-[var(--ink-black)] border-t-transparent" /> : <Send className="w-4 h-4" />}
          iconBefore
        />
      </div>
    </div>
  )
} 