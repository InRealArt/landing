'use client'
import BG from "../../../public/images/intro-background.png";
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
      key: 'transactions',
      number: t('home.statistics.items.transactions.number'),
      label: t('home.statistics.items.transactions.label')
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
      <div className="flex flex-wrap gap-4 mt-10">
        {stats.map((stat) => (
          <div key={stat.key} className="w-cardMobile lg:w-card p-4 lg:p-8 border rounded-lg bg-cardBackground">
            <h1 className="text-4xl lg:text-5xl bricolage-grotesque font-semibold">{stat.number}</h1>
            <label className="mt-4 block">{stat.label}</label>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Statistics;