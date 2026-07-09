import React, { useState } from 'react';
import { Send, Euro, Users, MapPin } from 'lucide-react';
import { type ArtSalonResults as ArtSalonResultsType, formatPrice } from '@/utils/artSalonCalculations';
import { useTranslation } from '@/hooks/useTranslation';
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
  const { t } = useTranslation();
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
          <div className="space-y-4">
            {/* Personal Info Card */}
            <div className="border border-[var(--border-light)] p-5">
              <h3 className="text-xs uppercase tracking-[0.25em] text-[var(--gray-text)] mb-4 flex items-center gap-2">
                <Users className="w-3.5 h-3.5" />
                {t('artSalonSimulator.results.sections.personalInfo')}
              </h3>
              <div className="space-y-1.5 text-sm text-[var(--ink-black)] leading-loose">
                <p><span className="text-[var(--gray-text)]">{t('artSalonSimulator.results.labels.name')} </span>{results.personalInfo.firstName} {results.personalInfo.lastName}</p>
                <p><span className="text-[var(--gray-text)]">{t('artSalonSimulator.results.labels.email')} </span>{results.personalInfo.email}</p>
                <p><span className="text-[var(--gray-text)]">{t('artSalonSimulator.results.labels.phone')} </span>{results.personalInfo.phone}</p>
              </div>
            </div>

            {/* Exhibition Details Card */}
            <div className="border border-[var(--border-light)] p-5">
              <h3 className="text-xs uppercase tracking-[0.25em] text-[var(--gray-text)] mb-4 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" />
                {t('artSalonSimulator.results.sections.salonDetails')}
              </h3>
              <div className="space-y-1.5 text-sm text-[var(--ink-black)] leading-loose">
                <p><span className="text-[var(--gray-text)]">{t('artSalonSimulator.results.labels.exhibition')} </span>{results.salonDetails.name}</p>
                <p><span className="text-[var(--gray-text)]">{t('artSalonSimulator.results.labels.formula')} </span>{results.salonDetails.formula}</p>
                <p><span className="text-[var(--gray-text)]">{t('artSalonSimulator.results.labels.duration')} </span>{results.salonDetails.days} {t('artSalonSimulator.results.labels.days')}</p>
                <p><span className="text-[var(--gray-text)]">{t('artSalonSimulator.results.labels.persons')} </span>{results.salonDetails.persons}
                  {results.salonDetails.professionalSupport && <span className="text-[var(--gold-accent)]"> (+1 pro)</span>}
                </p>
                <p><span className="text-[var(--gray-text)]">{t('artSalonSimulator.results.labels.comfort')} </span>{results.salonDetails.accommodationComfort}</p>
                <p><span className="text-[var(--gray-text)]">{t('artSalonSimulator.results.labels.proSupport')} </span>{results.salonDetails.professionalSupport ? t('artSalonSimulator.results.labels.yes') : t('artSalonSimulator.results.labels.no')}</p>
              </div>
            </div>

            {/* Total Cost */}
            <div className="border border-[var(--ink-black)] bg-[var(--ink-black)] p-6 text-center">
              <h3 className="text-xs uppercase tracking-[0.25em] text-white/60 mb-3 flex items-center justify-center gap-2">
                <Euro className="w-3.5 h-3.5" />
                {t('artSalonSimulator.results.sections.totalCost')}
              </h3>
              <p className="serif italic text-4xl text-white">
                {formatPrice(results.breakdown.total)}
              </p>
              <p className="text-sm uppercase tracking-[0.2em] text-white/50 mt-3">
                {results.totalPersons === 1
                  ? t('artSalonSimulator.results.labels.forPersons').replace('{count}', results.totalPersons.toString())
                  : t('artSalonSimulator.results.labels.forPersons_plural').replace('{count}', results.totalPersons.toString())
                }
              </p>
            </div>
          </div>
        )}

        {activeTab === 'breakdown' && (
          <div className="space-y-0">
            <h3 className="text-xs uppercase tracking-[0.25em] text-[var(--gray-text)] mb-4 flex items-center gap-2">
              <Euro className="w-3.5 h-3.5" />
              {t('artSalonSimulator.results.breakdown.title')}
            </h3>

            <div className="divide-y divide-[var(--border-light)] border border-[var(--border-light)]">
              <div className="px-5 py-4 flex justify-between items-center">
                <span className="text-sm text-[var(--gray-text)]">
                  {t('artSalonSimulator.results.breakdown.transport').replace('{count}', results.totalPersons.toString())}
                </span>
                <span className="text-sm text-[var(--ink-black)] font-medium">{formatPrice(results.breakdown.transport)}</span>
              </div>

              <div className="px-5 py-4 flex justify-between items-center">
                <span className="text-sm text-[var(--gray-text)]">
                  {t('artSalonSimulator.results.breakdown.accommodation')
                    .replace('{nights}', Math.max(0, results.salonDetails.days - 1).toString())
                    .replace('{persons}', results.totalPersons.toString())
                  }
                </span>
                <span className="text-sm text-[var(--ink-black)] font-medium">{formatPrice(results.breakdown.accommodation)}</span>
              </div>

              <div className="px-5 py-4 flex justify-between items-center">
                <span className="text-sm text-[var(--gray-text)]">
                  {t('artSalonSimulator.results.breakdown.pass').replace('{persons}', results.totalPersons.toString())}
                </span>
                <span className="text-sm text-[var(--ink-black)] font-medium">{formatPrice(results.breakdown.pass)}</span>
              </div>

              {results.breakdown.comfortSupplement > 0 && (
                <div className="px-5 py-4 flex justify-between items-center">
                  <span className="text-sm text-[var(--gray-text)]">{t('artSalonSimulator.results.breakdown.comfortSupplement')}</span>
                  <span className="text-sm text-[var(--ink-black)] font-medium">{formatPrice(results.breakdown.comfortSupplement)}</span>
                </div>
              )}

              <div className="px-5 py-4 flex justify-between items-center bg-[var(--ink-black)]">
                <span className="text-xs uppercase tracking-[0.2em] text-white/70">{t('artSalonSimulator.results.breakdown.total')}</span>
                <span className="serif italic text-2xl text-white">{formatPrice(results.breakdown.total)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Send PDF Button */}
      <div className="mt-8 pt-6 border-t border-[var(--border-light)]">
        <Button
          action={handleSendPDF}
          disabled={isSendingPDF || !formData}
          additionalClassName={`w-full ${!formData || isSendingPDF ? 'opacity-40 cursor-not-allowed' : ''} bg-purpleColor`}
          center
          text={isSendingPDF ? 'Envoi...' : t('artSalonSimulator.pdf.downloadButton')}
          icon={isSendingPDF ? <div className="animate-spin h-4 w-4 border border-[var(--ink-black)] border-t-transparent" /> : <Send className="w-4 h-4" />}
          iconBefore
        />
      </div>
    </div>
  );
} 