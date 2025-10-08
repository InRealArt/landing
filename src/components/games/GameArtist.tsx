'use client'
import Image from 'next/image';
import { motion } from 'framer-motion';
import { GamePage } from '@/types/game';
import { useTheme } from '@/contexts/ThemeContext';
import { gameTranslations } from '@/locales/gameComponents';
import { useLanguageStore } from '@/store/languageStore';

interface GameArtistProps {
  game: GamePage;
}

export default function GameArtist({ game }: GameArtistProps) {
  const { language } = useLanguageStore();
  const t = gameTranslations[language];
  const { theme } = useTheme();
  
  return (
    <section className="relative py-20 px-4 bg-gradient-to-b from-background to-background/50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center gap-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4"
          >
            <div className="relative w-32 h-8 md:h-10">
              <Image
                src="/icons/Logo.png"
                alt="InRealArt"
                fill
                className={`object-contain ${theme === 'light' ? 'invert' : ''}`}
              />
            </div>
            <span className="text-3xl md:text-6xl text-primary font-unbounded">×</span>
            <h2 className="text-2xl md:text-3xl font-bold text-textColor">
              {game.artist.name}
            </h2>
          </motion.div>

          {/* Decorative elements */}
          <div className="relative w-full max-w-md h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent">
            <div className="absolute -top-[2px] left-1/2 -translate-x-1/2 w-4 h-4">
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
              <div className="absolute inset-0 bg-primary rounded-full" />
            </div>
          </div>

          <div className="space-y-4 text-center">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-textColor/80"
            >
              {t.artist.title}
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              onClick={() => {
                const artistImage = document.querySelector('#artist-image');
                artistImage?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              className="flex flex-col items-center gap-2 cursor-pointer hover:scale-105 transition-transform m-auto"
            >
              <p className="text-lg font-medium text-primary">
                {t.artist.discoverArtist}
              </p>
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: [0, 5, 0] }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-primary"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14M19 12l-7 7-7-7"/>
                </svg>
              </motion.div>
            </motion.button>
          </div>

          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-primary/5 to-transparent opacity-50 blur-3xl" />
            <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-radial from-primary/5 to-transparent opacity-50 blur-3xl" />
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Artist Image */}
          <div id="artist-image" className="relative aspect-square w-full max-w-md mx-auto">
            <Image
              src={game.artist.image}
              alt={game.artist.name}
              fill
              className="object-cover rounded-full"
            />
          </div>

          {/* Artist Info */}
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold">{game.artist.name}</h3>
            {game.artist.bio && (
              <p className="text-lg leading-relaxed text-textColor/80">
                {game.artist.bio[language]}
              </p>
            )}
            
            {/* Social Links */}
            {game.artist.socialLinks && (
              <div className="flex gap-4 pt-4">
                {game.artist.socialLinks.instagram && (
                  <a
                    href={game.artist.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-textColor hover:text-primary transition-colors"
                  >
                    Instagram
                  </a>
                )}
                {/* Add other social links as needed */}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
