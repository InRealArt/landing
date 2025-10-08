import { notFound } from 'next/navigation';
import { games } from '@/data/games';
import GameHero from '@/components/games/GameHero';
import GameArtist from '@/components/games/GameArtist';
import GameParticipation from '@/components/games/GameParticipation';
import GameRegistration from '@/components/games/GameRegistration';

type ParamsType = Promise<{ slug: string }>

interface Props {
  params: ParamsType
}

export async function generateStaticParams() {
  return games.map((game) => ({
    slug: game.slug,
  }));
}

export default async function GamePage({ params }: Props) {
  const { slug } = await params;
  const game = games.find((g) => g.slug === slug);
  
  if (!game || !game.active) {
    notFound();
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