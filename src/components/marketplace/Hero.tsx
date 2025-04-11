'use client'

import Image from "next/image";
import marketplaceImage from "../../../public/images/marketplace.png";
import { useLanguageStore } from '@/store/languageStore';
import Button from "../common/Button";

export default function Hero() {
  const { t } = useLanguageStore();

  return (
    <section className="bg-cover bg-no-repeat bg-bottom h-screen w-full flex items-center justify-center" style={{ backgroundImage: `url('${marketplaceImage.src}')` }}>
      <div className="max-w-90 xl:max-w-screen-xl m-auto ">
        <h1 className="text-4xl leading-[1.3] md:leading-[1] md:text-6xl bricolage-grotesque text-left font-medium mb-4">
          {t('marketplace.hero.title')}
        </h1>
        <div className="mt-12 md:mt-4">
          <Button
            text={t('marketplace.hero.mainButton')}
            additionalClassName="border border-white text-white rounded-full py-3 px-8 opacity-50 cursor-not-allowed"
            center
            disabled={true}
          />
        </div>
      </div>
    </section>
  );
} 