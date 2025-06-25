'use client'

import { useState } from 'react'
import { z } from 'zod'
import { toast } from 'sonner'
import { Calculator, TrendingUp, DollarSign, Calendar, Percent, Shield } from 'lucide-react'
import { 
  calculateLoa, 
  calculateLoan, 
  compareLoanOptions, 
  validateLoaInputs,
  LoaInputs,
  LoaResults,
  PurchaseComparison
} from '@/utils/loaCalculations'

const loaSchema = z.object({
  vehiclePrice: z.number().min(1000, 'Le prix doit être d\'au moins 1 000€'),
  downPayment: z.number().min(0, 'L\'apport ne peut pas être négatif'),
  leaseDuration: z.number().min(12, 'Durée minimum 12 mois').max(120, 'Durée maximum 120 mois'),
  interestRate: z.number().min(0.1, 'Taux minimum 0.1%').max(50, 'Taux maximum 50%'),
  residualValue: z.number().min(1, 'Valeur résiduelle minimum 1%').max(99, 'Valeur résiduelle maximum 99%'),
  insuranceCost: z.number().min(0, 'Le coût d\'assurance ne peut pas être négatif').optional(),
  maintenanceCost: z.number().min(0, 'Le coût d\'entretien ne peut pas être négatif').optional(),
})

interface LoaFormProps {
  onCalculate: (loaResults: LoaResults, loanComparison: PurchaseComparison) => void
}

