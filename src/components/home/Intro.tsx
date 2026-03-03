'use client'
import { motion, type Variants } from 'framer-motion'
import OptimizedBackgroundImage from '../common/OptimizedBackgroundImage';
import Button from "../common/Button";
import { useLanguageStore } from '@/store/languageStore';
import HeroArtistSlider from './HeroArtistSlider';
import { useTheme } from '@/contexts/ThemeContext';
import { EXTERNAL_URLS } from '@/constants/constants';

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18, delayChildren: 0.2 },
  },
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
}

const fadeRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.9, ease: 'easeOut' } },
}

const Intro = () => {
  const { t } = useLanguageStore();
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
      <motion.div
        className="max-w-90 xl:max-w-screen-xl m-auto flex flex-col lg:flex-row items-center text-center lg:text-left gap-8 lg:gap-12 py-headerSizeMobile md:py-headerSize"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Title Section */}
        <div className="flex-1">
          <motion.h1
            className="text-white text-4xl md:text-6xl bricolage-grotesque font-medium mb-6 w-full md:max-w-[80%]"
            variants={fadeUp}
          >
            {t('home.intro.title')}
          </motion.h1>
          <motion.div className="mt-12 md:mt-4" variants={fadeUp}>
            <Button
              text={t('buttons.contactUs')}
              additionalClassName="bg-purpleColor"
              center
              target="_blank"
              link={EXTERNAL_URLS.CALENDLY_MEETING}
              data-umami-event="calendly-home-hero-click"
            />
          </motion.div>
        </div>

        {/* Artist Slider Section */}
        <motion.div className="flex-1 w-full max-w-2xl" variants={fadeRight}>
          <HeroArtistSlider />
        </motion.div>
      </motion.div>
    </OptimizedBackgroundImage>
  );
}

export default Intro;
