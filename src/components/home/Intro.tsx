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

  const overlayColor = theme === 'light' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'

  return (
    <OptimizedBackgroundImage
      src="/images/home/hero/bg.webp"
      alt="Arrière-plan de la section d'introduction"
      width={1920}
      height={1080}
      className="bg-cover m-auto bg-no-repeat bg-bottom w-full flex items-center justify-center md:mt-0 min-h-screen"
      contentClassName="max-w-90 xl:max-w-screen-xl m-auto"
      overlay
      overlayColor={overlayColor}
      overlayOpacity={0.6}
      priority={true}
    >
      <div className="max-w-90 xl:max-w-screen-xl m-auto flex flex-col lg:flex-row items-center text-center lg:text-left gap-8 lg:gap-12 py-headerSizeMobile md:py-headerSize">
        {/* Title Section */}
        <div className="flex-1">
          <h1
            className="text-white text-4xl md:text-6xl bricolage-grotesque font-medium mb-6 w-full md:max-w-[80%] animate-fade-up"
          >
            {t('home.intro.title')}
          </h1>
          <div className="mt-12 md:mt-4 animate-fade-up-delay">
            <Button
              text={t('buttons.contactUs')}
              additionalClassName="bg-purpleColor"
              center
              target="_blank"
              link={EXTERNAL_URLS.CALENDLY_MEETING}
              data-umami-event="calendly-home-hero-click"
            />
          </div>
        </div>

        {/* Artist Slider Section */}
        <div className="flex-1 w-full max-w-2xl animate-fade-right">
          <HeroArtistSlider />
        </div>
      </div>
    </OptimizedBackgroundImage>
  );
}

export default Intro;
