// Debug utilities for Google Tag Manager

// Déclaration de type pour dataLayer
declare global {
    interface Window {
        dataLayer: any[];
        gtag: (...args: any[]) => void;
    }
}

export const debugGTM = () => {
    if (typeof window === 'undefined') return;

    console.log('==== GTM DEBUG ====');

    // Check dataLayer
    console.log('DataLayer:', window.dataLayer);
    console.log('DataLayer length:', window.dataLayer?.length || 0);

    // Check gtag function
    console.log('gtag function:', typeof window.gtag);

    // Check consent state
    const consent = localStorage.getItem('cookieConsent');
    const preferences = localStorage.getItem('cookiePreferences');
    console.log('Consent:', consent);
    console.log('Preferences:', preferences ? JSON.parse(preferences) : null);

    // Check consent mode in dataLayer
    const consentEvents = window.dataLayer?.filter(item =>
        Array.isArray(item) && item[0] === 'consent'
    ) || [];
    console.log('Consent mode events:', consentEvents);

    // Check for GTM cookies
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
    }, {} as Record<string, string>);

    const gtmCookies = Object.keys(cookies).filter(key =>
        key.startsWith('_ga') || key.startsWith('_gid') || key.startsWith('_gtm') || key.startsWith('_gcl')
    );

    console.log('GTM cookies:', gtmCookies);
    console.log('Total cookies:', Object.keys(cookies).length);

    // Check if GTM scripts are loaded
    const gtmScript = document.querySelector('script[src*="googletagmanager.com/gtm.js"]');
    const gtmNoScript = document.querySelector('noscript iframe[src*="googletagmanager.com/ns.html"]');
    console.log('GTM script loaded:', !!gtmScript);
    console.log('GTM noscript loaded:', !!gtmNoScript);
    console.log('gtag available:', typeof window.gtag !== 'undefined');

    // Check GTM container ID
    const gtmId = process.env.NEXT_PUBLIC_GTM_ID || "GTM-NBR8FBBP";
    console.log('GTM Container ID:', gtmId);

    // Test GTM events
    if (window.gtag) {
        console.log('Testing GTM events...');
        window.gtag('event', 'gtm_debug_test', {
            'event_category': 'debug',
            'event_label': 'gtm_debug_test',
            'value': 1
        });

        // Test page view
        window.gtag('event', 'page_view', {
            page_title: document.title,
            page_location: window.location.href
        });

        console.log('Test GTM events sent!');
    } else {
        console.error('gtag function not available!');
    }

    // Debugging tips
    console.log('=== DEBUGGING TIPS ===');
    console.log('1. Check Network tab for requests to googletagmanager.com');
    console.log('2. Look for any JavaScript errors in console');
    console.log('3. Verify GTM container is published');
    console.log('4. Check GTM Container ID is correct:', gtmId);
    console.log('5. Ensure consent mode is working properly');
    console.log('6. Use GTM Preview mode for testing');

    console.log('=== END GTM DEBUG ===');
};

// Alias pour compatibilité
export const debugAnalytics = debugGTM;

// Exposer la fonction globalement pour le debug (dev uniquement)
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    (window as any).debugGTM = debugGTM;
    (window as any).debugAnalytics = debugAnalytics; // Alias pour compatibilité
}

// Auto-run debug in development
if (process.env.NODE_ENV === 'development') {
    setTimeout(debugGTM, 2000);
}

