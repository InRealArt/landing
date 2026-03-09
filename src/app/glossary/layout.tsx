import { Metadata } from 'next'
import { generateStaticMetadata, generateDefinedTermSetJsonLd } from '@/utils/metadata'
import { glossaryItems } from '@/data/glossary'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'
const GLOSSARY_URL = `${BASE_URL}/glossary`

export const metadata: Metadata = generateStaticMetadata({
  title: 'Glossaire - Termes et Définitions',
  description: "Retrouvez tous les termes techniques utilisés dans l'univers de la blockchain, des NFTs et de l'art digital pour mieux comprendre notre écosystème.",
  keywords: ['glossaire', 'définitions', 'termes blockchain', 'NFT', 'art digital', 'patrimoine', 'défiscalisation', 'IRA selection', 'IRA edition', 'IRA placement', 'IRA agance', 'patrimoine', 'culture', 'impact'],
  canonical: GLOSSARY_URL
})

export default function GlossaryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = generateDefinedTermSetJsonLd(
    'Glossaire InRealArt',
    "Collection de termes et définitions sur l'art défiscalisé, la gestion de patrimoine",
    GLOSSARY_URL,
    glossaryItems
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      {children}
    </>
  )
}
