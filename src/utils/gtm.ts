// Google Tag Manager utility functions

/**
 * Push an event to the GTM dataLayer
 * @param name Event name
 * @param params Event parameters
 */
export const pushEvent = (name: string, params: Record<string, any> = {}) => {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: name,
      ...params
    });
  }
};

/**
 * Initialize Google Tag Manager with user consent
 * @param hasConsent Whether the user has consented to cookies
 */
export const initializeGTM = (hasConsent: boolean) => {
  if (hasConsent) {
    // Enable GTM tracking with consent
    pushEvent('cookieConsentAccepted', { consent: true });
    
    // Initialize any additional GTM features that require consent
    pushEvent('gtm.init.consent', { 
      analytics_storage: 'granted',
      ad_storage: 'granted',
      functionality_storage: 'granted',
      personalization_storage: 'granted',
      security_storage: 'granted'
    });
  } else {
    // Disable GTM tracking without consent
    pushEvent('cookieConsentDeclined', { consent: false });
    
    // Initialize GTM with limited functionality
    pushEvent('gtm.init.consent', { 
      analytics_storage: 'denied',
      ad_storage: 'denied',
      functionality_storage: 'denied',
      personalization_storage: 'denied',
      security_storage: 'granted' // Security is still allowed
    });
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

// Add window type declaration for dataLayer
declare global {
  interface Window {
    dataLayer: Array<Record<string, any>>;
  }
} 