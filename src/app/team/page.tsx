import { Metadata } from 'next'
import TeamContent from "@/components/team/TeamContent";
import { generateStaticMetadata } from '@/utils/metadata'
import TeamFAQ from '@/components/team/TeamFAQ'

export const metadata: Metadata = generateStaticMetadata({
  title: 'L\'équipe InRealArt — Une vision, des acteurs et des artistes',
  description: 'Découvrez les profils derrière InRealArt : passioné(e)s d\'art, amoureux du patrimoine du patrimoine et experts en marketing culturel',
  keywords: ['équipe InRealArt', 'experts art', 'fondateurs plateforme', 'marketing culturel'],
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/team`
})

export default function TeamPage() {
  return (
    <main className="min-h-screen text-white">
      <TeamContent />
      <TeamFAQ />
    </main>
  );
}
