'use client';

import { useState, useEffect } from 'react';
import { useLanguageStore } from '@/store/languageStore';
import { debugAnalytics } from '@/utils/analyticsDebug';
import CookieTester from '../CookieTester';
import { useGTMConsent } from '@/hooks/useGTMConsent';

// Déclaration de type pour window.gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

// Types pour la gestion des cookies
interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functionality: boolean;
}

interface CookieConsentState {
  hasConsent: boolean | null;
  showBanner: boolean;
  showPreferences: boolean;
  preferences: CookiePreferences;
}

// Fonction simplifiée pour nettoyer les préférences dans localStorage
const saveConsentPreferences = (preferences: CookiePreferences, hasConsent: boolean) => {
  localStorage.setItem('InRealArtCookieConsent', hasConsent ? 'true' : 'false');
  localStorage.setItem('InRealArtCookiePreferences', JSON.stringify(preferences));
  console.log('✅ Préférences de consentement sauvegardées:', preferences);
};

// Fonction pour nettoyer les cookies
const clearCookies = () => {
  if (typeof window === 'undefined') return;

  // Nettoyer les cookies GTM et analytiques
  const cookiesToRemove = [
    '_ga', '_ga_', '_gid', '_gat', '_gcl_au', '_gcl_aw', '_gcl_dc', '_gtm',
    '_fbp', '_fbc', 'IDE', 'test_cookie', 'NID', '1P_JAR'
  ];

  cookiesToRemove.forEach(cookieName => {
    // Supprimer pour le domaine actuel
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    // Supprimer pour tous les sous-domaines
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
  });

  // Nettoyer localStorage
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('_ga') || key.startsWith('_gid') || key.startsWith('gtm_')) {
      localStorage.removeItem(key);
    }
  });
};

