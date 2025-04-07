'use client'
import Image from "next/image";
import Slider from "@/components/home/Slider";
import teamImage from "../../../public/images/team.png";
import Button from "./Button";
import { ArrowRight } from 'lucide-react';
import { useTeamStore } from '@/store/useTeamStore';
import { useEffect, useState } from 'react';
import { useLanguageStore } from '@/store/languageStore';

export default function Team() {
  const { t } = useLanguageStore();
  const { members, isLoading, fetchTeamMembers } = useTeamStore();
  const [key, setKey] = useState(0); // Ajouter une clé pour forcer le rendu
  
  useEffect(() => {
    if (members.length === 0) {
      fetchTeamMembers();
      console.log('fetchTeamMembers');
    }
  }, [fetchTeamMembers]);
  
  // Données temporaires pour l'affichage en attendant le chargement depuis Firebase
  const defaultTeamImages = [
    { 
      image: { src: teamImage.src }, 
      name: "Team people 1", 
      role: 'Directeur Artistique', 
      socials: [] 
    },
    { 
      image: { src: teamImage.src }, 
      name: "Team people 2", 
      role: 'Directeur Artistique', 
      socials: [] 
    },
    { 
      image: { src: teamImage.src }, 
      name: "Team people 3", 
      role: 'Directeur Artistique', 
      socials: [] 
    },
    { 
      image: { src: teamImage.src }, 
      name: "Team people 4", 
      role: 'Directeur Artistique', 
      socials: [] 
    },
  ];

  // Adapter le format des membres du store pour qu'il corresponde à ce qu'attend le Slider
  const formattedMembers = members.map(member => ({
    name: member.name,
    image: { src: member.photo },
    role: member.role,
    socials: []
  }));

  const teamImages = isLoading || members.length === 0 ? defaultTeamImages : formattedMembers;
  
  // Force re-render when members are loaded
  useEffect(() => {
    if (members.length > 0 && !isLoading) {
      setKey(prev => prev + 1);
    }
  }, [members, isLoading]);

  // Log pour déboguer
  useEffect(() => {
    console.log('Team members from store:', members);
    console.log('Formatted team images for slider:', teamImages);
  }, [members, teamImages]);

  return (
    <section className="mt-36 max-w-screen-2xl m-auto">
      <div className="max-w-90 xl:max-w-screen-xl md:flex justify-between w-full m-auto items-center">
        <h1 className="bricolage-grotesque text-4xl md:text-5xl">{t('home.team.title')}</h1>
        <Button text={t('buttons.team')} link="/team" additionalClassName="bg-purpleColor mr-6 mt-6 md:mt-0" icon={<ArrowRight />} />
      </div>
      <Slider 
        key={key} // Ajouter une clé pour forcer le rendu
        context="team" 
        items={teamImages} 
        additionnalClassName="relative bg-gradient" 
      />
    </section>
  );
} 