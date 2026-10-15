import { Metadata } from 'next';
import { permanentRedirect, redirect } from 'next/navigation';
import { generateStaticMetadata, BASE_URL } from '@/utils/metadata';
import { games } from '@/data/games';
import GameHero from '@/components/games/GameHero';
import GameArtist from '@/components/games/GameArtist';
import GameParticipation from '@/components/games/GameParticipation';
import GameRegistration from '@/components/games/GameRegistration';

type ParamsType = Promise<{ slug: string }>

interface Props {
  params: ParamsType
}

function isGameEnded(endDate: string): boolean {
  const today = new Date().toISOString().slice(0, 10);
  return today > endDate;
}

export async function generateStaticParams() {
  return games.map((game) => ({
    slug: game.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const game = games.find((g) => g.slug === slug);
  if (!game) return {};

  return generateStaticMetadata({
    title: game.title.fr,
    description: game.description.fr,
    canonical: `${BASE_URL}/games/${game.slug}`,
  });
}

export default async function GamePage({ params }: Props) {
  const { slug } = await params;
  const game = games.find((g) => g.slug === slug);

  if (!game) {
    permanentRedirect('/');
  }

  if (!game.active || isGameEnded(game.endDate)) {
    redirect('/');
  }

  return (
    <main className="min-h-screen text-textColor">
      <GameHero game={game} />
      <GameArtist game={game} />
      <GameParticipation game={game} />
      <GameRegistration game={game} />
    </main>
  );
}