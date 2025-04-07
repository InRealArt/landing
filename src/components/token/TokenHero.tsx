'use client'

import TokenForm from '@/components/token/TokenForm';
import TokenSaleInfo from '@/components/token/TokenSaleInfo';
import PresaleFeatures from '@/components/presale/PresaleFeatures';
import { useLanguageStore } from '@/store/languageStore';
import marketplaceImage from "../../../public/images/intro-background.png";
export default function TokenHero() {
  const { t } = useLanguageStore();
  return (
    <section className="relative bg-cover m-auto bg-no-repeat bg-bottom min-h-screen w-full flex items-center justify-center pt-headerSize mx-auto" style={{ backgroundImage: `url('${marketplaceImage.src}')` }} >
      <div className="max-w-90 xl:max-w-screen-xl m-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex-1">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 unbounded">{t('presale.token.title')}</h1>
            <p className="text-xl mb-6 inter">
              {t('presale.token.subtitle')}
            </p>
            <PresaleFeatures />
          </div>

          <div className="flex-1 flex flex-col items-center gap-8">
            {/* TODO: Add sale info */}
            {/* <TokenSaleInfo /> */}
            <TokenForm />
          </div>
        </div>
      </div>
    </section>
  );
} 