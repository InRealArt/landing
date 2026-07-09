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
    <section className="max-w-screen-2xl mx-auto px-10 pt-[calc(var(--header-height)+4rem)] pb-16">
      <div className="border-b border-[var(--border-light)] pb-12">
        <span className="section-number" data-anim="annexe-header-label">Lexique</span>
        {titleKey ? (
          <TranslatedText
            as="h1"
            translationKey={titleKey}
            className="serif italic text-5xl md:text-7xl leading-tight mb-6"
            data-anim="annexe-header-title"
          />
        ) : (
          <h1 className="serif italic text-5xl md:text-7xl leading-tight mb-6" data-anim="annexe-header-title">{title}</h1>
        )}

        {(description || descriptionKey) && (
          descriptionKey ? (
            <TranslatedText
              as="p"
              translationKey={descriptionKey}
              className="text-sm text-[var(--gray-text)] leading-loose uppercase tracking-[0.2em] max-w-xl"
              data-anim="annexe-header-desc"
            />
          ) : (
            <p className="text-sm text-[var(--gray-text)] leading-loose uppercase tracking-[0.2em] max-w-xl" data-anim="annexe-header-desc">
              {description}
            </p>
          )
        )}
      </div>
    </section>
  );
} 