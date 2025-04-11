'use client';

import { useState, useEffect } from 'react';
import CookieConsent, { Cookies } from 'react-cookie-consent';
import { useLanguageStore } from '@/store/languageStore';
import { initializeGTM } from '@/utils/gtm';

// Enable GTM tracking
const enableGTM = () => {
  if (typeof window !== 'undefined') {
    initializeGTM(true);
  }
};

// Disable GTM tracking
const disableGTM = () => {
  if (typeof window !== 'undefined') {
    initializeGTM(false);
    
    // Optionally clean cookies
    Object.keys(Cookies.get()).forEach(cookieName => {
      if (cookieName.startsWith('_ga') || cookieName.startsWith('_gid') || cookieName.startsWith('_gat')) {
        Cookies.remove(cookieName);
      }
    });
  }
};

const CookieConsentBanner = () => {
  const { t } = useLanguageStore();
  const [hasConsent, setHasConsent] = useState<boolean | null>(null);

  // Check if consent has already been given
  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (consent === 'true') {
      setHasConsent(true);
      enableGTM();
    } else if (consent === 'false') {
      setHasConsent(false);
      disableGTM();
    }
  }, []);

  return (
    <CookieConsent
      enableDeclineButton
      location="bottom"
      buttonText={t('cookieConsent.accept') || "Accept"}
      declineButtonText={t('cookieConsent.decline') || "Decline"}
      cookieName="cookieConsent"
      style={{ 
        background: "#121212",
        padding: "16px",
        borderTop: "1px solid #333"
      }}
      buttonStyle={{
        backgroundColor: "#8056c8",
        color: "white",
        fontSize: "14px",
        borderRadius: "4px",
        padding: "10px 16px"
      }}
      declineButtonStyle={{
        backgroundColor: "transparent",
        border: "1px solid #8056c8",
        color: "white",
        fontSize: "14px",
        borderRadius: "4px",
        padding: "10px 16px"
      }}
      expires={365}
      onAccept={() => {
        enableGTM();
        setHasConsent(true);
        localStorage.setItem('cookieConsent', 'true');
      }}
      onDecline={() => {
        disableGTM();
        setHasConsent(false);
        localStorage.setItem('cookieConsent', 'false');
      }}
    >
      <div className="flex flex-col">
        <h3 className="text-xl font-bold mb-2">
          {t('cookieConsent.title') || "Cookie Notice"}
        </h3>
        <p>
          {t('cookieConsent.description') || 
            "We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking \"Accept\", you consent to our use of cookies."}
        </p>
        <button 
          className="text-sm text-purpleColor mt-2 underline w-fit"
          onClick={() => {
            // You can link to your privacy policy here
            window.open('/privacy-policy', '_blank');
          }}
        >
          {t('cookieConsent.learnMore') || "Learn More"}
        </button>
      </div>
    </CookieConsent>
  );
};

export default CookieConsentBanner; 