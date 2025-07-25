import React, { useState } from 'react';
import { Send, Euro, Users, MapPin } from 'lucide-react';
import { type ArtSalonResults as ArtSalonResultsType, formatPrice } from '@/utils/artSalonCalculations';
import { useLanguageStore } from '@/store/languageStore';
import { toast } from 'sonner';
import Button from '@/components/common/Button';
import TabNavigation, { TabItem } from '@/components/common/TabNavigation';

interface ArtSalonResultsProps {
  results: ArtSalonResultsType;
  formData?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

type ResultsTab = 'summary' | 'breakdown';

export default function ArtSalonResults({ results, formData }: ArtSalonResultsProps) {
  const { t } = useLanguageStore();
  const [activeTab, setActiveTab] = useState<ResultsTab>('summary');
  const [isSendingPDF, setIsSendingPDF] = useState(false);

  const handleSendPDF = async () => {
    if (!formData) {
      toast.error(t('artSalonSimulator.toast.formDataRequired'));
      return;
    }

    setIsSendingPDF(true);
    try {
      const response = await fetch('/api/art-salon-simulator/send-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData,
          results
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(t('artSalonSimulator.toast.pdfSentSuccess'));
      } else {
        toast.error(result.message || t('artSalonSimulator.toast.pdfSentError'));
      }
    } catch (error) {
      console.error('Error sending PDF:', error);
      toast.error(t('artSalonSimulator.toast.pdfSentError'));
    } finally {
      setIsSendingPDF(false);
    }
  };

  // Tab configuration for the generic TabNavigation component
  const tabs: TabItem<ResultsTab>[] = [
    { id: 'summary', label: t('artSalonSimulator.results.tabs.summary') },
    { id: 'breakdown', label: t('artSalonSimulator.results.tabs.breakdown') },
  ];

  return (
    <div className="h-full">
      {/* Tab Navigation */}
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="mb-6"
      />

      {/* Tab Content */}
      <div className="flex-1">
        {activeTab === 'summary' && (
          <div className="space-y-6">
            {/* Personal Info Card */}
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Users className="w-5 h-5" />
                {t('artSalonSimulator.results.sections.personalInfo')}
              </h3>
              <div className="space-y-2 text-purple-100">
                <p><strong>{t('artSalonSimulator.results.labels.name')}</strong> {results.personalInfo.firstName} {results.personalInfo.lastName}</p>
                <p><strong>{t('artSalonSimulator.results.labels.email')}</strong> {results.personalInfo.email}</p>
                <p><strong>{t('artSalonSimulator.results.labels.phone')}</strong> {results.personalInfo.phone}</p>
              </div>
            </div>

            {/* Exhibition Details Card */}
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {t('artSalonSimulator.results.sections.salonDetails')}
              </h3>
              <div className="space-y-2 text-purple-100">
                <p><strong>{t('artSalonSimulator.results.labels.exhibition')}</strong> {results.salonDetails.name}</p>
                <p><strong>{t('artSalonSimulator.results.labels.formula')}</strong> {results.salonDetails.formula}</p>
                <p><strong>{t('artSalonSimulator.results.labels.duration')}</strong> {results.salonDetails.days} {t('artSalonSimulator.results.labels.days')}</p>
                <p><strong>{t('artSalonSimulator.results.labels.persons')}</strong> {results.salonDetails.persons}
                  {results.salonDetails.professionalSupport && <span className="text-yellow-300"> (+1 pro)</span>}
                </p>
                <p><strong>{t('artSalonSimulator.results.labels.comfort')}</strong> {results.salonDetails.accommodationComfort}</p>
                <p><strong>{t('artSalonSimulator.results.labels.proSupport')}</strong> {results.salonDetails.professionalSupport ? t('artSalonSimulator.results.labels.yes') : t('artSalonSimulator.results.labels.no')}</p>
              </div>
            </div>

            {/* Total Cost */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold text-white mb-2 flex items-center justify-center gap-2">
                <Euro className="w-6 h-6" />
                {t('artSalonSimulator.results.sections.totalCost')}
              </h3>
              <p className="text-4xl font-bold text-white">
                {formatPrice(results.breakdown.total)}
              </p>
              <p className="text-purple-100 mt-2">
                {results.totalPersons === 1
                  ? t('artSalonSimulator.results.labels.forPersons').replace('{count}', results.totalPersons.toString())
                  : t('artSalonSimulator.results.labels.forPersons_plural').replace('{count}', results.totalPersons.toString())
                }
              </p>
            </div>
          </div>
        )}

        {activeTab === 'breakdown' && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Euro className="w-5 h-5" />
              {t('artSalonSimulator.results.breakdown.title')}
            </h3>

            <div className="space-y-3">
              <div className="bg-white bg-opacity-10 rounded-lg p-4 flex justify-between items-center">
                <span className="text-purple-100">
                  {t('artSalonSimulator.results.breakdown.transport').replace('{count}', results.totalPersons.toString())}
                </span>
                <span className="text-white font-semibold">{formatPrice(results.breakdown.transport)}</span>
              </div>

              <div className="bg-white bg-opacity-10 rounded-lg p-4 flex justify-between items-center">
                <span className="text-purple-100">
                  {t('artSalonSimulator.results.breakdown.accommodation')
                    .replace('{nights}', Math.max(0, results.salonDetails.days - 1).toString())
                    .replace('{persons}', results.totalPersons.toString())
                  }
                </span>
                <span className="text-white font-semibold">{formatPrice(results.breakdown.accommodation)}</span>
              </div>

              <div className="bg-white bg-opacity-10 rounded-lg p-4 flex justify-between items-center">
                <span className="text-purple-100">
                  {t('artSalonSimulator.results.breakdown.pass').replace('{persons}', results.totalPersons.toString())}
                </span>
                <span className="text-white font-semibold">{formatPrice(results.breakdown.pass)}</span>
              </div>

              {results.breakdown.comfortSupplement > 0 && (
                <div className="bg-white bg-opacity-10 rounded-lg p-4 flex justify-between items-center">
                  <span className="text-purple-100">{t('artSalonSimulator.results.breakdown.comfortSupplement')}</span>
                  <span className="text-white font-semibold">{formatPrice(results.breakdown.comfortSupplement)}</span>
                </div>
              )}
            </div>

            <div className="border-t border-purple-300 pt-4">
              <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg p-4 flex justify-between items-center">
                <span className="text-white font-bold text-lg">{t('artSalonSimulator.results.breakdown.total')}</span>
                <span className="text-white font-bold text-2xl">{formatPrice(results.breakdown.total)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Send PDF Button */}
      <div className="mt-8 pt-6 border-t border-purple-300">
        <Button
          action={handleSendPDF}
          disabled={isSendingPDF || !formData}
          additionalClassName={`w-full py-3 px-4 rounded-lg transition-colors duration-200 ${!formData
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700'
            } ${isSendingPDF ? 'opacity-50 cursor-not-allowed' : ''}`}
          center
          text={isSendingPDF ? 'Envoi...' : t('artSalonSimulator.pdf.downloadButton')}
          icon={isSendingPDF ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-700" /> : <Send className="w-5 h-5" />}
          iconBefore
        />
      </div>
    </div>
  );
} 