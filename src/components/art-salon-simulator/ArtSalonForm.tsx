import React, { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';
import { toast } from 'sonner';
import { isValidPhoneNumber } from 'react-phone-number-input';
import SimulatorInput from '@/components/common/simulator/SimulatorInput';
import SimulatorSelect from '@/components/common/simulator/SimulatorSelect';
import SimulatorRadioGroup from '@/components/common/simulator/SimulatorRadioGroup';
import SimulatorCheckbox from '@/components/common/simulator/SimulatorCheckbox';
import Button from '@/components/common/Button';
import {
  ArtSalonInputs,
  ArtSalonResults,
  calculateSalonCost,
  getAvailableFormulas,
  accommodationComfortCosts
} from '@/utils/artSalonCalculations';
import { useTranslation } from '@/hooks/useTranslation';

interface ArtSalonFormProps {
  onCalculate: (results: ArtSalonResults, formData: { firstName: string, lastName: string, email: string, phone: string }) => void;
  salonId: string;
  salonName: string;
}

export default function ArtSalonForm({ onCalculate, salonId, salonName }: ArtSalonFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<ArtSalonInputs>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '', // Correct field name from type
    salonId: salonId, // Set from props
    formula: 'standard', // Keep default for logic
    days: 0, // Empty to show placeholder
    persons: 0, // Empty to show placeholder
    accommodationComfort: '', // Empty to show placeholder
    professionalSupport: false,
  });

  const [showAccommodationComfort, setShowAccommodationComfort] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle salon change to update available formulas
  useEffect(() => {
    if (formData.salonId) {
      const availableFormulas = getAvailableFormulas(formData.salonId);
      if (!availableFormulas.includes(formData.formula)) {
        setFormData(prev => ({ ...prev, formula: availableFormulas[0] }));
      }
    }
  }, [formData.salonId, formData.formula]);

  // Show/hide accommodation comfort based on days
  useEffect(() => {
    setShowAccommodationComfort(formData.days > 1);
    // Reset accommodation comfort when days <= 1
    if (formData.days <= 1) {
      setFormData(prev => ({ ...prev, accommodationComfort: '' }));
    }
  }, [formData.days]);

  const handleInputChange = (field: keyof ArtSalonInputs) => (value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field as string]) {
      setErrors(prev => ({ ...prev, [field as string]: '' }));
    }
  };

  const handlePhoneChange = (value: string | number) => {
    setFormData(prev => ({ ...prev, phone: value as string }));
    // Clear phone error
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate phone number first
      if (!formData.phone || !isValidPhoneNumber(formData.phone)) {
        setErrors(prev => ({ ...prev, phone: t('loaSimulator.form.errors.phoneInvalid') }));
        toast.error(t('loaSimulator.form.errors.phoneInvalid'));
        return;
      }

      // Set defaults if not provided
      const finalFormData: ArtSalonInputs = {
        ...formData,
        salonId: salonId, // Always use the salon from props
        days: formData.days || 1,
        persons: formData.persons || 1,
        accommodationComfort: formData.accommodationComfort || 'basic',
      };

      // Validate that the selected formula is available for this salon
      const availableFormulas = getAvailableFormulas(finalFormData.salonId);
      if (!availableFormulas.includes(finalFormData.formula)) {
        toast.error(t('artSalonSimulator.toast.formulaNotAvailable'));
        return;
      }

      const results = calculateSalonCost(finalFormData);
      onCalculate(results, { firstName: finalFormData.firstName, lastName: finalFormData.lastName, email: finalFormData.email, phone: finalFormData.phone });

      // Send company info to admin immediately after calculation
      try {
        await fetch('/api/art-salon-simulator/send-company-info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            formData: finalFormData,
            results
          }),
        })
        console.log('✅ Art salon info sent to admin')
      } catch (error) {
        console.error('⚠️ Failed to send art salon info to admin:', error)
        // Don't block the user flow if this fails
      }

      toast.success(t('artSalonSimulator.toast.calculationSuccess'));
    } catch (error) {
      console.error('Erreur lors du calcul:', error);
      toast.error(t('artSalonSimulator.toast.calculationError'));
    }
  };

  // Create options for selects and radio groups
  const accommodationOptions = [
    { value: '', label: '', disabled: true }, // Empty option for placeholder
    ...Object.entries(accommodationComfortCosts).map(([key, cost]) => ({
      value: key,
      label: t(`artSalonSimulator.accommodationTypes.${key}` as any),
    }))
  ];

  const availableFormulas = formData.salonId ? getAvailableFormulas(formData.salonId) : ['standard', 'premium', 'VIP'];
  const formulaOptions = [
    {
      value: 'standard',
      label: t('artSalonSimulator.formulas.standard'),
      disabled: !availableFormulas.includes('standard')
    },
    {
      value: 'premium',
      label: t('artSalonSimulator.formulas.premium'),
      disabled: !availableFormulas.includes('premium')
    },
    {
      value: 'VIP',
      label: t('artSalonSimulator.formulas.VIP'),
      disabled: !availableFormulas.includes('VIP')
    },
  ];

  return (
    <div className="bg-[var(--canvas-bg)] p-8 lg:p-10">
      <span className="section-number block mb-4">{t('footer.artSalonSimulator')}</span>
      <h1 className="serif italic text-3xl lg:text-4xl text-[var(--ink-black)] mb-8 leading-tight">
        {salonName}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="space-y-6">

          {/* First Name and Last Name - Side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SimulatorInput
              label=""
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleInputChange('firstName')}
              placeholder={t('artSalonSimulator.form.firstName')}
              required
            />

            <SimulatorInput
              label=""
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleInputChange('lastName')}
              placeholder={t('artSalonSimulator.form.lastName')}
              required
            />
          </div>

          {/* Email and Phone - Side by side */}
          <SimulatorInput
            label=""
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange('email')}
            placeholder={t('artSalonSimulator.form.email')}
            required
          />

          <SimulatorInput
            label={t('artSalonSimulator.form.phone')}
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handlePhoneChange}
            placeholder={t('artSalonSimulator.form.phone')}
            error={errors.phone}
          />
        </div>

        {/* Salon Details */}
        <div className="space-y-6">

          <SimulatorRadioGroup
            label={t('artSalonSimulator.form.formula')}
            name="formula"
            value={formData.formula}
            onChange={handleInputChange('formula')}
            options={formulaOptions}
            required
            inline={true}
          />

          {/* Days and Persons - Side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SimulatorInput
              label=""
              id="days"
              name="days"
              type="number"
              value={formData.days === 0 ? '' : formData.days}
              onChange={handleInputChange('days')}
              placeholder={t('artSalonSimulator.form.days')}
              min={1}
              max={20}
              required
            />

            <SimulatorInput
              label=""
              id="persons"
              name="persons"
              type="number"
              value={formData.persons === 0 ? '' : formData.persons}
              onChange={handleInputChange('persons')}
              placeholder={t('artSalonSimulator.form.persons')}
              min={1}
              max={100}
              required
            />
          </div>

          {showAccommodationComfort && (
            <SimulatorSelect
              label=""
              id="accommodationComfort"
              name="accommodationComfort"
              value={formData.accommodationComfort}
              onChange={handleInputChange('accommodationComfort')}
              options={accommodationOptions}
              placeholder={t('artSalonSimulator.form.accommodationComfort')}
            />
          )}

          <SimulatorCheckbox
            label={t('artSalonSimulator.form.professionalSupport')}
            id="professionalSupport"
            name="professionalSupport"
            checked={formData.professionalSupport}
            onChange={handleInputChange('professionalSupport')}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button
            type="submit"
            text={t('artSalonSimulator.form.calculateButton')}
            icon={<Calculator className="w-4 h-4" />}
            iconBefore={true}
            center={true}
            additionalClassName="flex-1 bg-purpleColor"
          />
        </div>
      </form>
    </div>
  );
} 