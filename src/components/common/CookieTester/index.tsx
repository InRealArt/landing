'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface CookieTesterProps {
  onDeleteCookies: () => void;
}

const CookieTester = ({ onDeleteCookies }: CookieTesterProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [cookies, setCookies] = useState<Record<string, string>>({});

  const refreshCookies = () => {
    if (typeof window === 'undefined') return;
    
    const cookieString = document.cookie;
    const cookieObj: Record<string, string> = {};
    
    if (cookieString) {
      cookieString.split(';').forEach(cookie => {
        const [name, value] = cookie.trim().split('=');
        if (name && value) {
          cookieObj[name] = value;
        }
      });
    }
    
    setCookies(cookieObj);
    
    // Forcer un re-render pour mettre à jour l'affichage
    setCookies({ ...cookieObj });
  };

  useEffect(() => {
    refreshCookies();
    
    // Rafraîchir les cookies toutes les 2 secondes pour détecter les nouveaux cookies
    const interval = setInterval(() => {
      refreshCookies();
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const getCookieStatus = () => {
    // Vérifier que nous sommes côté client
    if (typeof window === 'undefined') {
      return {
        consent: t('cookieConsent.consentUndefined'),
        preferences: null,
        googleAnalytics: false,
        googleTagManager: false,
        marketing: false,
        functionality: false
      };
    }
    
    const consent = localStorage.getItem('cookieConsent');
    const preferences = localStorage.getItem('cookiePreferences');
    const parsedPreferences = preferences ? JSON.parse(preferences) : null;
    
    // Obtenir tous les cookies actuels
    const allCookies = typeof document !== 'undefined' ? document.cookie : '';
    
    // === DÉTECTION DES COOKIES PAR CATÉGORIE RGPD ===
    
    // 1. COOKIES ANALYTIQUES (Google Analytics + GTM)
    const analyticsCookies = [
      '_ga', '_ga_', '_gid', '_gat', '_gcl_au', '_gcl_aw', '_gcl_dc',
      '_gtm', '_gtag', 'gtm_'
    ];
    const hasAnalyticsCookies = analyticsCookies.some(cookieName => 
      allCookies.includes(cookieName) || (cookies && cookies[cookieName])
    );
    
    // 2. COOKIES MARKETING/ADVERTISING
    const marketingCookies = [
      '_fbp', '_fbc', 'IDE', 'test_cookie', 'NID', '1P_JAR',
      'APISID', 'SAPISID', 'SSID', 'SID', 'SIDCC'
    ];
    const hasMarketingCookies = marketingCookies.some(cookieName => 
      allCookies.includes(cookieName) || (cookies && cookies[cookieName])
    );
    
    // 3. COOKIES FONCTIONNELS
    const functionalityCookies = [
      'language', 'theme', 'preferences', 'user_settings'
    ];
    const hasFunctionalityCookies = functionalityCookies.some(cookieName => 
      allCookies.includes(cookieName) || (cookies && cookies[cookieName])
    );
    
    // === LOGIQUE DE DÉTECTION CONFORME RGPD ===
    
    // Google Analytics : Présent SI cookies détectés ET préférence analytics activée ET consentement donné
    const googleAnalyticsStatus = hasAnalyticsCookies && 
                                 parsedPreferences?.analytics === true && 
                                 consent === 'true';
    
    // Google Tag Manager : Même logique que Analytics (GTM fait partie des analytics)
    const googleTagManagerStatus = hasAnalyticsCookies && 
                                  parsedPreferences?.analytics === true && 
                                  consent === 'true';
    
    // Marketing : Présent SI cookies détectés ET préférence marketing activée ET consentement donné
    const marketingStatus = hasMarketingCookies && 
                           parsedPreferences?.marketing === true && 
                           consent === 'true';
    
    // Fonctionnels : Présent SI cookies détectés ET préférence fonctionnels activée ET consentement donné
    const functionalityStatus = hasFunctionalityCookies && 
                               parsedPreferences?.functionality === true && 
                               consent === 'true';
    
    return {
      consent: consent === 'true' ? t('cookieConsent.consentAccepted') : 
               consent === 'false' ? t('cookieConsent.consentDeclined') : 
               t('cookieConsent.consentUndefined'),
      preferences: parsedPreferences,
      googleAnalytics: googleAnalyticsStatus,
      googleTagManager: googleTagManagerStatus,
      marketing: marketingStatus,
      functionality: functionalityStatus
    };
  };

  const status = getCookieStatus();

  return (
    <>
      {/* Bouton flottant */}
      {/* <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors z-[60]"
        title="Testeur de cookies"
      >
        🍪
      </button> */}

      {/* Panel de test */}
      {isOpen && (
        <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 bg-gray-800 border border-gray-600 rounded-lg shadow-xl p-4 w-80 max-h-96 overflow-y-auto z-[60]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-white">Testeur de cookies</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-300 hover:text-white"
            >
              ×
            </button>
          </div>

          <div className="space-y-3 text-sm text-white">
            <div>
              <strong className="text-white">Consentement :</strong> 
              <span className={`ml-2 px-2 py-1 rounded text-xs ${
                status.consent === t('cookieConsent.consentAccepted') ? 'bg-green-600 text-white' :
                status.consent === t('cookieConsent.consentDeclined') ? 'bg-red-600 text-white' :
                'bg-yellow-600 text-white'
              }`}>
                {status.consent}
              </span>
            </div>

            {status.preferences && (
              <div>
                <strong className="text-white">Préférences :</strong>
                <div className="mt-1 space-y-1">
                  {Object.entries(status.preferences).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="capitalize text-white">{t(`cookieConsent.${key}`)} :</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        value ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                      }`}>
                        {value ? t('cookieConsent.enabled') : t('cookieConsent.disabled')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <strong className="text-white">Cookies détectés :</strong>
              <div className="mt-1 space-y-1">
                <div className="flex justify-between">
                  <span className="text-white">Google Analytics :</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    status.googleAnalytics ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'
                  }`}>
                    {status.googleAnalytics ? t('cookieConsent.present') : t('cookieConsent.absent')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white">Google Tag Manager :</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    status.googleTagManager ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'
                  }`}>
                    {status.googleTagManager ? t('cookieConsent.present') : t('cookieConsent.absent')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white">Marketing :</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    status.marketing ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'
                  }`}>
                    {status.marketing ? t('cookieConsent.present') : t('cookieConsent.absent')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white">Fonctionnels :</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    status.functionality ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'
                  }`}>
                    {status.functionality ? t('cookieConsent.present') : t('cookieConsent.absent')}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <strong className="text-white">{t('cookieConsent.totalCookies')} :</strong> <span className="text-white">{cookies ? Object.keys(cookies).length : 0}</span>
            </div>

            {/* Debug: Afficher les cookies par catégorie */}
            {cookies && Object.keys(cookies).length > 0 && (
              <div className="mt-2 p-2 bg-gray-700 rounded text-xs">
                <strong className="text-white">Cookies détectés par catégorie :</strong>
                <div className="mt-1 text-gray-300 space-y-1">
                  {/* Analytics */}
                  <div>
                    <span className="text-blue-300 font-semibold">Analytics:</span>
                    {cookies && Object.entries(cookies)
                      .filter(([name]) => ['_ga', '_ga_', '_gid', '_gat', '_gcl_', '_gtm', '_gtag', 'gtm_'].some(pattern => name.includes(pattern)))
                      .map(([name, value]) => (
                        <div key={name} className="ml-2 truncate">
                          <span className="text-blue-300">{name}</span>: <span className="text-green-300">{value.substring(0, 15)}...</span>
                        </div>
                      ))}
                  </div>
                  
                  {/* Marketing */}
                  <div>
                    <span className="text-red-300 font-semibold">Marketing:</span>
                    {cookies && Object.entries(cookies)
                      .filter(([name]) => ['_fbp', '_fbc', 'IDE', 'test_cookie', 'NID', '1P_JAR', 'APISID', 'SAPISID', 'SSID', 'SID', 'SIDCC'].some(pattern => name.includes(pattern)))
                      .map(([name, value]) => (
                        <div key={name} className="ml-2 truncate">
                          <span className="text-red-300">{name}</span>: <span className="text-green-300">{value.substring(0, 15)}...</span>
                        </div>
                      ))}
                  </div>
                  
                  {/* Fonctionnels */}
                  <div>
                    <span className="text-yellow-300 font-semibold">Fonctionnels:</span>
                    {cookies && Object.entries(cookies)
                      .filter(([name]) => ['language', 'theme', 'preferences', 'user_settings'].some(pattern => name.includes(pattern)))
                      .map(([name, value]) => (
                        <div key={name} className="ml-2 truncate">
                          <span className="text-yellow-300">{name}</span>: <span className="text-green-300">{value.substring(0, 15)}...</span>
                        </div>
                      ))}
                  </div>
                  
                  {/* Autres */}
                  <div>
                    <span className="text-gray-300 font-semibold">Autres:</span>
                    {cookies && Object.entries(cookies)
                      .filter(([name]) => !['_ga', '_ga_', '_gid', '_gat', '_gcl_', '_gtm', '_gtag', 'gtm_', '_fbp', '_fbc', 'IDE', 'test_cookie', 'NID', '1P_JAR', 'APISID', 'SAPISID', 'SSID', 'SID', 'SIDCC', 'language', 'theme', 'preferences', 'user_settings'].some(pattern => name.includes(pattern)))
                      .map(([name, value]) => (
                        <div key={name} className="ml-2 truncate">
                          <span className="text-gray-300">{name}</span>: <span className="text-green-300">{value.substring(0, 15)}...</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-gray-600">
              <button
                onClick={refreshCookies}
                className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs"
              >
                {t('cookieConsent.refresh')}
              </button>
              <button
                onClick={onDeleteCookies}
                className="w-full mt-2 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-xs"
              >
                {t('cookieConsent.deleteAllCookies')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieTester;
