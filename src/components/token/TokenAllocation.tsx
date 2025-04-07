'use client'

import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { useLanguageStore } from '@/store/languageStore';

export default function TokenAllocation() {
  const { t } = useLanguageStore();
  const [activeTab, setActiveTab] = useState('distribution');
  const [activeCell, setActiveCell] = useState<string | null>(null);
  // Data for the distribution chart
  const distributionData = [
    { name: 'Funding', value: 37, color: '#4F46E5' },
    { name: 'Team/Founders', value: 18, color: '#7C3AED' },
    { name: 'Treasury', value: 15, color: '#A855F7' },
    { name: 'Rewards', value: 15, color: '#EC4899' },
    { name: 'Liquidity', value: 10, color: '#F97316' },
    { name: 'Airdrop', value: 5, color: '#6EE7B7' },
  ];

  return (
    <section className="py-20 container mx-auto px-4">
      <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center bricolage-grotesque">
        {t('presale.token.allocation.title')}
      </h2>
      <p className="text-center mb-8 bricolage-grotesque">
        {t('presale.token.allocation.subtitle')}
      </p>

      {/* Tabs */}
      <div className="flex justify-center mb-10">
        <div className="bg-cardBackground rounded-full p-1 inline-flex unbounded">
          <button
            className={`py-2 px-6 rounded-full text-sm font-medium transition-all ${activeTab === 'distribution' ? 'bg-purpleColor text-white' : 'text-gray-400'
              }`}
            onClick={() => setActiveTab('distribution')}
          >
            {t('presale.token.allocation.tabs.distribution')}
          </button>
          <button
            className={`py-2 px-6 rounded-full text-sm font-medium transition-all ${activeTab === 'funding' ? 'bg-purpleColor text-white' : 'text-gray-400'
              }`}
            onClick={() => setActiveTab('funding')}
          >
            {t('presale.token.allocation.tabs.funding')}
          </button>
        </div>
      </div>

      {/* Chart or Text Content based on active tab */}
      {activeTab === 'distribution' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  fill="#8884d8"
                  blendStroke
                  dataKey="value"
                  onPointerEnter={(e) => {
                    setActiveCell(e.name)
                  }}
                  onPointerLeave={() => setActiveCell(null)}
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            {distributionData.map((item, index) => (
              <div key={index} className="flex flex-col">
                <span className="text-sm mb-2 unbounded">{t(`presale.token.allocation.distribution.${item.name.toLowerCase().replace(' ', '')}`)}: {item.value}%</span>
                <div className={`w-full bg-cardBackground h-3 rounded-full overflow-hidden mr-3`}>
                  <div
                    className={`h-full rounded-full ${activeCell === item.name ? `!bg-white/70` : ''}`}
                    style={{ width: `${item.value}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-cardBackground rounded-xl p-8 max-w-3xl mx-auto">
          <p className="mb-6 text-gray-300">
            {t('presale.token.allocation.funding.description')}
          </p>
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="font-bold text-purpleColor mr-2">•</span>
              <div>
                <span className="font-medium">{t('presale.token.allocation.funding.privateSales.title')}</span>
                <p className="text-gray-300 text-sm">{t('presale.token.allocation.funding.privateSales.description')}</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="font-bold text-purpleColor mr-2">•</span>
              <div>
                <span className="font-medium">{t('presale.token.allocation.funding.publicSales.title')}</span>
                <p className="text-gray-300 text-sm">{t('presale.token.allocation.funding.publicSales.description')}</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="font-bold text-purpleColor mr-2">•</span>
              <div>
                <span className="font-medium">{t('presale.token.allocation.funding.liquidityPools.title')}</span>
                <p className="text-gray-300 text-sm">{t('presale.token.allocation.funding.liquidityPools.description')}</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="font-bold text-purpleColor mr-2">•</span>
              <div>
                <span className="font-medium">{t('presale.token.allocation.funding.teamAdvisors.title')}</span>
                <p className="text-gray-300 text-sm">{t('presale.token.allocation.funding.teamAdvisors.description')}</p>
              </div>
            </li>
          </ul>
        </div>
      )}
    </section>
  );
} 