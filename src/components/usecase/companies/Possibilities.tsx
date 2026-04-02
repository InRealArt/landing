'use client'

import OptimizedImage from "@/components/common/OptimizedImage";
import { ArrowRight } from "lucide-react";
import Button from "@/components/common/Button";
import { useTranslation } from '@/hooks/useTranslation';

export default function Possibilities() {
  const { t } = useTranslation();

  const sections = [
    {
      id: 'customization',
      image: '/images/usecase/companies/usecase_companies_1.avif',
      title: t('companies.possibilities.sections.customization.title'),
      description: t('companies.possibilities.sections.customization.description')
    },
    {
      id: 'impact',
      image: '/images/usecase/companies/usecase_companies_2.avif',
      title: t('companies.possibilities.sections.impact.title'),
      description: t('companies.possibilities.sections.impact.description')
    },
    {
      id: 'art',
      image: '/images/usecase/companies/usecase_companies_3.avif',
      title: t('companies.possibilities.sections.art.title'),
      description: t('companies.possibilities.sections.art.description')
    },
    {
      id: 'events',
      image: '/images/usecase/companies/usecase_companies_5.avif',
      title: t('companies.possibilities.sections.events.title'),
      description: t('companies.possibilities.sections.events.description')
    }
  ];

  const steps = [
    {
      id: 1,
      title: t('companies.possibilities.steps.step1.title'),
      description: t('companies.possibilities.steps.step1.description'),
      number: t('companies.possibilities.steps.step1.number')
    },
    {
      id: 2,
      title: t('companies.possibilities.steps.step2.title'),
      description: t('companies.possibilities.steps.step2.description'),
      number: t('companies.possibilities.steps.step2.number')
    },
    {
      id: 3,
      title: t('companies.possibilities.steps.step3.title'),
      description: t('companies.possibilities.steps.step3.description'),
      number: t('companies.possibilities.steps.step3.number')
    }
  ];

  return (
    <section className="w-full py-32 px-10 bg-[var(--canvas-bg)]">
      <div className="max-w-screen-2xl mx-auto">

        {/* Section header */}
        <div data-anim="poss-title" className="border-b border-[var(--border-light)] pb-12 mb-16">
          <span className="section-number">{t('companies.possibilities.sectionLabel')}</span>
          <h2 className="text-6xl md:text-8xl serif leading-tight">
            {t('companies.possibilities.title')}<span className="italic text-[var(--gold-accent)]">{t('companies.possibilities.titleHighlight')}</span>
          </h2>
        </div>

        {/* Grid for sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--border-light)] mb-20">
          {sections.map((section) => (
            <div
              key={section.id}
              data-anim="poss-card"
              className="bg-[var(--canvas-bg)] p-0 flex flex-col group"
            >
              <div className="overflow-hidden h-56 border border-[var(--border-light)]">
                <OptimizedImage
                  src={section.image}
                  alt={section.title}
                  width={500}
                  height={300}
                  className="w-full h-full [&_img]:w-full [&_img]:h-full [&_img]:object-cover [&_img]:transition-transform [&_img]:duration-700 group-hover:[&_img]:scale-[1.03]"
                />
              </div>
              <div className="p-8 border border-t-0 border-[var(--border-light)] flex-1">
                <h3 className="serif italic text-2xl mb-4">{section.title}</h3>
                <p className="text-[12px] text-[var(--gray-text)] leading-loose">{section.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Process — full-width image + steps */}
        <div data-anim="poss-process" className="border border-[var(--border-light)] mb-20">
          <div className="overflow-hidden h-72 md:h-[28rem]">
            <OptimizedImage
              src="/images/usecase/companies/usecase_companies_4.avif"
              alt="Our Process"
              width={1200}
              height={400}
              className="w-full h-full [&_img]:w-full [&_img]:h-full [&_img]:object-cover"
            />
          </div>
          <div className="divide-y divide-[var(--border-light)]">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col md:flex-row md:items-start gap-6 p-8">
                <span className="serif text-4xl italic text-[var(--gold-accent)] min-w-[60px] shrink-0">
                  {step.number}
                </span>
                <div className="flex-1">
                  <h3 className="serif italic text-2xl mb-3">{step.title}</h3>
                  <p className="text-[12px] text-[var(--gray-text)] leading-loose">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Button */}
        <div className="flex justify-center">
          <Button
            text={t('companies.possibilities.contactButton')}
            additionalClassName="bg-purpleColor"
            icon={<ArrowRight size={12} />}
            center
            link="/contact"
          />
        </div>

      </div>
    </section>
  );
} 