'use client'

import { useState } from 'react'
import { Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { toast } from 'sonner'
import { useLanguageStore } from '@/store/languageStore'
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
  const { t } = useLanguageStore()
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
          color: '#ffffff',
          padding: 20,
          font: {
            size: 12,
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
    <div className="bg-backgroundColor p-8 shadow-2xl border border-gray-800 rounded-b-2xl lg:rounded-r-2xl lg:rounded-l-none text-textColor space-y-8">
      <div className="text-center">
        <h2 className="text-2xl lg:text-3xl font-bold text-textColor mb-4 font-bricolage">
          {t('heritageArtSimulator.results.title')}
        </h2>
        <p className="text-grayText text-lg">
          {t('heritageArtSimulator.results.subtitle')}
        </p>
      </div>

      {/* Recommandation principale */}
      <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-6 rounded-xl border border-purple-500/20">
        <h3 className="text-xl font-semibold mb-4 text-center">
          📊 {t('heritageArtSimulator.results.recommendation')}
        </h3>
        <div 
          className="text-center text-lg leading-relaxed"
          dangerouslySetInnerHTML={{ __html: results.recommendation.texte }}
        />
      </div>

      {/* Graphique */}
      <div className="bg-gray-800/50 p-6 rounded-xl">
        <h3 className="text-xl font-semibold mb-6 text-center">
          {t('heritageArtSimulator.results.adjustedDistribution')}
        </h3>
        <div className="relative h-80">
          <Pie data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Détails de la répartition */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Patrimoine actuel */}
        <div className="bg-gray-800/50 p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-4">
            {t('heritageArtSimulator.results.currentDistribution')}
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>{t('heritageArtSimulator.form.immobilier')}:</span>
              <span className="font-semibold">{results.patrimoineActuel.immobilier}%</span>
            </div>
            <div className="flex justify-between">
              <span>{t('heritageArtSimulator.form.liquidites')}:</span>
              <span className="font-semibold">{results.patrimoineActuel.liquidites}%</span>
            </div>
            <div className="flex justify-between">
              <span>{t('heritageArtSimulator.form.financier')}:</span>
              <span className="font-semibold">{results.patrimoineActuel.financier}%</span>
            </div>
            <div className="flex justify-between">
              <span>{t('heritageArtSimulator.form.crypto')}:</span>
              <span className="font-semibold">{results.patrimoineActuel.crypto}%</span>
            </div>
            <div className="flex justify-between">
              <span>{t('heritageArtSimulator.form.tangibles')}:</span>
              <span className="font-semibold">{results.patrimoineActuel.tangibles}%</span>
            </div>
          </div>
        </div>

        {/* Répartition recommandée */}
        <div className="bg-gray-800/50 p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-4">
            {t('heritageArtSimulator.results.recommendedDistribution')}
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>{t('heritageArtSimulator.form.immobilier')}:</span>
              <span className="font-semibold">{results.repartitionAjustee.immobilier}%</span>
            </div>
            <div className="flex justify-between">
              <span>{t('heritageArtSimulator.form.liquidites')}:</span>
              <span className="font-semibold">{results.repartitionAjustee.liquidites}%</span>
            </div>
            <div className="flex justify-between">
              <span>{t('heritageArtSimulator.form.financier')}:</span>
              <span className="font-semibold">{results.repartitionAjustee.financier}%</span>
            </div>
            <div className="flex justify-between">
              <span>{t('heritageArtSimulator.form.crypto')}:</span>
              <span className="font-semibold">{results.repartitionAjustee.crypto}%</span>
            </div>
            <div className="flex justify-between">
              <span>{t('heritageArtSimulator.form.tangibles')}:</span>
              <span className="font-semibold">{results.repartitionAjustee.tangibles}%</span>
            </div>
            <div className="flex justify-between text-purple-400 font-bold border-t border-gray-600 pt-3">
              <span>{t('heritageArtSimulator.results.artRecommended')}:</span>
              <span>{results.repartitionAjustee.art}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Informations sur le profil */}
      <div className="bg-gray-800/50 p-6 rounded-xl">
        <h3 className="text-lg font-semibold mb-4">
          {t('heritageArtSimulator.results.profileSummary')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between">
            <span>{t('heritageArtSimulator.form.profil')}:</span>
            <span className="font-semibold">{results.profil}</span>
          </div>
          <div className="flex justify-between">
            <span>{t('heritageArtSimulator.form.objectif')}:</span>
            <span className="font-semibold">{results.objectif}</span>
          </div>
        </div>
      </div>

      {/* Boutons d'action */}
      {formData && (
        <Button
          action={handleSendPDF}
          disabled={isLoading}
          additionalClassName={`w-full text-textColor font-medium py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 font-unbounded ${
            isLoading 
              ? 'bg-backgroundColor/10 cursor-not-allowed opacity-50' 
              : 'bg-purple-600 hover:bg-purple-700'
          }`}
          text={isLoading ? t('heritageArtSimulator.results.sending') : t('heritageArtSimulator.results.sendPDF')}
          icon={isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <span>📧</span>}
          center
        />
      )}
    </div>
  )
} 