const GDPRConsentBanner = () => {
  const { t } = useLanguageStore();
  const [state, setState] = useState<CookieConsentState>({
    hasConsent: null,
    showBanner: false,
    showPreferences: false,
    preferences: {
      necessary: true, // Toujours activé
      analytics: true, // Activé par défaut
      marketing: true, // Activé par défaut
      functionality: true // Activé par défaut
    }
  });

  // Utiliser le hook GTM pour la gestion du consentement
  useGTMConsent(state.hasConsent !== null ? state.preferences : null);

  // Vérifier le consentement existant au chargement avec timing optimisé
  useEffect(() => {
    const savedConsent = localStorage.getItem('InRealArtCookieConsent');
    const savedPreferences = localStorage.getItem('InRealArtCookiePreferences');
    
    if (savedConsent === 'true' && savedPreferences) {
      try {
        const preferences = JSON.parse(savedPreferences);
        setState(prev => ({
          ...prev,
          hasConsent: true,
          preferences,
          showBanner: false
        }));
        console.log('🔄 Préférences de consentement chargées:', preferences);
      } catch (error) {
        console.error('Erreur lors du parsing des préférences:', error);
        // En cas d'erreur, afficher la bannière
        setState(prev => ({ ...prev, showBanner: true }));
      }
    } else if (savedConsent === 'false') {
      setState(prev => ({
        ...prev,
        hasConsent: false,
        showBanner: false,
        preferences: { necessary: true, analytics: false, marketing: false, functionality: false }
      }));
    } else {
      // STRATEGY: Délai stratégique pour montrer la bannière après engagement
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          showBanner: true,
          preferences: {
            necessary: true,
            analytics: true,
            marketing: true,
            functionality: true
          }
        }));
      }, 3000); // Apparaît après 3 secondes d'engagement
    }
  }, []);

  // Gérer l'acceptation de tous les cookies
  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      functionality: true
    };
    
    setState(prev => ({
      ...prev,
      hasConsent: true,
      showBanner: false,
      showPreferences: false,
      preferences: allAccepted
    }));

    saveConsentPreferences(allAccepted, true);
    
    // Debug analytics after consent
    setTimeout(() => {
      debugAnalytics();
    }, 2000);
  };

  // Gérer le refus de tous les cookies
  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
      functionality: false
    };

    setState(prev => ({
      ...prev,
      hasConsent: false,
      showBanner: false,
      showPreferences: false,
      preferences: onlyNecessary
    }));

    saveConsentPreferences(onlyNecessary, false);
    clearCookies();
  };

  // Gérer l'acceptation des préférences personnalisées
  const handleAcceptPreferences = () => {
    setState(prev => ({
      ...prev,
      hasConsent: true,
      showBanner: false,
      showPreferences: false
    }));

    saveConsentPreferences(state.preferences, true);
  };

  // Gérer l'ouverture des préférences
  const handleShowPreferences = () => {
    setState(prev => ({
      ...prev,
      showPreferences: true
    }));
  };

  // Gérer la fermeture des préférences
  const handleClosePreferences = () => {
    setState(prev => ({
      ...prev,
      showPreferences: false
    }));
  };

  // Gérer le changement des préférences
  const handlePreferenceChange = (category: keyof CookiePreferences, value: boolean) => {
    if (category === 'necessary') return; // Ne pas permettre de désactiver les cookies nécessaires
    
    setState(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [category]: value
      }
    }));
  };

  // Supprimer tous les cookies et recharger
  const handleDeleteCookies = () => {
    clearCookies();
    localStorage.removeItem('InRealArtCookieConsent');
    localStorage.removeItem('InRealArtCookiePreferences');
    window.location.reload();
  };

  return (
    <>
      {/* Composant de test des cookies (toujours visible) */}
      <CookieTester onDeleteCookies={handleDeleteCookies} />

      {/* Bannière principale - Style InRealArt Gallery */}
      {state.showBanner && (
        <div className="fixed bottom-0 left-0 right-0 bg-canvas-white text-ink-black z-50 border-t border-border-light">
          <div className="max-w-screen-2xl mx-auto px-10 py-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex-1">
                <span className="section-number mb-4 block">
                  {t('cookieConsent.consent')}
                </span>
                
                <h3 className="serif text-4xl md:text-5xl italic leading-tight text-ink-black mb-4">
                  Expérience{' '}
                  <span className="text-gold-accent not-italic">personnalisée</span>
                </h3>
                
                <p className="text-[13px] text-gray-500 leading-loose mb-6 max-w-2xl">
                  {t('cookieConsent.valueProposition')}
                </p>

                {/* Benefits list - Style élégant */}
                <div className="mb-6 space-y-2">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 bg-gold-accent rounded-full"></span>
                    <span>{t('cookieConsent.benefit1')}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 bg-gold-accent rounded-full"></span>
                    <span>{t('cookieConsent.benefit2')}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 bg-gold-accent rounded-full"></span>
                    <span>{t('cookieConsent.benefit3')}</span>
                  </div>
                </div>

                <button
                  className="text-[10px] uppercase tracking-[0.25em] text-gold-accent hover:text-ink-black transition-colors border-b border-gold-accent/30 pb-1"
                  onClick={handleShowPreferences}
                >
                  {t('cookieConsent.managePreferences')}
                </button>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={handleRejectAll}
                  className="btn-cta"
                >
                  {t('cookieConsent.rejectAll')}
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="btn-cta"
                >
                  {t('cookieConsent.acceptAll')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal des préférences - Style InRealArt Gallery */}
      {state.showPreferences && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-canvas-white rounded-none max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-border-light">
            <div className="p-10">
              <div className="flex justify-between items-start mb-8 border-b border-border-light pb-6">
                <div>
                  <span className="section-number mb-2 block">
                    {t('cookieConsent.preferences')}
                  </span>
                  <h2 className="serif text-4xl md:text-5xl italic text-ink-black">
                    Vos préférences{' '}
                    <span className="text-gold-accent not-italic">cookies</span>
                  </h2>
                </div>
                <button
                  onClick={handleClosePreferences}
                  className="text-gray-400 hover:text-ink-black transition-colors text-3xl font-light"
                  aria-label="Fermer"
                >
                  ×
                </button>
              </div>

              {/* Notice élégante */}
              <div className="bg-soft-gray border-l border-gold-accent p-6 mb-8">
                <p className="serif text-xl italic text-ink-black mb-2">
                  {t('cookieConsent.transparencyNotice')}
                </p>
                <p className="text-[13px] text-gray-500 leading-loose">
                  {t('cookieConsent.transparencyDescription')}
                </p>
              </div>

              <div className="space-y-6">
                {/* Cookies nécessaires - Toujours activés */}
                <div className="border-t border-border-light pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg serif italic text-ink-black">{t('cookieConsent.necessary')}</h3>
                    <span className="text-[9px] uppercase tracking-[0.25em] text-gray-400 bg-soft-gray px-3 py-1">
                      {t('cookieConsent.alwaysActive')}
                    </span>
                  </div>
                  <p className="text-[13px] text-gray-500 leading-loose mb-3">
                    {t('cookieConsent.necessaryDescription')}
                  </p>
                  <div className="text-[12px] text-gray-400 space-y-1">
                    <p>{t('cookieConsent.sessionCookies')}</p>
                    <p>{t('cookieConsent.securityCookies')}</p>
                  </div>
                </div>

                {/* Cookies marketing */}
                <div className="border-t border-border-light pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg serif italic text-ink-black">{t('cookieConsent.marketing')}</h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={state.preferences.marketing}
                        onChange={(e) => handlePreferenceChange('marketing', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-accent"></div>
                    </label>
                  </div>
                  <p className="text-[13px] text-gray-500 leading-loose mb-3">
                    {t('cookieConsent.marketingDescription')}
                  </p>
                  {!state.preferences.marketing && (
                    <div className="text-[12px] text-gray-400 italic serif">
                      Publicités génériques, offres non ciblées
                    </div>
                  )}
                </div>

                {/* Cookies fonctionnels */}
                <div className="border-t border-border-light pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg serif italic text-ink-black">{t('cookieConsent.functionality')}</h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={state.preferences.functionality}
                        onChange={(e) => handlePreferenceChange('functionality', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-accent"></div>
                    </label>
                  </div>
                  <p className="text-[13px] text-gray-500 leading-loose mb-3">
                    {t('cookieConsent.functionalityDescription')}
                  </p>
                  {!state.preferences.functionality && (
                    <div className="text-[12px] text-gray-400 italic serif">
                      Préférences non sauvegardées, pas de personnalisation
                    </div>
                  )}
                </div>

                {/* Cookies analytiques */}
                <div className="border-t border-border-light pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg serif italic text-ink-black">{t('cookieConsent.analytics')}</h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={state.preferences.analytics}
                        onChange={(e) => handlePreferenceChange('analytics', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-accent"></div>
                    </label>
                  </div>
                  <p className="text-[13px] text-gray-500 leading-loose mb-3">
                    {t('cookieConsent.analyticsDescription')}
                  </p>
                  {!state.preferences.analytics && (
                    <div className="text-[12px] text-gray-400 italic serif">
                      Statistiques anonymes, pas d'amélioration personnalisée
                    </div>
                  )}
                </div>
              </div>

              {/* Boutons d'action - Style InRealArt */}
              <div className="flex flex-col gap-4 mt-10 pt-8 border-t border-border-light">
                <div className="flex gap-4">
                  <button
                    onClick={handleClosePreferences}
                    className="btn-cta flex-1"
                  >
                    {t('cookieConsent.cancel')}
                  </button>
                  <button
                    onClick={handleAcceptPreferences}
                    className="btn-cta flex-1"
                  >
                    {t('cookieConsent.savePreferences')}
                  </button>
                </div>
                <div className="text-center">
                  <button
                    onClick={handleRejectAll}
                    className="text-[10px] uppercase tracking-[0.25em] text-gray-400 hover:text-ink-black transition-colors underline"
                  >
                    {t('cookieConsent.continueWithoutAccepting')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GDPRConsentBanner;
