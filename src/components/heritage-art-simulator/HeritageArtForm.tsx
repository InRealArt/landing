'use client'

import { useState } from 'react'
import { useLanguageStore } from '@/store/languageStore'
import { validateEmail } from '@/utils/functions'
import SimulatorInput from '@/components/common/simulator/SimulatorInput'
import SimulatorSelect from '@/components/common/simulator/SimulatorSelect'
import { type HeritageArtFormData, type HeritageArtResults, type ProfilInvestisseur, type Objectif, calculateHeritageArtRecommendation } from '@/utils/heritageArtCalculations'
import Button from '../common/Button'
import { isValidPhoneNumber } from 'react-phone-number-input'

interface HeritageArtFormProps {
  onCalculate: (results: HeritageArtResults, formData: { firstName: string, lastName: string, email: string, phone: string }) => void;
}

export default function HeritageArtForm({ onCalculate }: HeritageArtFormProps) {
  const { t } = useLanguageStore()

  const [formData, setFormData] = useState<HeritageArtFormData>({
    immobilier: 0,
    liquidites: 0,
    financier: 0,
    crypto: 0,
    tangibles: 0,
    profil: '' as ProfilInvestisseur,
    objectif: '' as Objectif,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  const profilOptions = [
    { value: 'Prudent', label: t('heritageArtSimulator.form.profils.prudent') },
    { value: 'Équilibré', label: t('heritageArtSimulator.form.profils.equilibre') },
    { value: 'Dynamique', label: t('heritageArtSimulator.form.profils.dynamique') },
  ]

  const objectifOptions = [
    { value: 'Diversification', label: t('heritageArtSimulator.form.objectifs.diversification') },
    { value: 'Transmission', label: t('heritageArtSimulator.form.objectifs.transmission') },
    { value: 'Fiscalité', label: t('heritageArtSimulator.form.objectifs.fiscalite') },
    { value: 'Passion', label: t('heritageArtSimulator.form.objectifs.passion') },
  ]

  const handleInputChange = (field: keyof HeritageArtFormData) => (value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Effacer l'erreur pour ce champ
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const getTotalPercentage = (): number => {
    return formData.immobilier + formData.liquidites + formData.financier + formData.crypto + formData.tangibles
  }

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {}
    const total = getTotalPercentage()

    if (total !== 100) {
      newErrors.total = `${t('heritageArtSimulator.form.errors.totalNot100')} (${total}%)`
    }

    if (!formData.profil) {
      newErrors.profil = t('heritageArtSimulator.form.errors.profilRequired')
    }

    if (!formData.objectif) {
      newErrors.objectif = t('heritageArtSimulator.form.errors.objectifRequired')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = t('heritageArtSimulator.form.errors.firstNameRequired')
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = t('heritageArtSimulator.form.errors.lastNameRequired')
    }

    if (!formData.email.trim()) {
      newErrors.email = t('heritageArtSimulator.form.errors.emailRequired')
    } else if (!validateEmail(formData.email)) {
      newErrors.email = t('heritageArtSimulator.form.errors.emailInvalid')
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t('heritageArtSimulator.form.errors.phoneRequired')
    } else if (!isValidPhoneNumber(formData.phone)) {
      newErrors.phone = t('heritageArtSimulator.form.errors.phoneRequired')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2)
    }
  }

  const handlePreviousStep = () => {
    setCurrentStep(1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateStep2()) return

    setIsLoading(true)

    try {
      const results = calculateHeritageArtRecommendation(formData)

      const personalInfo = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
      }

      onCalculate(results, personalInfo)
    } catch (error) {
      console.error('Erreur lors du calcul:', error)
      setErrors({ general: error instanceof Error ? error.message : 'Une erreur est survenue' })
    } finally {
      setIsLoading(false)
    }
  }

  const totalPercentage = getTotalPercentage()

  return (
    <div className="bg-backgroundColor p-8 shadow-2xl border border-gray-800 rounded-t-2xl lg:rounded-l-2xl lg:rounded-r-none">
      <h1 className="text-2xl lg:text-4xl font-bold text-textColor mb-8 font-bricolage">
        {t('heritageArtSimulator.form.title')}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {currentStep === 1 && (
          <>
            {/* Répartition du patrimoine */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-textColor mb-4">
                {t('heritageArtSimulator.form.repartitionTitle')}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SimulatorInput
                  label={`${t('heritageArtSimulator.form.immobilier')} (%)`}
                  id="immobilier"
                  name="immobilier"
                  type="number"
                  value={formData.immobilier.toString()}
                  onChange={handleInputChange('immobilier')}
                  placeholder="0"
                  min={0}
                  max={100}
                  required
                />

                <SimulatorInput
                  label={`${t('heritageArtSimulator.form.liquidites')} (%)`}
                  id="liquidites"
                  name="liquidites"
                  type="number"
                  value={formData.liquidites.toString()}
                  onChange={handleInputChange('liquidites')}
                  placeholder="0"
                  min={0}
                  max={100}
                  required
                />

                <SimulatorInput
                  label={`${t('heritageArtSimulator.form.financier')} (%)`}
                  id="financier"
                  name="financier"
                  type="number"
                  value={formData.financier.toString()}
                  onChange={handleInputChange('financier')}
                  placeholder="0"
                  min={0}
                  max={100}
                  required
                />

                <SimulatorInput
                  label={`${t('heritageArtSimulator.form.crypto')} (%)`}
                  id="crypto"
                  name="crypto"
                  type="number"
                  value={formData.crypto.toString()}
                  onChange={handleInputChange('crypto')}
                  placeholder="0"
                  min={0}
                  max={100}
                  required
                />
              </div>

              <div className="md:w-1/2">
                <SimulatorInput
                  label={`${t('heritageArtSimulator.form.tangibles')} (%)`}
                  id="tangibles"
                  name="tangibles"
                  type="number"
                  value={formData.tangibles.toString()}
                  onChange={handleInputChange('tangibles')}
                  placeholder="0"
                  min={0}
                  max={100}
                  required
                />
              </div>

              <div className={`text-lg font-semibold ${totalPercentage === 100 ? 'text-green-400' : 'text-yellow-400'}`}>
                {t('heritageArtSimulator.form.total')}: {totalPercentage}%
              </div>

              {errors.total && (
                <div className="text-red-400 text-sm">
                  ⚠️ {errors.total}
                </div>
              )}
            </div>

            {/* Profil et Objectif */}
            <div className="space-y-6">
              <SimulatorSelect
                label={t('heritageArtSimulator.form.profil')}
                id="profil"
                name="profil"
                value={formData.profil}
                onChange={handleInputChange('profil')}
                options={profilOptions}
                placeholder={t('heritageArtSimulator.form.profilPlaceholder')}
                error={errors.profil}
                required
              />

              <SimulatorSelect
                label={t('heritageArtSimulator.form.objectif')}
                id="objectif"
                name="objectif"
                value={formData.objectif}
                onChange={handleInputChange('objectif')}
                options={objectifOptions}
                placeholder={t('heritageArtSimulator.form.objectifPlaceholder')}
                error={errors.objectif}
                required
              />
            </div>

            <Button
              type="button"
              action={handleNextStep}
              additionalClassName="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold py-4 px-8 rounded-full hover:from-purple-700 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
              text={t('heritageArtSimulator.form.nextStep')}
              icon={<span className="text-xl">→</span>}
            />

          </>
        )}

        {currentStep === 2 && (
          <>
            {/* Informations personnelles */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-textColor mb-4">
                {t('heritageArtSimulator.form.personalInfo')}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SimulatorInput
                  label=""
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange('firstName')}
                  placeholder={t('heritageArtSimulator.form.firstNamePlaceholder')}
                  error={errors.firstName}
                  required
                />

                <SimulatorInput
                  label=""
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange('lastName')}
                  placeholder={t('heritageArtSimulator.form.lastNamePlaceholder')}
                  error={errors.lastName}
                  required
                />
              </div>

              <SimulatorInput
                label=""
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                placeholder={t('heritageArtSimulator.form.emailPlaceholder')}
                error={errors.email}
                required
              />

              <SimulatorInput
                label={t('heritageArtSimulator.form.phone')}
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange('phone')}
                placeholder={t('heritageArtSimulator.form.phonePlaceholder')}
                error={errors.phone}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                type="button"
                action={handlePreviousStep}
                additionalClassName="bg-gray-600 text-white font-bold py-4 px-8 hover:bg-gray-700  gap-2"
                text={t('heritageArtSimulator.form.previousStep')}
              />

              <Button
                type="submit"
                disabled={isLoading}
                additionalClassName="bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold py-4 px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                icon={isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> : <div />}
                text={isLoading ? '' : t('heritageArtSimulator.form.calculateButton')}
              />
            </div>
          </>
        )}

        {errors.general && (
          <div className="text-red-400 text-sm text-center">
            {errors.general}
          </div>
        )}
      </form>
    </div>
  )
} 