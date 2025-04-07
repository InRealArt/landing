'use client'

import { useState } from 'react';
import { useLanguageStore } from '@/store/languageStore';
import { Shield, BadgeCheck, Lock } from 'lucide-react';

export default function TokenForm() {
  const { t } = useLanguageStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission logic here
  };

  return (
    <div className="w-full max-w-xl bg-cardBackground rounded-xl p-8 border border-[#2D2A3D]">
      
      <h1 className="text-4xl font-bold mb-10 text-white">{t('presale.token.accessAllocation')}</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="name" className="block text-white mb-2">{t('presale.token.name')}</label>
          <div className="relative">
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t('presale.token.namePlaceholder')}
              className="w-full bg-cardBackground border border-[#2D2A3D] rounded-lg p-4 pl-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6052ff]"
              required
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 20.5H7C4 20.5 2 19 2 15.5V8.5C2 5 4 3.5 7 3.5H17C20 3.5 22 5 22 8.5V15.5C22 19 20 20.5 17 20.5Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 9L13.87 11.5C12.84 12.32 11.15 12.32 10.12 11.5L7 9" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <label htmlFor="phoneNumber" className="block text-white mb-2">{t('presale.token.phoneNumber')}</label>
          <div className="relative">
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder={t('presale.token.phonePlaceholder')}
              className="w-full bg-cardBackground border border-[#2D2A3D] rounded-lg p-4 pl-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6052ff]"
              required
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.97 18.33C21.97 18.69 21.89 19.06 21.72 19.42C21.55 19.78 21.33 20.12 21.04 20.44C20.55 20.98 20.01 21.37 19.4 21.62C18.8 21.87 18.15 22 17.45 22C16.43 22 15.34 21.76 14.19 21.27C13.04 20.78 11.89 20.12 10.75 19.29C9.6 18.45 8.51 17.52 7.47 16.49C6.44 15.45 5.51 14.36 4.68 13.22C3.86 12.08 3.2 10.94 2.72 9.81C2.24 8.67 2 7.58 2 6.54C2 5.86 2.12 5.21 2.36 4.61C2.6 4 2.98 3.44 3.51 2.94C4.15 2.31 4.85 2 5.59 2C5.87 2 6.15 2.06 6.4 2.18C6.66 2.3 6.89 2.48 7.07 2.74L9.39 6.01C9.57 6.26 9.7 6.49 9.79 6.71C9.88 6.92 9.93 7.13 9.93 7.32C9.93 7.56 9.86 7.8 9.73 8.03C9.6 8.26 9.42 8.5 9.19 8.74L8.45 9.5C8.34 9.62 8.29 9.76 8.29 9.92C8.29 10 8.3 10.08 8.32 10.16C8.36 10.24 8.39 10.3 8.42 10.36C8.59 10.69 8.89 11.12 9.32 11.64C9.76 12.16 10.22 12.69 10.71 13.22C11.25 13.75 11.77 14.22 12.3 14.65C12.83 15.08 13.27 15.38 13.6 15.54C13.65 15.56 13.71 15.59 13.77 15.62C13.84 15.65 13.9 15.66 13.97 15.66C14.14 15.66 14.27 15.6 14.39 15.48L15.13 14.76C15.38 14.52 15.62 14.34 15.85 14.21C16.08 14.08 16.32 14.01 16.56 14.01C16.75 14.01 16.94 14.05 17.15 14.14C17.36 14.23 17.59 14.36 17.84 14.53L21.18 16.87C21.44 17.05 21.61 17.27 21.72 17.52C21.83 17.77 21.89 18.01 21.89 18.26C21.97 18.29 21.97 18.31 21.97 18.33Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10"/>
              </svg>
            </div>
          </div>
        </div>
        
        <button 
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium py-4 rounded-lg transition-all hover:opacity-90"
        >
          {t('presale.token.secureAllocation')}
        </button>
      </form>
      
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
    </div>
  );
} 