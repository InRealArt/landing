"use client";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import React, { useEffect } from "react";

export default function GoogleCaptchaWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  // Utiliser une clé fixe pour éviter les problèmes de compilation avec Next.js
  const recaptchaKey = "6LeX-vgpAAAAAP6do9qsGjgEOVefIAmRq1HMDUGl";

  // Vérifier l'initialisation de reCAPTCHA
  useEffect(() => {
    
    // Fonction pour charger manuellement le script si nécessaire
    const loadReCaptchaScript = () => {
      // Vérifier si le script est déjà présent
      if (document.querySelector('script[src*="recaptcha/api.js"]')) {
        return;
      }

      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${recaptchaKey}`;
      script.async = true;
      script.defer = true;
      script.onload = () => console.log("Script reCAPTCHA chargé manuellement avec succès");
      script.onerror = (e) => console.error("Erreur lors du chargement manuel du script reCAPTCHA:", e);
      document.head.appendChild(script);
    };

    // Vérifier après un délai si reCAPTCHA est disponible, sinon charger manuellement
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        if (window.grecaptcha) {
          try {
            window.grecaptcha.ready(() => {
              // Test de validation de la clé
              window.grecaptcha.execute(recaptchaKey, { action: 'test' })
                .then(token => console.log("✅ Clé valide! Token test généré"))
                .catch(err => console.error("❌ Erreur avec la clé:", err));
            });
          } catch (error) {
            console.error("❌ Erreur lors de l'appel à grecaptcha.ready:", error);
            loadReCaptchaScript();
          }
        } else {
          console.warn("❌ grecaptcha non disponible - chargement manuel du script");
          loadReCaptchaScript();
        }
      }
    }, 1000);
  }, [recaptchaKey]);

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={recaptchaKey}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: "head",
        nonce: undefined,
      }}
      container={{
        parameters: {
          badge: 'bottomright', // Revenir à bottomright pour le débogage
        }
      }}
      language="fr"
      useRecaptchaNet={false}
      useEnterprise={false}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
}
