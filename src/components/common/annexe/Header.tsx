'use client'

import TranslatedText from '@/components/common/TranslatedText'

interface HeaderProps {
  title?: string;
  description?: string;
  titleKey?: string;
  descriptionKey?: string;
}

export default function Header({ 
  title, 
  description, 
  titleKey, 
  descriptionKey 
}: HeaderProps) {
  return (
    <section className="max-w-90 xl:max-w-screen-xl m-auto pt-headerSize">
      {titleKey ? (
        <TranslatedText
          as="h1"
          translationKey={titleKey}
          className="text-5xl md:text-6xl bricolage-grotesque font-semibold mb-10"
        />
      ) : (
        <h1 className="text-5xl md:text-6xl bricolage-grotesque font-semibold mb-10">{title}</h1>
      )}
      
      <hr className="border-gray-700 mb-8" />
      
      {(description || descriptionKey) && (
        <div className="mb-12">
          {descriptionKey ? (
            <TranslatedText
              as="p"
              translationKey={descriptionKey}
              className="text-base md:text-lg max-w-2xl inter leading-relaxed text-gray-300"
            />
          ) : (
            <p className="text-base md:text-lg max-w-2xl inter leading-relaxed text-gray-300">
              {description}
            </p>
          )}
        </div>
      )}
    </section>
  );
} 