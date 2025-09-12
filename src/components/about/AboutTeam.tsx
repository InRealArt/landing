'use client'

import OptimizedBackgroundImage from '@/components/common/OptimizedBackgroundImage'
import { useLanguageStore } from '@/store/languageStore'
import Button from '@/components/common/Button'
import TranslatedText from '@/components/common/TranslatedText'
import { ArrowRight } from 'lucide-react'

export default function AboutTeam() {
  const { t } = useLanguageStore()

  return (
    <section className="relative w-full py-12 md:py-16">
      <div className="max-w-90 xl:max-w-screen-xl mx-auto relative">
        {/* Fond gris rectangulaire qui s'étend sur les côtés avec des marges */}
        <div className="absolute left-0 right-0 top-0 h-1/3 bg-backgroundGrey transform -translate-y-4"></div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 px-8">
          
          {/* Colonne gauche - Contenu textuel avec image - élargie */}
          <div className="space-y-6 flex flex-col w-full">
            {/* Titre principal - aligné avec le haut de l'image 2 */}
            <div className="text-textColor">
              <TranslatedText
                translationKey="about.team.title"
                as="h2"
                className="bricolage-grotesque text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight"
                allowHtml={true}
              />
            </div>
            
            {/* Image de l'équipe */}
            <OptimizedBackgroundImage
              src="/images/about/about_team_photo1.webp"
              alt="Équipe professionnelle au travail"
              fill={true}
              className="w-4/5 mx-auto aspect-[4/3] rounded-2xl"
              quality={90}
              priority={false}
            />
            
            {/* Premier paragraphe */}
            <div className="text-textColor/90 leading-relaxed">
              <TranslatedText
                translationKey="about.team.paragraph1"
                as="h3"
                className="bricolage-grotesque text-xl font-semibold text-textColor mb-2"
                allowHtml={true}
              />
              <TranslatedText
                translationKey="about.team.paragraph1Description"
                as="p"
                className="text-sm"
                allowHtml={true}
              />
            </div>
            
            {/* Deuxième paragraphe */}
            <div className="text-textColor/80 leading-relaxed">
              <TranslatedText
                translationKey="about.team.paragraph2"
                as="h3"
                className="bricolage-grotesque text-xl font-semibold text-textColor mb-2"
                allowHtml={true}
              />
              <TranslatedText
                translationKey="about.team.paragraph2Description"
                as="p"
                className="text-sm"
                allowHtml={true}
              />
            </div>
            
            {/* Troisième paragraphe */}
            <div className="text-textColor/80 leading-relaxed">
              <TranslatedText
                translationKey="about.team.paragraph3"
                as="h3"
                className="bricolage-grotesque text-xl font-semibold text-textColor mb-2"
                allowHtml={true}
              />
              <TranslatedText
                translationKey="about.team.paragraph3Description"
                as="p"
                className="text-sm"
                allowHtml={true}
              />
            </div>

            {/* Sous-titre avec partie en violet */}
            {/* <div className="text-textColor/90 leading-relaxed">
              <p className="text-lg">
                {t('about.team.subtitlePart1')}{' '}
                <span className="text-purpleColor font-semibold">
                  {t('about.team.subtitlePart2')}
                </span>
              </p>
            </div> */}
            
            {/* Bouton - aligné avec le bas de l'image 2 */}
            <div className="pt-2">
              <Button 
                text={t('about.team.buttonText')}
                additionalClassName="bg-purpleColor"
                icon={<ArrowRight />}
                link="/team"
              />
            </div>
          </div>
          
          {/* Colonne droite - Image de la personne au travail - avec marges */}
          <div className="relative w-4/5 mx-auto flex items-end">
            <OptimizedBackgroundImage
              src="/images/about/about_team_photo2.webp"
              alt="Personne travaillant sur un ordinateur portable"
              fill={true}
              className="w-full aspect-[2/3] rounded-2xl"
              quality={90}
              priority={false}
            />
          </div>
          
        </div>
      </div>
    </section>
  )
}
