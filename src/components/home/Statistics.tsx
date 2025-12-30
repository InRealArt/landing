'use client'
import { useLanguageStore } from "@/store/languageStore";

const Statistics = () => {
  const { t } = useLanguageStore();
  const stats = [
    { 
      key: 'artists',
      number: t('home.statistics.items.artists.number'),
      label: t('home.statistics.items.artists.label')
    },
    { 
      key: 'works',
      number: t('home.statistics.items.works.number'),
      label: t('home.statistics.items.works.label')
    },
    { 
      key: 'ranking',
      number: t('home.statistics.items.ranking.number'),
      label: t('home.statistics.items.ranking.label')
    }
  ]

  return (
    <section className="w-full max-w-90 xl:max-w-screen-xl m-auto mt-36">
      <h1 className="text-4xl md:text-5xl bricolage-grotesque">{t('home.statistics.title')}</h1>
      <div className="flex flex-wrap gap-6 mt-10">
        {stats.map((stat) => (
          <div key={stat.key} className="flex-1 min-w-[280px] p-6 lg:p-10 border rounded-lg bg-cardBackground">
            <h1 className="text-4xl lg:text-6xl bricolage-grotesque font-semibold">{stat.number}</h1>
            <label className="mt-4 block text-lg">{stat.label}</label>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Statistics;