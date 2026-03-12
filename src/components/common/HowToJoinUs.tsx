'use client'

import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import Button from './Button'
import ContactModal from './ContactModal'
import { useLanguageStore } from '@/store/languageStore'

interface Step {
  number: string;
  title: string;
  description?: string;
}

interface HowToJoinUsProps {
  title?: string;
  buttonText?: string;
  buttonUrl?: string;
  steps?: Step[];
  // Props pour la modale
  useModal?: boolean;
  modalTitleKey?: string;
  modalMessageKey?: string;
}

export default function HowToJoinUs({ 
  title,
  buttonText,
  buttonUrl,
  steps: customSteps,
  useModal = false,
  modalTitleKey,
  modalMessageKey
}: HowToJoinUsProps = {}) {
  const { t } = useLanguageStore()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const displayTitle = title ? t(title) : t('joinInRealArt.howToJoin.title')
  const displayButtonText = buttonText ? t(buttonText) : t('joinInRealArt.howToJoin.button')
  const displayButtonUrl = buttonUrl || ''
  const displaySteps = customSteps || []

  const handleButtonClick = () => {
    if (useModal) {
      setIsModalOpen(true)
    }
  } 

  return (
    <section id="howToJoinUs" className="py-16 bg-backgroundColor">
      <div className="max-w-90 xl:max-w-screen-xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16">
          <h2 className="text-5xl md:text-7xl serif italic leading-tight text-textColor mb-6 md:mb-0">
            {displayTitle}
          </h2>
          {useModal ? (
            <Button
              text={displayButtonText}
              additionalClassName="bg-purpleColor w-fit"
              icon={<ArrowRight />}
              action={handleButtonClick}
            />
          ) : (
            <Button
              text={displayButtonText}
              additionalClassName="bg-purpleColor w-fit"
              icon={<ArrowRight />}
              link={displayButtonUrl}
              target={displayButtonUrl?.startsWith('#') ? '_self' : '_blank'}
            />
          )}
        </div>

        {/* Steps */}
        <div className="space-y-8">
          {displaySteps.map((step, index) => {
            const isOdd = index % 2 === 0; // index 0, 2, 4... sont impairs dans l'affichage (01, 03, 05...)
            
            return (
              <div key={index} className="relative">
                {/* Card */}
                <div className="bg-cardBackground rounded-xl p-6 md:p-8 border border-white relative z-10 flex items-center justify-center min-h-[120px]">
                  <div className="max-w-4xl text-center">
                    <h3 className="text-xl md:text-2xl font-medium bricolage-grotesque text-textColor mb-4">
                      {t(step.title)}
                    </h3>
                    {step.description && (
                      <p className="text-grayText leading-relaxed">
                        {t(step.description)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Large Number Foreground */}
                <div className={`absolute -bottom-16 z-20 ${isOdd ? '-left-6 md:-left-8' : '-right-6 md:-right-8'}`}>
                  <span className="text-purpleColor text-left font-['BricolageGrotesque-Regular',_sans-serif] text-[90px] font-normal relative w-[76px]">
                    {step.number}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modale de contact */}
      {useModal && (
        <ContactModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          title={modalTitleKey ? t(modalTitleKey) : t('contact.modal.title')}
          message={modalMessageKey ? t(modalMessageKey) : t('contact.modal.message')}
        />
      )}
    </section>
  )
} 