import { Metadata } from 'next'
import TeamContent from "@/components/team/TeamContent";
import { generateStaticMetadata } from '@/utils/metadata'

export const metadata: Metadata = generateStaticMetadata({
  title: 'Équipe - Rencontrez Notre Équipe',
  description: 'Découvrez l\'équipe passionnée derrière InRealArt. Experts en art, blockchain, finance et technologie unis pour révolutionner le marché de l\'art.',
  keywords: ['équipe InRealArt', 'team', 'experts art', 'blockchain experts', 'fondateurs', 'leadership'],
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/team`
})

export default function TeamPage() {
  return (
    <main className="min-h-screen text-white">
      <TeamContent />
    </main>
  );
}
