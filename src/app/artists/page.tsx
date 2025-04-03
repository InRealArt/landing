'use client'
import { useEffect } from 'react';
import BioSlider from "@/components/common/slider/BioSlider";
import ArtworkCard from "@/components/common/cards/ArtworkCardOrder";
import Button from "@/components/common/Button";
import { ArrowRight } from "lucide-react";
import { useArtistStore } from '@/store/useArtistStore';
import Image from 'next/image';

export default function Artists() {
  const { 
    artists, 
    fetchArtists, 
    isLoading, 
    hasError, 
    setCurrentArtistIndex, 
    getCurrentArtistArtworks 
  } = useArtistStore();

  useEffect(() => {
    fetchArtists();
  }, [fetchArtists]);

  const formattedArtists = artists.map(artist => ({
    name: artist.name,
    role: artist.role,
    intro: artist.intro,
    description: artist.description,
    image: { src: artist.photo }
  }));

  const artworkImages = getCurrentArtistArtworks().map(artwork => ({
    ...artwork,
    image: { src: artwork.url }
  }));

  if (isLoading) {
    return <div className="mt-headerSize text-center">Chargement des artistes...</div>;
  }

  if (hasError) {
    return <div className="mt-headerSize text-center">Erreur lors du chargement des artistes</div>;
  }

  if (artists.length === 0) {
    return <div className="mt-headerSize text-center">Aucun artiste trouvé</div>;
  }

  return (
    <>
      <section className="relative max-w-90 xl:max-w-screen-xl m-auto mt-headerSize">
        <BioSlider 
          items={formattedArtists} 
          title="Qui est" 
          hasArtistName 
          onSlideChange={setCurrentArtistIndex} 
        />
        <div className="mt-20">
          <h1 className='text-2xl lg:text-6xl bricolage-grotesque font-medium mb-6'>Découvrez les œuvres de notre artiste</h1>
          <div className="flex flex-wrap gap-4">
            {artworkImages.map((item, index) => <ArtworkCard key={`${item.name}-${index}`} {...item} />)}
          </div>
        </div>

        <section className="flex flex-col md:flex-row justify-between gap-10 md:gap-20 items-center mt-32">
          <div className="flex-1">
            <h1 className="bricolage-grotesque text-6xl mb-3">Le mot de <br />l&apos;expert(e)</h1>
            <p className="bricolage-grotesque text-base">Forte de +80 années d&apos;expérience cumulée, notre équipe commerciale sélectionne avec soin moins de 100 œuvres de top artistes.</p>
          </div>
          <div className="flex-1">
            <p className="bricolage-grotesque text-base mb-5">Ici, chaque œuvre, qu&apos;elle soit physique ou numérique, est soigneusement sélectionnée pour son caractère unique.
              Pour les collectionneurs aguerris comme pour les novices, la possibilité d&apos;acquérir des œuvres aussi rares est un privilège qui permet de se démarquer tout en enrichissant une collection de manière significative</p>
            <Button text="Voir la marketplace" additionalClassName="bg-purpleColor" icon={<ArrowRight />} />
          </div>
        </section>
      </section>
    </>
  );
}
