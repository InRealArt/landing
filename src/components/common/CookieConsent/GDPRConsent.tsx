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

// Fonction pour initialiser Google Consent Mode v2 (Next.js standard)
const initializeGoogleConsentMode = (preferences: CookiePreferences) => {
  if (typeof window === 'undefined') return;

  // Initialiser dataLayer si pas déjà fait
  window.dataLayer = window.dataLayer || [];
  
  // Fonction gtag
  function gtag(...args: any[]) {
    window.dataLayer?.push(args);
  }

  // Mise à jour du consent mode (Next.js standard)
  gtag('consent', 'update', {
    'analytics_storage': preferences.analytics ? 'granted' : 'denied',
    'ad_storage': preferences.marketing ? 'granted' : 'denied',
    'ad_user_data': preferences.marketing ? 'granted' : 'denied',
    'ad_personalization': preferences.marketing ? 'granted' : 'denied',
    'functionality_storage': preferences.functionality ? 'granted' : 'denied',
    'personalization_storage': preferences.functionality ? 'granted' : 'denied'
  });
  
  console.log('Consent mode updated:', preferences);
  
  // CRITICAL: Gérer l'activation/désactivation de GTM après consent
  if (preferences.analytics && window.gtag) {
    setTimeout(() => {
      console.log('🔄 Updating GTM consent after user choice...');
      
      // CRITICAL: Configuration domaine selon Context7 pour GTM
      const currentDomain = window.location.hostname;
      console.log('🌐 Current domain:', currentDomain);
      
      // Envoyer un événement GTM pour confirmer le consentement
      window.gtag('event', 'consent_granted', {
        'event_category': 'engagement',
        'event_label': 'analytics_enabled_gtm'
      });
      
      // Envoyer page view via GTM dataLayer
      window.gtag('event', 'page_view', {
        'page_title': document.title,
        'page_location': window.location.href
      });
      
      // Diagnostic des cookies GTM créés
      setTimeout(() => {
        const allCookies = document.cookie;
        const gtmCookies = document.cookie.split(';').filter(c => 
          c.includes('_ga') || c.includes('_gid') || c.includes('_gtm') || c.includes('_gcl')
        );
        
        console.log('🍪 All cookies:', allCookies);
        console.log('🔍 GTM cookies found:', gtmCookies);
        console.log('📍 Current domain:', window.location.hostname);
        console.log('🔐 Is HTTPS:', window.location.protocol === 'https:');
        
        if (gtmCookies.length > 0) {
          console.log('✅ GTM cookies successfully created via dataLayer!');
        } else {
          console.warn('⚠️ No GTM cookies found - this may be normal if GTM is handling it differently');
        }
      }, 1500);
    }, 500);
  }
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

  // Vérifier le consentement existant au chargement avec timing optimisé
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
      
      // CRITICAL: Attendre que GTM soit chargé avant de configurer le consent
      setTimeout(() => {
        console.log('🔄 Initializing GTM consent for existing user...');
        initializeGoogleConsentMode(preferences);
        initializeGTM(true);
      }, 1000);
    } else if (savedConsent === 'false') {
      setState(prev => ({
        ...prev,
        hasConsent: false,
        showBanner: false
      }));
      initializeGoogleConsentMode({ necessary: true, analytics: false, marketing: false, functionality: false });
      initializeGTM(false);
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
                {/* Gamification - Social Proof */}
                <div className="bg-green-600 text-white px-3 py-2 rounded-lg mb-3 text-center">
                  <p className="text-sm font-semibold">
                    ✅ {t('cookieConsent.socialProof')}
                  </p>
                </div>
                
                <h3 className="text-xl font-bold mb-2 text-white">
                  🎨 {t('cookieConsent.improveExperience')}
                </h3>
                <p className="text-gray-300 text-sm mb-3">
                  {t('cookieConsent.valueProposition')}
                </p>
                
                {/* Benefits list */}
                <div className="mb-3">
                  <div className="flex items-center gap-2 text-xs text-green-400 mb-1">
                    <span>✨</span>
                    <span>{t('cookieConsent.benefit1')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-green-400 mb-1">
                    <span>⚡</span>
                    <span>{t('cookieConsent.benefit2')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-green-400">
                    <span>📊</span>
                    <span>{t('cookieConsent.benefit3')}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <button 
                    className="text-purple-400 underline hover:text-purple-300 transition-colors"
                    onClick={handleShowPreferences}
                  >
                    {t('cookieConsent.managePreferences')}
                  </button>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleAcceptAll}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-lg shadow-lg"
                >
                  {t('cookieConsent.acceptAll')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal des préférences - Stratégiquement verbeuse */}
      {state.showPreferences && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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

              {/* Bouton d'échappatoire stratégique */}
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg mb-6 text-center">
                <h3 className="text-lg font-bold mb-2">{t('cookieConsent.avoidComplexConfiguration')}</h3>
                <p className="text-sm mb-3 text-purple-100">
                  {t('cookieConsent.acceptAllSimple')}
                </p>
                <button
                  onClick={handleAcceptAll}
                  className="bg-white text-purple-600 px-6 py-2 rounded-lg font-bold hover:bg-purple-50 transition-colors shadow-lg"
                >
                  {t('cookieConsent.acceptAllAndClose')}
                </button>
              </div>

              {/* Notice complexe pour décourager la configuration manuelle */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      {t('cookieConsent.advancedTechnicalConfiguration')}
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        {t('cookieConsent.manualConfigurationWarning')}
                      </p>
                      <p className="mt-2 font-semibold">
                        {t('cookieConsent.estimatedConfigurationTime')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Cookies nécessaires - Section verbose */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{t('cookieConsent.necessary')}</h3>
                    <div className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-sm">
                      {t('cookieConsent.alwaysActive')}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 space-y-2">
                    <p className="font-medium">
                      {t('cookieConsent.necessaryDescription')}
                    </p>
                    <div className="text-xs text-gray-500 bg-white p-3 rounded border-l-2 border-gray-300">
                      <p className="font-semibold mb-2">{t('cookieConsent.technicalDetails')}</p>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>{t('cookieConsent.sessionCookies')}</li>
                        <li>{t('cookieConsent.csrfTokens')}</li>
                        <li>{t('cookieConsent.ecommerceIdentifiers')}</li>
                        <li>{t('cookieConsent.loadBalancingCookies')}</li>
                        <li>{t('cookieConsent.securityCookies')}</li>
                      </ul>
                      <p className="mt-2 text-xs text-red-600">
                        {t('cookieConsent.necessaryCookiesWarning')}
                      </p>
                    </div>
                  </div>
                </div>


                {/* Cookies marketing - Section très verbeuse */}
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
                  <div className="text-sm text-gray-600 space-y-3">
                    <p className="font-medium">
                      {t('cookieConsent.marketingDescription')}
                    </p>
                    
                    {!state.preferences.marketing && (
                      <div className="bg-orange-50 border border-orange-200 rounded p-3">
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-orange-400 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <h4 className="font-semibold text-orange-800 text-sm">{t('cookieConsent.marketingImpact')}</h4>
                            <div className="text-xs text-orange-700 mt-1 space-y-1">
                              <p>{t('cookieConsent.noTargetedOffers')}</p>
                              <p>{t('cookieConsent.genericAdvertising')}</p>
                              <p>{t('cookieConsent.missedOpportunities')}</p>
                              <p>{t('cookieConsent.lessRelevantContent')}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded border">
                      <p className="font-semibold mb-2">{t('cookieConsent.marketingTechnicalDetails')}</p>
                      <div className="mt-2 space-y-2">
                        <div className="border-l-2 border-red-300 pl-3">
                          <p className="font-medium">{t('cookieConsent.facebookPixel')}</p>
                          <ul className="list-disc pl-4 text-xs space-y-1">
                            <li>{t('cookieConsent.fbpIdentifier')}</li>
                            <li>{t('cookieConsent.fbcConversion')}</li>
                            <li>{t('cookieConsent.facebookSessionId')}</li>
                          </ul>
                        </div>
                        <div className="border-l-2 border-purple-300 pl-3">
                          <p className="font-medium">{t('cookieConsent.googleAds')}</p>
                          <ul className="list-disc pl-4 text-xs space-y-1">
                            <li>{t('cookieConsent.ideIdentifier')}</li>
                            <li>{t('cookieConsent.testCookie')}</li>
                            <li>{t('cookieConsent.nidIdentifier')}</li>
                            <li>{t('cookieConsent.oneParJar')}</li>
                          </ul>
                        </div>
                        <div className="border-l-2 border-pink-300 pl-3">
                          <p className="font-medium">{t('cookieConsent.retargeting')}</p>
                          <ul className="list-disc pl-4 text-xs space-y-1">
                            <li>{t('cookieConsent.pixelConversion')}</li>
                            <li>{t('cookieConsent.audienceSegmentation')}</li>
                            <li>{t('cookieConsent.crossDeviceTracking')}</li>
                          </ul>
                        </div>
                        <div className="bg-orange-100 p-2 rounded mt-2">
                          <p className="text-xs text-orange-800">
                            <strong>{t('cookieConsent.marketingNote')}</strong> {t('cookieConsent.marketingDisableWarning')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cookies fonctionnels - Section très verbeuse */}
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
                  <div className="text-sm text-gray-600 space-y-3">
                    <p className="font-medium">
                      {t('cookieConsent.functionalityDescription')}
                    </p>
                    
                    {!state.preferences.functionality && (
                      <div className="bg-blue-50 border border-blue-200 rounded p-3">
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-blue-400 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <h4 className="font-semibold text-blue-800 text-sm">{t('cookieConsent.functionalityImpact')}</h4>
                            <div className="text-xs text-blue-700 mt-1 space-y-1">
                              <p>{t('cookieConsent.noLanguagePreference')}</p>
                              <p>{t('cookieConsent.noThemeSettings')}</p>
                              <p>{t('cookieConsent.noSavedPreferences')}</p>
                              <p>{t('cookieConsent.noAutoLogin')}</p>
                              <p>{t('cookieConsent.noCartPersistence')}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded border">
                      <p className="font-semibold mb-2">{t('cookieConsent.functionalityTechnicalDetails')}</p>
                      <div className="mt-2 space-y-2">
                        <div className="border-l-2 border-cyan-300 pl-3">
                          <p className="font-medium">{t('cookieConsent.userPreferences')}</p>
                          <ul className="list-disc pl-4 text-xs space-y-1">
                            <li>{t('cookieConsent.languageSettings')}</li>
                            <li>{t('cookieConsent.themePreferences')}</li>
                            <li>{t('cookieConsent.regionSettings')}</li>
                            <li>{t('cookieConsent.accessibilitySettings')}</li>
                          </ul>
                        </div>
                        <div className="border-l-2 border-teal-300 pl-3">
                          <p className="font-medium">{t('cookieConsent.sessionManagement')}</p>
                          <ul className="list-disc pl-4 text-xs space-y-1">
                            <li>{t('cookieConsent.userSessionState')}</li>
                            <li>{t('cookieConsent.formDataPersistence')}</li>
                            <li>{t('cookieConsent.navigationHistory')}</li>
                            <li>{t('cookieConsent.autoSaveFeatures')}</li>
                          </ul>
                        </div>
                        <div className="border-l-2 border-indigo-300 pl-3">
                          <p className="font-medium">{t('cookieConsent.interactiveFeatures')}</p>
                          <ul className="list-disc pl-4 text-xs space-y-1">
                            <li>{t('cookieConsent.chatWidgetState')}</li>
                            <li>{t('cookieConsent.videoPlayerPreferences')}</li>
                            <li>{t('cookieConsent.galleryViewSettings')}</li>
                            <li>{t('cookieConsent.searchFilterMemory')}</li>
                          </ul>
                        </div>
                        <div className="bg-blue-100 p-2 rounded mt-2">
                          <p className="text-xs text-blue-800">
                            <strong>{t('cookieConsent.functionalityNote')}</strong> {t('cookieConsent.functionalityDisableWarning')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cookies analytiques - Section très verbeuse EN DERNIER pour forcer le scroll */}
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
                  <div className="text-sm text-gray-600 space-y-3">
                    <p className="font-medium">
                      {t('cookieConsent.analyticsDescription')}
                    </p>
                    
                    {!state.preferences.analytics && (
                      <div className="bg-red-50 border border-red-200 rounded p-3">
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-red-400 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <h4 className="font-semibold text-red-800 text-sm">{t('cookieConsent.userExperienceImpact')}</h4>
                            <div className="text-xs text-red-700 mt-1 space-y-1">
                              <p>{t('cookieConsent.lessAccurateRecommendations')}</p>
                              <p>{t('cookieConsent.slowerLoadingTimes')}</p>
                              <p>{t('cookieConsent.noPersonalization')}</p>
                              <p>{t('cookieConsent.noArtistStatistics')}</p>
                              <p>{t('cookieConsent.advancedFeaturesDisabled')}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* PLUS DE DETAILS - Toujours visible pour forcer le scroll */}
                    <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded border">
                      <p className="font-semibold mb-2">{t('cookieConsent.analyticsCookiesUsed')}</p>
                      <div className="mt-2 space-y-2">
                        <div className="border-l-2 border-blue-300 pl-3">
                          <p className="font-medium">{t('cookieConsent.googleAnalytics4')}</p>
                          <ul className="list-disc pl-4 text-xs space-y-1">
                            <li>{t('cookieConsent.gaIdentifier')}</li>
                            <li>{t('cookieConsent.gaPropertyId')}</li>
                            <li>{t('cookieConsent.gidIdentifier')}</li>
                            <li>{t('cookieConsent.gatRateLimit')}</li>
                          </ul>
                        </div>
                        <div className="border-l-2 border-green-300 pl-3">
                          <p className="font-medium">{t('cookieConsent.googleTagManager')}</p>
                          <ul className="list-disc pl-4 text-xs space-y-1">
                            <li>{t('cookieConsent.gclAuIdentifier')}</li>
                            <li>{t('cookieConsent.gclAwIdentifier')}</li>
                            <li>{t('cookieConsent.gtmIdentifier')}</li>
                          </ul>
                        </div>
                        <div className="border-l-2 border-purple-300 pl-3">
                          <p className="font-medium">{t('cookieConsent.performanceMetrics')}</p>
                          <ul className="list-disc pl-4 text-xs space-y-1">
                            <li>{t('cookieConsent.pageLoadTimes')}</li>
                            <li>{t('cookieConsent.userInteractions')}</li>
                            <li>{t('cookieConsent.contentEngagement')}</li>
                            <li>{t('cookieConsent.conversionTracking')}</li>
                          </ul>
                        </div>
                        <div className="border-l-2 border-indigo-300 pl-3">
                          <p className="font-medium">{t('cookieConsent.advancedAnalytics')}</p>
                          <ul className="list-disc pl-4 text-xs space-y-1">
                            <li>{t('cookieConsent.demographicData')}</li>
                            <li>{t('cookieConsent.behaviorAnalysis')}</li>
                            <li>{t('cookieConsent.artworkInterests')}</li>
                            <li>{t('cookieConsent.purchasePatterns')}</li>
                          </ul>
                        </div>
                        <div className="bg-yellow-100 p-2 rounded mt-2">
                          <p className="text-xs text-yellow-800">
                            <strong>{t('cookieConsent.technicalNote')}</strong> {t('cookieConsent.cookieDisableWarning')}
                          </p>
                        </div>
                        
                        {/* Section supplémentaire pour forcer encore plus de scroll */}
                        <div className="border border-gray-300 rounded p-3 mt-4">
                          <h5 className="font-semibold text-gray-700 mb-2">{t('cookieConsent.dataProcessingDetails')}</h5>
                          <div className="space-y-2 text-xs text-gray-600">
                            <p>{t('cookieConsent.dataRetention')}</p>
                            <p>{t('cookieConsent.thirdPartySharing')}</p>
                            <p>{t('cookieConsent.gdprCompliance')}</p>
                            <p>{t('cookieConsent.dataSubjectRights')}</p>
                            <p>{t('cookieConsent.optOutProcess')}</p>
                          </div>
                        </div>

                        {/* Encore plus de contenu technique pour maximum de scroll */}
                        <div className="border border-gray-300 rounded p-3 mt-4">
                          <h5 className="font-semibold text-gray-700 mb-2">{t('cookieConsent.technicalImplementation')}</h5>
                          <div className="space-y-2 text-xs text-gray-600">
                            <p>{t('cookieConsent.serverSideTracking')}</p>
                            <p>{t('cookieConsent.clientSideEvents')}</p>
                            <p>{t('cookieConsent.crossDomainTracking')}</p>
                            <p>{t('cookieConsent.enhancedEcommerce')}</p>
                            <p>{t('cookieConsent.customDimensions')}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-6 pt-6 border-t">
                <div className="flex gap-3">
                  <button
                    onClick={handleClosePreferences}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                  >
                    {t('cookieConsent.cancel')}
                  </button>
                  <button
                    onClick={handleAcceptPreferences}
                    className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors font-medium flex-1"
                  >
                    {t('cookieConsent.savePreferences')}
                  </button>
                </div>
                <div className="text-center">
                  <button
                    onClick={handleRejectAll}
                    className="text-gray-400 hover:text-gray-600 transition-colors text-xs underline"
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
