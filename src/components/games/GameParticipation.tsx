'use client'
import Image from 'next/image';
import { motion } from 'framer-motion';
import { GamePage } from '@/types/game';
import { useLanguageStore } from '@/store/languageStore';
import { gameTranslations } from '@/locales/gameComponents';

interface GameParticipationProps {
  game: GamePage;
}

export default function GameParticipation({ game }: GameParticipationProps) {
  const { language } = useLanguageStore();
  const t = gameTranslations[language];
  return (
    <section className="py-20 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-center mb-16"
        >
          {t.participation.title}
        </motion.h2>

        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Steps */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1"
          >
            <div className="grid gap-6">
              {game.howToParticipate[language].steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="p-6 rounded-lg bg-gradient-to-br from-background/80 to-background/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-primary/20"
                >
                  <div className="relative">
                    <div className="font-unbounded w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold mb-4 relative z-10">
                      {index + 1}
                    </div>
                    <div className="absolute top-0 left-0 w-12 h-12 rounded-full bg-primary/20 animate-ping" />
                  </div>
                  <p className="text-lg relative z-10">{step}</p>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Participation Image */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:flex-1"
          >
            <motion.div 
              initial={{ rotate: 5 }}
              whileHover={{ rotate: 0 }}
              transition={{ duration: 0.4 }}
              className="relative aspect-[4/3] w-full max-w-xl mx-auto group"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 via-primary/0 to-primary/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
              <Image
                src={game.mockup}
                alt="Participation"
                fill
                className="object-cover rounded-lg shadow-xl group-hover:scale-[1.02] transition-transform duration-500"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
