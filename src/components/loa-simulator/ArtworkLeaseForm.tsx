'use client'

import { useState } from 'react'
import { z } from 'zod'
import { toast } from 'sonner'
import { Calculator } from 'lucide-react'
import { useLanguageStore } from '@/store/languageStore'
import { isValidPhoneNumber } from 'react-phone-number-input'
import {
  calculateArtworkLease,
  compareWithDirectPurchase,
  validateArtworkLeaseInputs,
  ArtworkLeaseInputs,
  ArtworkLeaseResults,
  ArtworkLeaseComparison,
} from '@/utils/artworkLeaseCalculations'

import Button from '../common/Button'
import SimulatorInput from '../common/simulator/SimulatorInput'
import SimulatorSelect from '../common/simulator/SimulatorSelect'

interface ArtworkLeaseFormProps {
  onCalculate: (leaseResults: ArtworkLeaseResults, comparison: ArtworkLeaseComparison, formData: ArtworkLeaseInputs) => void
}

export default function ArtworkLeaseForm({ onCalculate }: ArtworkLeaseFormProps) {
  const { t } = useLanguageStore()

  const artworkLeaseSchema = z.object({
    company: z.string().min(1, t('loaSimulator.form.errors.companyRequired')),
    email: z.string().email(t('loaSimulator.form.errors.emailInvalid')),
    phoneNumber: z.string().min(1, t('loaSimulator.form.errors.phoneRequired')),
    taxRate: z.number().min(0, t('loaSimulator.form.errors.taxRateMin')).max(50, t('loaSimulator.form.errors.taxRateMax')),
    artworkValue: z.number().min(100, t('loaSimulator.form.errors.artworkValueMin')),
    leaseDuration: z.number().min(12, t('loaSimulator.form.errors.leaseDurationMin')).max(72, t('loaSimulator.form.errors.leaseDurationMax')),
    firstRentIncrease: z.boolean()
  })

  const [formData, setFormData] = useState({
    company: '',
    email: '',
    phoneNumber: '',
    taxRate: '',
    artworkValue: '',
    leaseDuration: '',
    firstRentIncrease: ''
  })

  const [isCalculating, setIsCalculating] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [lastCalculation, setLastCalculation] = useState<{
    leaseResults: ArtworkLeaseResults
    comparison: ArtworkLeaseComparison
    formData: ArtworkLeaseInputs
  } | null>(null)

  // Get translated options
  const firstRentOptions = [
    { value: 'false', label: t('loaSimulator.form.firstRentOptions.no') },
    { value: 'true', label: t('loaSimulator.form.firstRentOptions.yes') }
  ]

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handlePhoneChange = (value: string | number) => {
    setFormData(prev => ({ ...prev, phoneNumber: value as string }))

    // Clear phone error
    if (errors.phoneNumber) {
      setErrors(prev => ({ ...prev, phoneNumber: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCalculating(true)
    setErrors({})

    try {
      // Validate phone number first
      if (!formData.phoneNumber || !isValidPhoneNumber(formData.phoneNumber)) {
        setErrors(prev => ({ ...prev, phoneNumber: t('loaSimulator.form.errors.phoneInvalid') }))
        toast.error(t('loaSimulator.form.errors.phoneInvalid'))
        setIsCalculating(false)
        return
      }

      // Convert form data to proper types for validation
      const dataToValidate = {
        company: formData.company,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        taxRate: parseFloat(formData.taxRate) || 0,
        artworkValue: parseFloat(formData.artworkValue) || 0,
        leaseDuration: parseInt(formData.leaseDuration) || 0,
        firstRentIncrease: formData.firstRentIncrease === 'true',
      }

      // Validate with Zod
      const validatedData = artworkLeaseSchema.parse(dataToValidate)

      // Additional business logic validation
      const validationErrors = validateArtworkLeaseInputs(validatedData)
      if (validationErrors.length > 0) {
        toast.error(validationErrors[0])
        setIsCalculating(false)
        return
      }

      // Calculate artwork lease
      const leaseResults = calculateArtworkLease(validatedData)

      // Calculate comparison with direct purchase
      const comparison = compareWithDirectPurchase(validatedData, leaseResults)

      // Store calculation for PDF generation
      setLastCalculation({
        leaseResults,
        comparison,
        formData: validatedData
      })

      // Send company info to admin immediately after calculation
      try {
        await fetch('/api/loa-simulator/send-company-info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            formData: validatedData,
            leaseResults,
            comparison
          }),
        })
        console.log('✅ Company info sent to admin')
      } catch (error) {
        console.error('⚠️ Failed to send company info to admin:', error)
        // Don't block the user flow if this fails
      }

      // Send results to parent
      onCalculate(leaseResults, comparison, validatedData)

      toast.success(t('loaSimulator.toast.calculationSuccess'))

    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {}
        error.errors.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(fieldErrors)
        toast.error(t('loaSimulator.toast.validationError'))
      } else {
        toast.error(t('loaSimulator.toast.calculationError'))
        console.error('Calculation error:', error)
      }
    } finally {
      setIsCalculating(false)
    }
  }

  return (
    <div className="bg-backgroundColor p-8 shadow-2xl border border-gray-800 rounded-t-2xl lg:rounded-l-2xl lg:rounded-r-none">
      <h1 className="text-2xl lg:text-4xl font-bold text-textColor mb-8 font-bricolage">
        {t('loaSimulator.title')}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Première ligne: Entreprise et Adresse mail */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SimulatorInput
            label=""
            id="company"
            name="company"
            type="text"
            value={formData.company}
            onChange={(value) => handleInputChange('company', value)}
            placeholder={t('loaSimulator.form.company')}
            error={errors.company}
          />

          <SimulatorInput
            label=""
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(value) => handleInputChange('email', value)}
            placeholder={t('loaSimulator.form.email')}
            error={errors.email}
          />
        </div>

        {/* Phone Number */}
        <SimulatorInput
          label={t('loaSimulator.form.phoneNumber')}
          id="phoneNumber"
          name="phoneNumber"
          type="tel"
          value={formData.phoneNumber}
          onChange={handlePhoneChange}
          placeholder={t('loaSimulator.form.phoneNumber')}
          error={errors.phoneNumber}
        />

        {/* Taux d'imposition personnalisé */}
        <SimulatorInput
          label=""
          id="taxRate"
          name="taxRate"
          type="number"
          value={formData.taxRate}
          onChange={(value) => handleInputChange('taxRate', value)}
          placeholder={`${t('loaSimulator.form.taxRate')} *`}
          min={0}
          max={50}
          step="0.1"
          error={errors.taxRate}
        />

        {/* Deuxième ligne: Durée du bail et Valeur des œuvres */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SimulatorInput
            label=""
            id="leaseDuration"
            name="leaseDuration"
            type="number"
            value={formData.leaseDuration}
            onChange={(value) => handleInputChange('leaseDuration', value)}
            placeholder={t('loaSimulator.form.leaseDuration')}
            min={12}
            max={72}
            step="1"
            error={errors.leaseDuration}
          />

          <SimulatorInput
            label=""
            id="artworkValue"
            name="artworkValue"
            type="number"
            value={formData.artworkValue}
            onChange={(value) => handleInputChange('artworkValue', value)}
            placeholder={t('loaSimulator.form.artworkValue')}
            min={100}
            step="100"
            error={errors.artworkValue}
          />
        </div>

        {/* Majoration du premier loyer */}
        <SimulatorSelect
          label=""
          id="firstRentIncrease"
          name="firstRentIncrease"
          value={formData.firstRentIncrease}
          onChange={(value) => handleInputChange('firstRentIncrease', value)}
          options={firstRentOptions}
          placeholder={`${t('loaSimulator.form.firstRentIncrease')} *`}
          error={errors.firstRentIncrease}
        />

        {/* Explication des champs marqués d'un astérisque */}
        <div className="bg-backgroundGrey border border-gray-700 rounded-lg p-4 space-y-2">
          <h3 className="text-textColor font-semibold text-sm font-bricolage mb-2">{t('loaSimulator.form.infoBloc.title')}</h3>
          <div className="space-y-2 text-grayText text-sm">
            <div>
              <span className="text-purple-400 font-medium">• {t('loaSimulator.form.taxRate')} :</span> {t('loaSimulator.form.infoBloc.taxRateExplanation')}
            </div>
            <div>
              <span className="text-purple-400 font-medium">• {t('loaSimulator.form.firstRentIncrease')} :</span> {t('loaSimulator.form.infoBloc.firstRentExplanation')}
            </div>
            <div>
              <span className="text-purple-400 font-medium">• {t('loaSimulator.form.artworkValue')} :</span> {t('loaSimulator.form.infoBloc.artworkValueExplanation')}
            </div>
          </div>
        </div>

        {/* Boutons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button
            type="submit"
            disabled={isCalculating}
            additionalClassName="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed items-center justify-center"
            text={isCalculating ? t('loaSimulator.form.calculating') : t('loaSimulator.form.calculate')}
            icon={isCalculating ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> : <Calculator className="w-5 h-5" />}
            center
            iconBefore
            data-umami-event="loa-simulator-calculate-click"
          />
        </div>
      </form>
    </div>
  )
} 