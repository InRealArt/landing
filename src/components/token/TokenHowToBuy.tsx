'use client'

import { useLanguageStore } from '@/store/languageStore';
import { ArrowUp, Check, Copy, CreditCard, Bitcoin, ArrowRight } from 'lucide-react';
import Button from '@/components/common/Button';
import { toast } from 'sonner';

export default function TokenHowToBuy() {
  const { t } = useLanguageStore();

  const walletAddress = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);

    // Add a toast notification with the sonner library
    toast.success(t('presale.token.howToBuy.toast.copied'), {
      description: walletAddress.substring(0, 16) + '...',
      icon: <Check size={16} className="text-green-500" />,
      duration: 3000,
    });
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <section className="py-20 container mx-auto px-4">
      <h2 className="text-4xl md:text-5xl font-bold mb-4 bricolage-grotesque">
        {t('presale.token.howToBuy.title')}
      </h2>

      <p className="text-gray-300 max-w-3xl mb-16 bricolage-grotesque">
        {t('presale.token.howToBuy.subtitle')}
      </p>

      {/* First two cards in flex row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Step 1: Choisissez votre méthode de paiement */}
        <div className="bg-cardBackground rounded-xl p-6">
          <div className="flex items-center mb-4">
            <span className="w-8 h-8 bg-purpleColor rounded-full flex items-center justify-center mr-3">1</span>
            <h3 className="text-2xl font-medium">
              {t('presale.token.howToBuy.step1.title')}
            </h3>
          </div>
          <p className="text-gray-300 mb-6">
            {t('presale.token.howToBuy.step1.description')}
          </p>
          <div className="flex space-x-4 mt-4">
            <div className="flex items-center bg-[#1e1e2a] p-3 rounded-lg">
              <Bitcoin className="text-yellow-500 mr-2" />
              <span>Crypto</span>
            </div>
            <div className="flex items-center bg-[#1e1e2a] p-3 rounded-lg">
              <CreditCard className="text-blue-500 mr-2" />
              <span>Fiat</span>
            </div>
          </div>
        </div>

        {/* Step 2: Complétez votre achat */}
        <div className="bg-cardBackground rounded-xl p-6">
          <div className="flex items-center mb-4">
            <span className="w-8 h-8 bg-purpleColor rounded-full flex items-center justify-center mr-3">2</span>
            <h3 className="text-2xl font-medium">
              {t('presale.token.howToBuy.step2.title')}
            </h3>
          </div>
          <p className="text-gray-300 mb-4">
            {t('presale.token.howToBuy.step2.description')}
          </p>
         
        </div>
      </div>

      {/* Step 3: Recevez vos tokens */}
      <div className="bg-cardBackground rounded-xl p-6">
        <div className="flex items-center mb-4">
          <span className="w-8 h-8 bg-purpleColor rounded-full flex items-center justify-center mr-3">3</span>
          <h3 className="text-2xl font-medium">
            {t('presale.token.howToBuy.step3.title')}
          </h3>
        </div>
        <p className="text-gray-300 mb-4">
          {t('presale.token.howToBuy.step3.description')}
        </p>
        <p className="text-gray-300 mb-6">
          {t('presale.token.howToBuy.step3.additionalInfo')}
        </p>

        <div className="mt-8 text-center">
          <Button
            text={t('presale.token.howToBuy.secureToken')}
            action={scrollToTop}
            additionalClassName="bg-purpleColor"
            icon={<ArrowUp />}
          />
        </div>
      </div>
    </section>
  );
} 