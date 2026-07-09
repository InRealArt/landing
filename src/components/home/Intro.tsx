'use client'
import OptimizedBackgroundImage from '../common/OptimizedBackgroundImage';
import Button from "../common/Button";
import { useTranslation } from '@/hooks/useTranslation';
import HeroArtistSlider from './HeroArtistSlider';
import { useTheme } from '@/contexts/ThemeContext';
import { EXTERNAL_URLS } from '@/constants/constants';

const Intro = () => {
  const { t } = useTranslation()

  const { theme } = useTheme();

  const overlayColor = theme === 'light' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.3)'

  return (
    <OptimizedBackgroundImage
      src="/images/hero/IRA_Hero.webp"
      alt="Arrière-plan de la section d'introduction"
      width={1920}
      height={1080}
      className="bg-cover m-auto bg-no-repeat bg-bottom w-full flex items-center justify-center md:mt-0 min-h-screen overflow-hidden"
      contentClassName="max-w-screen-2xl m-auto px-4 sm:px-8 w-full"
      overlay
      overlayColor={overlayColor}
      overlayOpacity={0.4}
      priority={true}
    >
      <div className="max-w-screen-2xl m-auto flex flex-col items-center text-center pt-48 pb-12 w-full">
        {/* Title Section - Gallery Style */}
        <div className="flex-1 w-full max-w-4xl">
          <span className="section-number text-black/60" suppressHydrationWarning>{t('home.intro.subtitle')}</span>
          <h1
            className="text-black text-4xl xs:text-5xl sm:text-6xl md:text-8xl serif italic mb-8 leading-tight animate-fade-up break-words"
            suppressHydrationWarning
          >
            {t('home.intro.title')}
          </h1>
          <p className="text-black/70 text-sm uppercase tracking-[0.3em] mt-6 max-w-xl leading-relaxed mx-auto animate-fade-up-delay" suppressHydrationWarning>
            {t('home.intro.description')}
          </p>
          <div className="mt-12 animate-fade-up-delay">
            <a
              href="#explore"
              className="btn-cta text-black border-black hover:bg-black hover:text-white"
              data-umami-event="calendly-home-hero-click"
              suppressHydrationWarning
            >
              {t('buttons.contactUs')}
            </a>
          </div>
        </div>
      </div>
    </OptimizedBackgroundImage>
  );
}

export default Intro;
