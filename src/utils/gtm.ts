// Google Tag Manager utility functions

// Define the shape of a data layer item for better type safety
interface DataLayerItem {
  event?: string;
  [key: string]: any;
}

/**
 * Push an event to the GTM dataLayer
 * @param name Event name
 * @param params Event parameters
 */
export const pushEvent = (name: string, params: Record<string, any> = {}) => {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    const dataLayerItem: DataLayerItem = {
      event: name,
      ...params
    };
    window.dataLayer.push(dataLayerItem);
  }
};

/**
 * Initialize Google Tag Manager with user consent
 * @param hasConsent Whether the user has consented to cookies
 */
export const initializeGTM = (hasConsent: boolean) => {
  if (typeof window === 'undefined') return;

  // Initialize dataLayer if not already done
  window.dataLayer = window.dataLayer || [];

  if (hasConsent) {
    // Enable GTM tracking with consent
    pushEvent('cookieConsentAccepted', { consent: true });
  } else {
    // Disable GTM tracking without consent
    pushEvent('cookieConsentDeclined', { consent: false });
  }
};

/**
 * Track a page view event
 * @param url Page URL
 * @param title Page title
 */
export const trackPageView = (url: string, title: string) => {
  pushEvent('pageView', {
    page_location: url,
    page_title: title
  });
};

/**
 * Track a button click event
 * @param buttonName Name/ID of the button
 * @param buttonText Text content of the button
 */
export const trackButtonClick = (buttonName: string, buttonText: string) => {
  pushEvent('buttonClick', {
    button_name: buttonName,
    button_text: buttonText
  });

};

// Événements de conversion GA4 (audit V2, Task 21). Le Consent Mode v2 de GoogleTag.tsx décide de leur envoi à GA4.
// purchase_click et visit_booking viendront avec les boutons d'achat / de visite (Task 11).
export type SimulatorName = 'loa' | 'art_salon' | 'heritage'
export type BriefForm = 'agence' | 'capital' | 'media_production'
export type ApplicantType = 'artist' | 'gallery'

/** Simulation lancée avec succès (calcul effectué) */
export const trackSimulatorStart = (simulator: SimulatorName) => pushEvent('simulator_start', { simulator })

/** Demande de projet / brief envoyée avec succès */
export const trackBriefSubmit = (form: BriefForm) => pushEvent('brief_submit', { form })

/** Candidature artiste ou galerie envoyée avec succès */
export const trackArtistApply = (applicant_type: ApplicantType) => pushEvent('artist_apply', { applicant_type })
