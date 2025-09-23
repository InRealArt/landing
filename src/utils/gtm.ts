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