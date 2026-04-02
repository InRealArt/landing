'use client'

import { useState } from 'react'
import { Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Send } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslation } from '@/hooks/useTranslation'
import { type HeritageArtResults } from '@/utils/heritageArtCalculations'
import Button from '../common/Button'


// Enregistrer les composants Chart.js
ChartJS.register(ArcElement, Tooltip, Legend)

interface HeritageArtResultsProps {
  results: HeritageArtResults;
  formData?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

export default function HeritageArtResults({ results, formData }: HeritageArtResultsProps) {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)

  const handleSendPDF = async () => {
    if (!formData) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/heritage-art-simulator/send-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          results,
          formData,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Afficher un message de succès
        console.log('PDF envoyé avec succès');
        toast.success(t('heritageArtSimulator.results.pdfSentSuccessfully'));
      } else {
        console.error('Erreur lors de l\'envoi du PDF');
        toast.error(t('heritageArtSimulator.results.pdfSentError'));
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(t('heritageArtSimulator.results.pdfSentError'));
    } finally {
      setIsLoading(false);
    }
  }



  // Configuration du graphique
  const chartData = {
    labels: results.chartData.labels,
    datasets: [
      {
        data: results.chartData.data,
        backgroundColor: results.chartData.colors,
        borderWidth: 2,
        borderColor: '#1f2937',
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#666666',
          padding: 16,
          font: {
            size: 11,
            family: 'Montserrat',
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.label}: ${context.parsed}%`
          },
        },
      },
    },
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="section-number block mb-2">{t('heritageArtSimulator.results.title')}</span>
        <p className="text-[12px] text-[var(--gray-text)] leading-loose">
          {t('heritageArtSimulator.results.subtitle')}
        </p>
      </div>

      {/* Recommandation principale */}
      <div className="border-l-2 border-[var(--gold-accent)] pl-5 py-2">
        <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--gray-text)] mb-3">
          {t('heritageArtSimulator.results.recommendation')}
        </p>
        <div
          className="text-[13px] text-[var(--ink-black)] leading-loose"
          dangerouslySetInnerHTML={{ __html: results.recommendation.texte }}
        />
      </div>

      {/* Graphique */}
      <div className="border border-[var(--border-light)] p-5">
        <h3 className="text-[10px] uppercase tracking-[0.25em] text-[var(--gray-text)] mb-5">
          {t('heritageArtSimulator.results.adjustedDistribution')}
        </h3>
        <div className="relative h-64">
          <Pie data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Répartition actuelle vs recommandée */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-[var(--border-light)]">
        <div className="p-5 border-b md:border-b-0 md:border-r border-[var(--border-light)]">
          <h3 className="text-[10px] uppercase tracking-[0.25em] text-[var(--gray-text)] mb-4">
            {t('heritageArtSimulator.results.currentDistribution')}
          </h3>
          <div className="divide-y divide-[var(--border-light)]">
            {(['immobilier', 'liquidites', 'financier', 'crypto', 'tangibles'] as const).map(field => (
              <div key={field} className="flex justify-between items-center py-2.5">
                <span className="text-[11px] text-[var(--gray-text)]">{t(`heritageArtSimulator.form.${field}`)}</span>
                <span className="text-[12px] text-[var(--ink-black)] font-medium">{results.patrimoineActuel[field]}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="p-5">
          <h3 className="text-[10px] uppercase tracking-[0.25em] text-[var(--gray-text)] mb-4">
            {t('heritageArtSimulator.results.recommendedDistribution')}
          </h3>
          <div className="divide-y divide-[var(--border-light)]">
            {(['immobilier', 'liquidites', 'financier', 'crypto', 'tangibles'] as const).map(field => (
              <div key={field} className="flex justify-between items-center py-2.5">
                <span className="text-[11px] text-[var(--gray-text)]">{t(`heritageArtSimulator.form.${field}`)}</span>
                <span className="text-[12px] text-[var(--ink-black)] font-medium">{results.repartitionAjustee[field]}%</span>
              </div>
            ))}
            <div className="flex justify-between items-center py-2.5 bg-[var(--ink-black)] -mx-5 px-5 mt-1">
              <span className="text-[11px] text-white/60 uppercase tracking-[0.15em]">{t('heritageArtSimulator.results.artRecommended')}</span>
              <span className="serif italic text-xl text-[var(--gold-accent)]">{results.repartitionAjustee.art}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profil */}
      <div className="border border-[var(--border-light)]">
        <div className="px-5 py-3 border-b border-[var(--border-light)] bg-[var(--soft-gray)]">
          <h3 className="text-[10px] uppercase tracking-[0.25em] text-[var(--gray-text)]">
            {t('heritageArtSimulator.results.profileSummary')}
          </h3>
        </div>
        <div className="grid grid-cols-2 divide-x divide-[var(--border-light)]">
          <div className="px-5 py-4">
            <p className="text-[10px] text-[var(--gray-text)] mb-1">{t('heritageArtSimulator.form.profil')}</p>
            <p className="text-[13px] text-[var(--ink-black)] font-medium">{results.profil}</p>
          </div>
          <div className="px-5 py-4">
            <p className="text-[10px] text-[var(--gray-text)] mb-1">{t('heritageArtSimulator.form.objectif')}</p>
            <p className="text-[13px] text-[var(--ink-black)] font-medium">{results.objectif}</p>
          </div>
        </div>
      </div>

      {/* Bouton PDF */}
      {formData && (
        <div className="pt-2 border-t border-[var(--border-light)]">
          <Button
            action={handleSendPDF}
            disabled={isLoading}
            additionalClassName={`w-full bg-purpleColor ${isLoading ? 'opacity-40 cursor-not-allowed' : ''}`}
            text={isLoading ? t('heritageArtSimulator.results.sending') : t('heritageArtSimulator.results.sendPDF')}
            icon={isLoading ? <div className="animate-spin h-4 w-4 border border-[var(--ink-black)] border-t-transparent" /> : <Send className="w-4 h-4" />}
            center
            iconBefore
          />
        </div>
      )}
    </div>
  )
} 