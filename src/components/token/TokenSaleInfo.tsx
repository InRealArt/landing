'use client'

import { useState, useEffect } from 'react';
import { useLanguageStore } from '@/store/languageStore';

interface TimerData {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function TokenSaleInfo() {
  const { t } = useLanguageStore();
  const [timeLeft, setTimeLeft] = useState<TimerData>({
    days: 12,
    hours: 7,
    minutes: 21,
    seconds: 55
  });

  // Handle countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(current => {
        // Simple timer decrement logic
        let { days, hours, minutes, seconds } = current;
        
        if (seconds > 0) {
          seconds -= 1;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes -= 1;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours -= 1;
            } else {
              hours = 23;
              if (days > 0) {
                days -= 1;
              } else {
                // Timer completed
                clearInterval(timer);
              }
            }
          }
        }
        
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Format time unit with leading zero if needed
  const formatTimeUnit = (value: number): string => {
    return value < 10 ? `0${value}` : `${value}`;
  };

  const currentRaised = 1450;
  const targetAmount = 150000;
  const progressPercentage = (currentRaised / targetAmount) * 100;

  return (
    <div className="w-full max-w-md bg-[#13111D]/70 backdrop-blur-md rounded-xl p-6 border border-[#2D2A3D]">
      <h2 className="text-center text-2xl text-white font-medium mb-6">
        {t('presale.token.countdown.title')}
      </h2>
      
      <div className="flex justify-center gap-4 mb-8">
        <div className="flex flex-col items-center">
          <div className="bg-[#2D1E69] text-white text-3xl font-bold rounded-md w-16 h-16 flex items-center justify-center">
            {formatTimeUnit(timeLeft.days)}
          </div>
          <span className="text-gray-400 text-sm mt-1">{t('presale.token.countdown.days')}</span>
        </div>
        <div className="text-white text-3xl font-bold">:</div>
        <div className="flex flex-col items-center">
          <div className="bg-[#2D1E69] text-white text-3xl font-bold rounded-md w-16 h-16 flex items-center justify-center">
            {formatTimeUnit(timeLeft.hours)}
          </div>
          <span className="text-gray-400 text-sm mt-1">{t('presale.token.countdown.hours')}</span>
        </div>
        <div className="text-white text-3xl font-bold">:</div>
        <div className="flex flex-col items-center">
          <div className="bg-[#2D1E69] text-white text-3xl font-bold rounded-md w-16 h-16 flex items-center justify-center">
            {formatTimeUnit(timeLeft.minutes)}
          </div>
          <span className="text-gray-400 text-sm mt-1">{t('presale.token.countdown.mins')}</span>
        </div>
        <div className="text-white text-3xl font-bold">:</div>
        <div className="flex flex-col items-center">
          <div className="bg-[#2D1E69] text-white text-3xl font-bold rounded-md w-16 h-16 flex items-center justify-center">
            {formatTimeUnit(timeLeft.seconds)}
          </div>
          <span className="text-gray-400 text-sm mt-1">{t('presale.token.countdown.secs')}</span>
        </div>
      </div>
      
      <div className="flex justify-between text-sm mb-2">
        <span className="text-white">
          {t('presale.token.saleProgress.raised').replace('{{amount}}', currentRaised.toString())}
        </span>
        <span className="text-white">
          {t('presale.token.saleProgress.target').replace('{{amount}}', targetAmount.toString())}
        </span>
      </div>
      
      <div className="relative h-3 w-full bg-[#1A1734] rounded-full mb-6">
        <div 
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          style={{ width: `${Math.min(progressPercentage, 100)}%` }}
        ></div>
      </div>
      
      <div className="grid grid-cols-3 text-center">
        <div className="border-r border-[#2D2A3D]">
          <p className="text-gray-400 text-xs">{t('presale.token.saleProgress.softCap')}</p>
        </div>
        <div className="border-r border-[#2D2A3D]">
          <p className="text-gray-400 text-xs">{t('presale.token.saleProgress.crowdsale')}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">{t('presale.token.saleProgress.hardCap')}</p>
        </div>
      </div>
    </div>
  );
} 