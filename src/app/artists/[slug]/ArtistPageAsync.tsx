import ArtistPageClientWrapper from './ArtistPageClientWrapper'

interface Props {
  slug: string
}

export default function ArtistPageAsync({ slug }: Props) {
  return <ArtistPageClientWrapper slug={slug} />
}
