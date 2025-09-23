'use client';

import { useState, useEffect } from 'react';
import { useLanguageStore } from '@/store/languageStore';
import { initializeGTM } from '@/utils/gtm';
import { debugAnalytics } from '@/utils/analyticsDebug';
import CookieTester from '../CookieTester';

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

// Fonction pour initialiser Google Consent Mode v2
const initializeGoogleConsentMode = (preferences: CookiePreferences) => {
  if (typeof window === 'undefined') return;

  // Initialiser dataLayer si pas déjà fait
  window.dataLayer = window.dataLayer || [];
  
  // Fonction gtag
  function gtag(...args: any[]) {
    window.dataLayer?.push(args);
  }

  // Mise à jour selon les préférences (pas de default ici, déjà fait dans layout.tsx)
  gtag('consent', 'update', {
    'analytics_storage': preferences.analytics ? 'granted' : 'denied',
    'ad_storage': preferences.marketing ? 'granted' : 'denied',
    'ad_user_data': preferences.marketing ? 'granted' : 'denied',
    'ad_personalization': preferences.marketing ? 'granted' : 'denied',
    'functionality_storage': preferences.functionality ? 'granted' : 'denied',
    'personalization_storage': preferences.functionality ? 'granted' : 'denied'
  });

  // Initialiser Google Analytics et GTM si analytics activé
  if (preferences.analytics && typeof window !== 'undefined') {
    // Charger GTM
    const gtmScript = document.createElement('script');
    gtmScript.async = true;
    gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${process.env.NEXT_PUBLIC_GTM_ID || "GTM-NBR8FBBP"}`;
    document.head.appendChild(gtmScript);

    // Charger GA4
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-LRX6096NCS';
    document.head.appendChild(gaScript);

    // Configurer GA4
    gtag('js', new Date());
    gtag('config', 'G-LRX6096NCS', {
      'send_page_view': true
    });
  }
};

// Fonction pour nettoyer les cookies
const clearCookies = () => {
  if (typeof window === 'undefined') return;

  // Nettoyer les cookies Google Analytics
  const cookiesToRemove = [
    '_ga', '_ga_', '_gid', '_gat', '_gcl_au', '_gcl_aw', '_gcl_dc',
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

  // Vérifier le consentement existant au chargement
  useEffect(() => {
    const savedConsent = localStorage.getItem('cookieConsent');
    const savedPreferences = localStorage.getItem('cookiePreferences');
    
    if (savedConsent === 'true' && savedPreferences) {
      const preferences = JSON.parse(savedPreferences);
      setState(prev => ({
        ...prev,
        hasConsent: true,
        preferences,
        showBanner: false
      }));
      initializeGoogleConsentMode(preferences);
      initializeGTM(true);
    } else if (savedConsent === 'false') {
      setState(prev => ({
        ...prev,
        hasConsent: false,
        showBanner: false
      }));
      initializeGoogleConsentMode({ necessary: true, analytics: false, marketing: false, functionality: false });
      initializeGTM(false);
    } else {
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

    localStorage.setItem('cookieConsent', 'true');
    localStorage.setItem('cookiePreferences', JSON.stringify(allAccepted));
    
    initializeGoogleConsentMode(allAccepted);
    initializeGTM(true);
    
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

    localStorage.setItem('cookieConsent', 'false');
    localStorage.setItem('cookiePreferences', JSON.stringify(onlyNecessary));
    
    clearCookies();
    initializeGoogleConsentMode(onlyNecessary);
    initializeGTM(false);
  };

  // Gérer l'acceptation des préférences personnalisées
  const handleAcceptPreferences = () => {
    setState(prev => ({
      ...prev,
      hasConsent: true,
      showBanner: false,
      showPreferences: false
    }));

    localStorage.setItem('cookieConsent', 'true');
    localStorage.setItem('cookiePreferences', JSON.stringify(state.preferences));
    
    initializeGoogleConsentMode(state.preferences);
    initializeGTM(state.preferences.analytics || state.preferences.marketing);
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
    localStorage.removeItem('cookieConsent');
    localStorage.removeItem('cookiePreferences');
    window.location.reload();
  };

  return (
    <>
      {/* Composant de test des cookies (toujours visible) */}
      <CookieTester onDeleteCookies={handleDeleteCookies} />

      {/* Bannière principale */}
      {state.showBanner && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-6 z-50 border-t border-gray-700">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">
                  {t('cookieConsent.title')}
                </h3>
                <p className="text-gray-300 text-sm mb-4">
                  {t('cookieConsent.description')}
                </p>
                <button 
                  className="text-purple-400 text-sm underline hover:text-purple-300"
                  onClick={handleShowPreferences}
                >
                  {t('cookieConsent.managePreferences')}
                </button>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleRejectAll}
                  className="px-4 py-2 border border-gray-600 text-white rounded hover:bg-gray-800 transition-colors"
                >
                  {t('cookieConsent.rejectAll')}
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                >
                  {t('cookieConsent.acceptAll')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal des préférences */}
      {state.showPreferences && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {t('cookieConsent.preferencesTitle')}
                </h2>
                <button
                  onClick={handleClosePreferences}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Cookies nécessaires */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{t('cookieConsent.necessary')}</h3>
                    <div className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-sm">
                      {t('cookieConsent.alwaysActive')}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {t('cookieConsent.necessaryDescription')}
                  </p>
                </div>

                {/* Cookies analytiques */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{t('cookieConsent.analytics')}</h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={state.preferences.analytics}
                        onChange={(e) => handlePreferenceChange('analytics', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                  <p className="text-sm text-gray-600">
                    {t('cookieConsent.analyticsDescription')}
                  </p>
                </div>

                {/* Cookies marketing */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{t('cookieConsent.marketing')}</h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={state.preferences.marketing}
                        onChange={(e) => handlePreferenceChange('marketing', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                  <p className="text-sm text-gray-600">
                    {t('cookieConsent.marketingDescription')}
                  </p>
                </div>

                {/* Cookies fonctionnels */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{t('cookieConsent.functionality')}</h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={state.preferences.functionality}
                        onChange={(e) => handlePreferenceChange('functionality', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                  <p className="text-sm text-gray-600">
                    {t('cookieConsent.functionalityDescription')}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-6 border-t">
                <button
                  onClick={handleClosePreferences}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                >
                  {t('cookieConsent.cancel')}
                </button>
                <button
                  onClick={handleAcceptPreferences}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                >
                  {t('cookieConsent.savePreferences')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GDPRConsentBanner;
