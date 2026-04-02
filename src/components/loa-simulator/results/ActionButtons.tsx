'use client'

import { useState } from 'react'
import { Download, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslation } from '@/hooks/useTranslation'
import { generateLeaseResultsPDF } from '@/utils/pdfGenerator'
import { type ArtworkLeaseResults, type ArtworkLeaseComparison } from '@/utils/artworkLeaseCalculations'

interface ActionButtonsProps {
  leaseResults: ArtworkLeaseResults
  comparison: ArtworkLeaseComparison
  formData: {
    company: string
    email: string
    phoneNumber: string
    taxRate: number
    artworkValue: number
    leaseDuration: number
    firstRentIncrease: boolean
    amountType: 'HT' | 'TTC'
  }
}

export default function ActionButtons({ leaseResults, comparison, formData }: ActionButtonsProps) {
  const { t } = useTranslation()
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true)
    try {
      await generateLeaseResultsPDF({
        leaseResults,
        comparison,
        formData
      })
      toast.success(t('loaSimulator.toast.pdfGenerationSuccess'))
    } catch (error) {
      toast.error(t('loaSimulator.toast.pdfGenerationError'))
      console.error('PDF generation error:', error)
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  return (
    <div className="bg-backgroundColor/30 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-2xl">
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleGeneratePDF}
          disabled={isGeneratingPDF}
          className={`flex-1 text-textColor font-medium py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 font-unbounded ${
            isGeneratingPDF 
              ? 'bg-backgroundColor/10 cursor-not-allowed opacity-50' 
              : 'bg-backgroundColor/20 hover:bg-backgroundColor/30'
          }`}
        >
          {isGeneratingPDF ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              {t('loaSimulator.form.generating')}
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              {t('loaSimulator.form.sendPDF')}
            </>
          )}
        </button>
        
        <button
          onClick={() => window.print()}
          className="flex-1 bg-backgroundColor/10 text-textColor font-medium py-3 px-6 rounded-xl transition-all hover:bg-backgroundColor/20 flex items-center justify-center gap-2 font-unbounded"
        >
          <FileText className="w-5 h-5" />
          Print
        </button>
      </div>
    </div>
  )
} 