'use client'

import { useLanguageStore } from '@/store/languageStore';

interface ArtistProfileProps {
  artist: {
    name: string;
    role: string;
    intro: string;
    description: string;
    photo: string;
  };
}

export default function ArtistProfile({ artist }: ArtistProfileProps) {
  const { t } = useLanguageStore();

  return (
    <div>
      <h1 className='text-2xl lg:text-6xl bricolage-grotesque font-medium mb-6'>
        {t('artistPage.whoIs')} {artist.name} ?
      </h1>
      <div className='w-full rounded-lg h-full flex flex-col lg:flex-row bg-cardBackground'>
        <div 
          className='bg-cover bg-no-repeat bg-center h-96 lg:h-auto w-full lg:w-1/3 rounded-lg' 
          style={{ backgroundImage: `url('${artist.photo}')` }} 
        />
        <div className='p-6 lg:px-20 lg:pt-20 lg:pb-6 flex-1 flex flex-col gap-6'>
          {artist.intro && (
            <h2 className='inter font-bold text-base md:text-lg text-white'>
              &ldquo;{artist.intro}&rdquo;
            </h2>
          )}
          <p className='inter text-xs font-medium md:text-base'>
            {artist.description}
          </p>
          <div>
            <p className='inter font-bold text-base text-white mb-2'>{artist.name}</p>
            <p className='inter text-base font-medium'>{artist.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 