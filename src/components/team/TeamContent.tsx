'use client'

import { useEffect } from 'react'
import BioSlider from '@/components/common/slider/BioSlider'
import TeamCard from '@/components/common/cards/TeamCard'
import { useTeamStore } from '@/store/useTeamStore'
import { useLanguageStore } from '@/store/languageStore'

interface SocialLink {
  link: string
  icon: string
}

export default function TeamContent() {
  const { members, isLoading, hasError, errorMessage, fetchTeamMembers, getTranslatedMembers } = useTeamStore()
  const { t, language } = useLanguageStore()

  useEffect(() => {
    fetchTeamMembers()
  }, [fetchTeamMembers])

  // Re-exécuter lorsque la langue change pour mettre à jour les traductions
  useEffect(() => {
      getTranslatedMembers()
  }, [language])

  if (isLoading) {
    return <div className="text-center py-10">{t('common.loading')}</div>
  }

  if (hasError) {
    return <div className="text-center py-10 text-red-500">
      {t('common.error')}: {errorMessage || t('common.unknownError')}
    </div>
  }

  if (!members || members.length === 0) {
    return <div className="text-center py-10">{t('team.noMembers')}</div>
  }

  // Transformer les membres pour les adapter au format attendu par les composants
  const teamItems = members.map(member => {
    // Préparation des liens sociaux depuis les données
    const socials: SocialLink[] = []
    
    // Ajouter les réseaux sociaux disponibles
    if (member?.linkedinUrl) {
      socials.push({ link: member.linkedinUrl, icon: '/images/icons/linkedin.svg' })
    }
    
    if (member?.instagramUrl) {
      socials.push({ link: member.instagramUrl, icon: '/images/icons/instagram.svg' })
    }
    
    if (member?.facebookUrl) {
      socials.push({ link: member.facebookUrl, icon: '/images/icons/facebook.svg' })
    }
    
    if (member?.githubUrl) {
      socials.push({ link: member.githubUrl, icon: '/images/icons/github.svg' })
    }
    
    if (member?.twitterUrl) {
      socials.push({ link: member.twitterUrl, icon: '/images/icons/twitter.svg' })
    }
    
    if (member?.websiteUrl) {
      socials.push({ link: member.websiteUrl, icon: '/images/icons/globe.svg' })
    }
    
    return {
      socials,
      image: { src: member.photo },
      name: member.name,
      role: member.role,
      intro: member.intro,
      description: member.description
    }
  })

  return (
    <>
      <BioSlider items={teamItems} title={t('team.discoverTeam')} />
      <div className="mt-20">
        <h1 className='text-2xl lg:text-6xl bricolage-grotesque font-medium mb-6'>{t('team.meetTeam')}</h1>
        <div className="flex flex-wrap gap-4">
          {teamItems.map((item) =>
            <TeamCard key={item.name} {...item} additionalClassName="w-full lg:w-cardLarge" />
          )}
        </div>
      </div>
    </>
  )
} 