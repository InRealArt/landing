import ArtistsFAQ from '@/components/artists/ArtistsFAQ'

export default function ArtistsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <ArtistsFAQ />
    </>
  )
} 