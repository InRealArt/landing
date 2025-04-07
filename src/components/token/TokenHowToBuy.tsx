'use client'

import { useLanguageStore } from '@/store/languageStore';
import { ArrowUp, Check, Copy } from 'lucide-react';
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
        {/* Step 1: Prepare Your Wallet */}
        <div className="bg-cardBackground rounded-xl p-6">
          <h3 className="text-2xl font-medium mb-4">
            {t('presale.token.howToBuy.step1.title')}
          </h3>
          <p className="text-gray-300 mb-4">
            {t('presale.token.howToBuy.step1.description')}
          </p>
        </div>

        {/* Step 2: Transfer ETH */}
        <div className="bg-cardBackground rounded-xl p-6">
          <h3 className="text-2xl font-medium mb-4">
            {t('presale.token.howToBuy.step2.title')}
          </h3>
          <p className="text-gray-300 mb-4">
            {t('presale.token.howToBuy.step2.description')}<br />
            {walletAddress}
          </p>
          <div className="mt-4">
            <Button
              text={t('presale.token.howToBuy.step2.copyAddress')}
              action={copyToClipboard}
              additionalClassName="bg-purpleColor w-full justify-between"
              icon={<Copy />}
            />
          </div>
        </div>
      </div>

      {/* Step 3: Receiving Tokens - Full width card at the bottom */}
      <div className="bg-cardBackground rounded-xl p-6">
        <h3 className="text-2xl font-medium mb-4">
          {t('presale.token.howToBuy.step3.title')}
        </h3>
        <p className="text-gray-300 mb-4">
          {t('presale.token.howToBuy.step3.description')}
        </p>
        <p className="text-gray-300 mb-6">
          {t('presale.token.howToBuy.step3.additionalInfo')}
        </p>

        <div className="mt-6 text-center">
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