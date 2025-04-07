'use client'

import { useState } from 'react';
import { useLanguageStore } from '@/store/languageStore';
import { Shield, BadgeCheck, Lock } from 'lucide-react';
import Button from '../common/Button';
import { submitTokenForm } from '@/actions/tokenActions';
import { toast } from 'sonner';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
}

export default function TokenForm() {
  const { t } = useLanguageStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phoneNumber: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (value: string | undefined) => {
    setFormData(prev => ({
      ...prev,
      phoneNumber: value || ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate phone number
    if (!formData.phoneNumber || !isValidPhoneNumber(formData.phoneNumber)) {
      toast.error(t('presale.token.invalidPhone'));
      return;
    }

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const result = await submitTokenForm(formData);

      if (result.success) {
        toast.success(t('presale.token.successMessage') || result.message);
        // Reset form
        setFormData({
          name: '',
          email: '',
          phoneNumber: ''
        });
      } else {
        toast.error(result.message || t('presale.token.errorMessage'));
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(t('common.error') || 'An error occurred while processing your request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-xl bg-cardBackground rounded-xl p-8 border border-[#2D2A3D]">

      <h1 className="text-3xl md:text-4xl font-bold mb-10 text-white unbounded">{t('presale.token.accessAllocation')}</h1>

      <form onSubmit={handleSubmit} className='inter'>
        <div className="mb-6">
          <label htmlFor="name" className="block text-white mb-2">{t('presale.token.name')}</label>
          <div className="relative">
            <input
              type="text"
              id="name"
              name="name"
              required
              disabled={isSubmitting}
              value={formData.name}
              onChange={handleChange}
              placeholder={t('presale.token.namePlaceholder')}
              className="w-full bg-cardBackground border border-[#2D2A3D] rounded-lg p-4 pl-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6052ff]"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="email" className="block text-white mb-2">{t('presale.token.email')}</label>
          <div className="relative">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t('presale.token.emailPlaceholder')}
              className="w-full bg-cardBackground border border-[#2D2A3D] rounded-lg p-4 pl-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6052ff]"
              required
              disabled={isSubmitting}
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 20.5H7C4 20.5 2 19 2 15.5V8.5C2 5 4 3.5 7 3.5H17C20 3.5 22 5 22 8.5V15.5C22 19 20 20.5 17 20.5Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M17 9L13.87 11.5C12.84 12.32 11.15 12.32 10.12 11.5L7 9" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        <div className='mb-6'>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-white mb-2">
            {t('presale.token.phoneNumber')}
          </label>
          <PhoneInput
            international
            countryCallingCodeEditable={false}
            defaultCountry="FR"
            value={formData.phoneNumber}
            onChange={handlePhoneChange}
            disabled={isSubmitting}
            placeholder={t('presale.token.phonePlaceholder')}
            className="phone-input-container w-full"
          />
        </div>
        <Button
          type='submit'
          text={isSubmitting ? t('common.submitting') : t('presale.token.secureAllocation')}
          additionalClassName="bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium py-4 rounded-lg transition-all hover:opacity-90 w-full disabled:opacity-50 disabled:cursor-not-allowed"
          center
          disabled={isSubmitting}
        />
      </form >
      {/* TODO: Add KYC verification */}
      {/* <div className="flex justify-center gap-6 mt-10">
        <div className="flex items-center gap-2">
          <Shield className="text-teal-400" size={20} />
          <span className="text-gray-400 text-sm">{t('presale.token.kycVerified')}</span>
        </div>
        <div className="flex items-center gap-2">
          <BadgeCheck className="text-teal-400" size={20} />
          <span className="text-gray-400 text-sm">{t('presale.token.auditedBy')}</span>
        </div>
        <div className="flex items-center gap-2">
          <Lock className="text-teal-400" size={20} />
          <span className="text-gray-400 text-sm">{t('presale.token.secureTransaction')}</span>
        </div>
      </div> */}
    </div >
  );
} 