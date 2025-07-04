'use client'

import { ArrowRight } from 'lucide-react'
import Button from './Button'
import { useLanguageStore } from '@/store/languageStore'

export default function HowToJoinUs() {
  const { t } = useLanguageStore()

  const urlForm = 'https://docs.google.com/forms/d/1RxKNtLG2XZ7BB2CpzGI4yJZCjSJ3cSXwOHQKgwVC4gA/viewform?edit_requested=true#responses'
  const steps = [
    {
      number: '01',
      title: t('joinInRealArt.howToJoin.steps.1.title'),
      description: ''
    },
    {
      number: '02',
      title: t('joinInRealArt.howToJoin.steps.2.title'),
      description: ''
    },
    {
      number: '03',
      title: t('joinInRealArt.howToJoin.steps.3.title'),
      description: ''
    }
  ]

  return (
    <section className="py-16 bg-backgroundColor">
      <div className="max-w-90 xl:max-w-screen-xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium bricolage-grotesque text-white mb-6 md:mb-0">
            {t('joinInRealArt.howToJoin.title')}
          </h2>
          <Button
            text={t('joinInRealArt.howToJoin.button')}
            icon={<ArrowRight className="w-5 h-5" />}
            additionalClassName="bg-purpleColor text-white hover:bg-purpleColor/90 transition-colors"
            link={urlForm}
            target="_blank"
          />
        </div>

        {/* Steps */}
        <div className="space-y-8">
          {steps.map((step, index) => {
            const isOdd = index % 2 === 0; // index 0, 2, 4... sont impairs dans l'affichage (01, 03, 05...)
            
            return (
              <div key={index} className="relative">
                {/* Card */}
                <div className="bg-cardBackground rounded-xl p-6 md:p-8 border border-white relative z-10 flex items-center justify-center min-h-[120px]">
                  <div className="max-w-4xl text-center">
                    <h3 className="text-xl md:text-2xl font-medium bricolage-grotesque text-white mb-4">
                      {step.title}
                    </h3>
                    {step.description && (
                      <p className="text-gray-300 inter leading-relaxed">
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Large Number Foreground */}
                <div className={`absolute -bottom-16 z-20 ${isOdd ? '-left-6 md:-left-8' : '-right-6 md:-right-8'}`}>
                  <span className="text-[#313131] text-left font-['BricolageGrotesque-Regular',_sans-serif] text-[90px] font-normal relative w-[76px]">
                    {step.number}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  )
} 