export default function LoaForm({ onCalculate }: LoaFormProps) {
  const [formData, setFormData] = useState<LoaInputs>({
    vehiclePrice: 25000,
    downPayment: 5000,
    leaseDuration: 36,
    interestRate: 4.5,
    residualValue: 45,
    insuranceCost: 0,
    maintenanceCost: 0,
  })

  const [isCalculating, setIsCalculating] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: keyof LoaInputs, value: string) => {
    const numValue = parseFloat(value) || 0
    setFormData(prev => ({ ...prev, [field]: numValue }))
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCalculating(true)
    setErrors({})

    try {
      // Validate with Zod
      const validatedData = loaSchema.parse(formData)
      
      // Additional business logic validation
      const validationErrors = validateLoaInputs(validatedData)
      if (validationErrors.length > 0) {
        toast.error(validationErrors[0])
        setIsCalculating(false)
        return
      }

      // Calculate LOA
      const loaResults = calculateLoa(validatedData)
      
      // Calculate loan comparison
      const loanResults = calculateLoan(
        validatedData.vehiclePrice,
        validatedData.downPayment,
        validatedData.leaseDuration,
        validatedData.interestRate
      )
      
      // Compare options
      const comparison = compareLoanOptions(loaResults, loanResults)
      
      // Send results to parent
      onCalculate(loaResults, comparison)
      
      toast.success('Calcul effectué avec succès!')
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {}
        error.errors.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(fieldErrors)
        toast.error('Veuillez corriger les erreurs dans le formulaire')
      } else {
        toast.error('Erreur lors du calcul')
        console.error('Calculation error:', error)
      }
    } finally {
      setIsCalculating(false)
    }
  }

  return (
    <div className="bg-cardBackground rounded-xl p-8 border border-[#2D2A3D]">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full flex items-center justify-center">
          <Calculator className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Simulateur LOA</h2>
          <p className="text-gray-400">Calculez votre financement</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Prix du véhicule */}
        <div>
          <label className="block text-white mb-2 font-medium">
            <DollarSign className="inline w-4 h-4 mr-2" />
            Prix du véhicule (€)
          </label>
          <input
            type="number"
            value={formData.vehiclePrice}
            onChange={(e) => handleInputChange('vehiclePrice', e.target.value)}
            className={`w-full bg-[#1A1A1A] border ${errors.vehiclePrice ? 'border-red-500' : 'border-[#2D2A3D]'} rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500`}
            placeholder="25000"
            min="1000"
            step="500"
          />
          {errors.vehiclePrice && (
            <p className="text-red-400 text-sm mt-1">{errors.vehiclePrice}</p>
          )}
        </div>

        {/* Apport initial */}
        <div>
          <label className="block text-white mb-2 font-medium">
            <TrendingUp className="inline w-4 h-4 mr-2" />
            Apport initial (€)
          </label>
          <input
            type="number"
            value={formData.downPayment}
            onChange={(e) => handleInputChange('downPayment', e.target.value)}
            className={`w-full bg-[#1A1A1A] border ${errors.downPayment ? 'border-red-500' : 'border-[#2D2A3D]'} rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500`}
            placeholder="5000"
            min="0"
            step="500"
          />
          {errors.downPayment && (
            <p className="text-red-400 text-sm mt-1">{errors.downPayment}</p>
          )}
        </div>

        {/* Durée du lease */}
        <div>
          <label className="block text-white mb-2 font-medium">
            <Calendar className="inline w-4 h-4 mr-2" />
            Durée du lease (mois)
          </label>
          <select
            value={formData.leaseDuration}
            onChange={(e) => handleInputChange('leaseDuration', e.target.value)}
            className={`w-full bg-[#1A1A1A] border ${errors.leaseDuration ? 'border-red-500' : 'border-[#2D2A3D]'} rounded-lg p-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
          >
            <option value="12">12 mois</option>
            <option value="24">24 mois</option>
            <option value="36">36 mois</option>
            <option value="48">48 mois</option>
            <option value="60">60 mois</option>
            <option value="72">72 mois</option>
          </select>
          {errors.leaseDuration && (
            <p className="text-red-400 text-sm mt-1">{errors.leaseDuration}</p>
          )}
        </div>

        {/* Taux d'intérêt */}
        <div>
          <label className="block text-white mb-2 font-medium">
            <Percent className="inline w-4 h-4 mr-2" />
            Taux d&apos;intérêt annuel (%)
          </label>
          <input
            type="number"
            value={formData.interestRate}
            onChange={(e) => handleInputChange('interestRate', e.target.value)}
            className={`w-full bg-[#1A1A1A] border ${errors.interestRate ? 'border-red-500' : 'border-[#2D2A3D]'} rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500`}
            placeholder="4.5"
            min="0.1"
            max="50"
            step="0.1"
          />
          {errors.interestRate && (
            <p className="text-red-400 text-sm mt-1">{errors.interestRate}</p>
          )}
        </div>

        {/* Valeur résiduelle */}
        <div>
          <label className="block text-white mb-2 font-medium">
            <TrendingUp className="inline w-4 h-4 mr-2" />
            Valeur résiduelle (%)
          </label>
          <input
            type="number"
            value={formData.residualValue}
            onChange={(e) => handleInputChange('residualValue', e.target.value)}
            className={`w-full bg-[#1A1A1A] border ${errors.residualValue ? 'border-red-500' : 'border-[#2D2A3D]'} rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500`}
            placeholder="45"
            min="1"
            max="99"
            step="1"
          />
          {errors.residualValue && (
            <p className="text-red-400 text-sm mt-1">{errors.residualValue}</p>
          )}
          <p className="text-gray-400 text-sm mt-1">
            Pourcentage de la valeur du véhicule à la fin du lease
          </p>
        </div>

        {/* Options supplémentaires */}
        <div className="border-t border-[#2D2A3D] pt-6">
          <h3 className="text-white font-medium mb-4">Options supplémentaires</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Assurance */}
            <div>
              <label className="block text-white mb-2 font-medium">
                <Shield className="inline w-4 h-4 mr-2" />
                Assurance mensuelle (€)
              </label>
              <input
                type="number"
                value={formData.insuranceCost || 0}
                onChange={(e) => handleInputChange('insuranceCost', e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#2D2A3D] rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="0"
                min="0"
                step="10"
              />
            </div>

            {/* Entretien */}
            <div>
              <label className="block text-white mb-2 font-medium">
                <Calendar className="inline w-4 h-4 mr-2" />
                Entretien mensuel (€)
              </label>
              <input
                type="number"
                value={formData.maintenanceCost || 0}
                onChange={(e) => handleInputChange('maintenanceCost', e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#2D2A3D] rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="0"
                min="0"
                step="10"
              />
            </div>
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isCalculating}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium py-4 rounded-lg transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isCalculating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Calcul en cours...
            </>
          ) : (
            <>
              <Calculator className="w-5 h-5" />
              Calculer
            </>
          )}
        </button>
      </form>
    </div>
  )
} 