'use client'
import Image from 'next/image';
import { motion } from 'framer-motion';
import { GamePage } from '@/types/game';
import { useTranslation } from '@/hooks/useTranslation';
import { gameTranslations } from '@/locales/gameComponents';
import Button from '../common/Button';

interface GameHeroProps {
  game: GamePage;
}

export default function GameHero({ game }: GameHeroProps) {
  const { language } = useTranslation();
  const t = gameTranslations[language];
  return (
    <section className="relative min-h-[100vh] flex items-center justify-center py-20 px-4 overflow-hidden mt-10">
      {/* Background Image with overlay */}
      <Image
        src="/images/games/intro.webp"
        alt="Background"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/90 z-10" />

      <div className="relative z-20 max-w-7xl mx-auto grid md:grid-cols-2 gap-16 md:gap:8 items-center">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-white space-y-6"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text"
          >
            {game.title[language]}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl opacity-90"
          >
            {game.description[language]}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-4 bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20"
          >
            <p className="text-xl font-semibold flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              {t.hero.value}: €{game.artwork.value.toLocaleString()}
            </p>
            <p className="text-xl flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              {t.hero.dimensions}: {game.artwork.dimensions}
            </p>
            <p className="text-xl flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              {t.hero.medium}: {game.artwork.medium[language]}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Button
              center
              additionalClassName='w-full bg-purpleColor hover:bg-purpleColor/90 transition-colors'
              text={t.hero.participate}
              action={() => {
                const registrationForm = document.querySelector('#registration-form');
                registrationForm?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            />
          </motion.div>
        </motion.div>

        {/* Artwork Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="relative w-[70%] max-w-lg mx-auto group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg z-10 pointer-events-none" />
          <motion.div
            initial={{ rotate: -5 }}
            whileHover={{ rotate: 0 }}
            transition={{ duration: 0.4 }}
            className="relative"
          >
            <div className="relative w-full" style={{ maxHeight: '600px' }}>
              <Image
                src={game.artwork.image}
                alt={game.artwork.name}
                width={800}
                height={1000}
                className="object-contain rounded-lg shadow-2xl w-full h-auto max-h-[600px]"
                priority
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
