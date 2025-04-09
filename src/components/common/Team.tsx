'use client'
import Image from "next/image";
import Slider from "@/components/home/Slider";
import Button from "./Button";
import { ArrowRight } from 'lucide-react';
import { useTeamStore } from '@/store/useTeamStore';
import { useEffect, useState, Suspense } from 'react';
import { useLanguageStore } from '@/store/languageStore';
import SkeletonSlider from './SkeletonSlider';

export default function Team() {
  const { t } = useLanguageStore();
  const { members, isLoading, fetchTeamMembers } = useTeamStore();
  const [key, setKey] = useState(0);
  
  useEffect(() => {
    if (members.length === 0) {
      fetchTeamMembers();
    }
  }, [fetchTeamMembers, members.length]);
  
  // Adapter le format des membres du store pour qu'il corresponde à ce qu'attend le Slider
  const formattedMembers = members.map(member => ({
    name: member.name,
    image: { src: member.photo },
    role: member.role,
    socials: []
  }));
  
  // Force re-render when members are loaded
  useEffect(() => {
    if (members.length > 0 && !isLoading) {
      setKey(prev => prev + 1);
    }
  }, [members, isLoading]);

  return (
    <section className="mt-36 max-w-screen-2xl m-auto">
      <div className="max-w-90 xl:max-w-screen-xl md:flex justify-between w-full m-auto items-center">
        <h1 className="bricolage-grotesque text-4xl md:text-5xl">{t('home.team.title')}</h1>
        <Button text={t('buttons.team')} link="/team" additionalClassName="bg-purpleColor mr-6 mt-6 md:mt-0" icon={<ArrowRight />} />
      </div>
      
      <Suspense fallback={<SkeletonSlider context="team" additionnalClassName="relative bg-gradient" />}>
        {formattedMembers.length > 0 ? (
          <Slider 
            key={key}
            context="team" 
            items={formattedMembers} 
            additionnalClassName="relative bg-gradient" 
          />
        ) : (
          <SkeletonSlider context="team" additionnalClassName="relative bg-gradient" />
        )}
      </Suspense>
    </section>
  );
} 