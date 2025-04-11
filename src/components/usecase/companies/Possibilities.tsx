'use client'

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Button from "@/components/common/Button";
import { useLanguageStore } from '@/store/languageStore';
import processImage from "../../../../public/images/company-art-2.png";

export default function Possibilities() {
  const { t } = useLanguageStore();

  const sections = [
    {
      id: 'customization',
      image: 'https://firebasestorage.googleapis.com/v0/b/inrealartlanding-3a094.appspot.com/o/presale%2FdropPanel%2Fartist11.2.jpg?alt=media&token=19e3071b-b3ca-49a4-b9f3-62a3e20f43b7',
      title: t('companies.possibilities.sections.customization.title'),
      description: t('companies.possibilities.sections.customization.description')
    },
    {
      id: 'impact',
      image: 'https://firebasestorage.googleapis.com/v0/b/inrealartlanding-3a094.appspot.com/o/presale%2FdropPanel%2Fartist3.2.jpg?alt=media&token=aafc16cf-d49e-4ec8-93f6-b07f878a79df',
      title: t('companies.possibilities.sections.impact.title'),
      description: t('companies.possibilities.sections.impact.description')
    },
    {
      id: 'art',
      image: 'https://firebasestorage.googleapis.com/v0/b/inrealartlanding-3a094.appspot.com/o/presale%2FdropPanel%2Fartist9.1.jpg?alt=media&token=3ddda256-5f2a-4404-aa2b-a5f01d9c716e',
      title: t('companies.possibilities.sections.art.title'),
      description: t('companies.possibilities.sections.art.description')
    },
    {
      id: 'events',
      image: 'https://firebasestorage.googleapis.com/v0/b/inrealartlanding-3a094.appspot.com/o/presale%2FdropPanel%2Fartist4.1.jpg?alt=media&token=24959ffd-d81a-4c8c-9095-2b56ae07b6fa',
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
    <section className="w-full  py-16">
      <div className="max-w-90 xl:max-w-screen-xl m-auto">
        <h1 className="text-3xl md:text-5xl bricolage-grotesque mb-10">
          {t('companies.possibilities.title')}
        </h1>

        {/* Grid for sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {sections.map((section) => (
            <div key={section.id} className="bg-cardBackground rounded-lg p-6 border border-white/80">
              <div className="mb-6">
                <Image
                  src={section.image}
                  alt={section.title}
                  width={500}
                  height={300}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <h3 className="text-xl bricolage-grotesque font-medium mb-4">{section.title}</h3>
              <p className="text-sm text-gray-300 mb-4">{section.description}</p>
            </div>
          ))}
        </div>

        {/* Process Steps */}
        <div className="bg-cardBackground rounded-lg p-8 border border-white/80 mb-16">
          {/* Image */}
          <div className="mb-8">
            <Image
              src={'https://firebasestorage.googleapis.com/v0/b/inrealartlanding-3a094.appspot.com/o/presale%2FdropPanel%2Fartist4.3.jpg?alt=media&token=ef53865d-a675-4d70-88a8-a4b9660e494f'}
              alt="Our Process"
              width={1200}
              height={400}
              className="object-cover h-96 w-full"
            />
          </div>

          {/* Steps */}
          <div className="space-y-6">
            {steps.map((step) => (
              <div key={step.id} className="p-8 rounded-lg border border-white/80 bricolage-grotesque">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-base md:text-xl font-medium">
                    {step.title}
                  </h3>
                  <span className="text-base md:text-xl font-medium">
                    {step.number}
                  </span>
                </div>
                <p className="text-sm text-gray-300">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Button */}
        <div className="text-center">
          <Button
            text={t('companies.possibilities.contactButton')}
            additionalClassName="bg-purpleColor"
            icon={<ArrowRight />}
            center
            link="/contact"
          />
        </div>
      </div>
    </section>
  );
} 