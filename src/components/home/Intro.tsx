'use client'
import OptimizedBackgroundImage from '../common/OptimizedBackgroundImage';
import Button from "../common/Button";
import { useLanguageStore } from '@/store/languageStore';
import HeroArtistSlider from './HeroArtistSlider';
import { useTheme } from '@/contexts/ThemeContext';
import { EXTERNAL_URLS } from '@/constants/constants';

const Intro = () => {
  const t = useLanguageStore(state => state.t);

  const { theme } = useTheme();

  const overlayColor = theme === 'light' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.3)'

  return (
    <OptimizedBackgroundImage
      src="/images/home/hero/bg.webp"
      alt="Arrière-plan de la section d'introduction"
      width={1920}
      height={1080}
      className="bg-cover m-auto bg-no-repeat bg-bottom w-full flex items-center justify-center md:mt-0 min-h-screen"
      contentClassName="max-w-screen-2xl m-auto px-10"
      overlay
      overlayColor={overlayColor}
      overlayOpacity={0.4}
      priority={true}
    >
      <div className="max-w-screen-2xl m-auto flex flex-col items-center text-center pt-48 pb-12">
        {/* Title Section - Gallery Style */}
        <div className="flex-1 max-w-4xl">
          <span className="section-number text-white/70">{t('home.intro.subtitle')}</span>
          <h1
            className="text-white text-6xl md:text-8xl serif italic mb-8 leading-tight animate-fade-up"
          >
            {t('home.intro.title')}
          </h1>
          <p className="text-white/80 text-[11px] uppercase tracking-[0.3em] mt-6 max-w-xl leading-relaxed mx-auto animate-fade-up-delay">
            {t('home.intro.description')}
          </p>
          <div className="mt-12 animate-fade-up-delay">
            <a
              href="#explore"
              className="btn-cta text-white border-white hover:bg-white hover:text-black"
              data-umami-event="calendly-home-hero-click"
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
