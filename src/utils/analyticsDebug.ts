// Debug utilities for Google Analytics

export const debugAnalytics = () => {
    if (typeof window === 'undefined') return;

    console.log('=== ANALYTICS DEBUG ===');

    // Check dataLayer
    console.log('DataLayer:', window.dataLayer);

    // Check gtag function
    console.log('gtag function:', typeof window.gtag);

    // Check consent state
    const consent = localStorage.getItem('cookieConsent');
    const preferences = localStorage.getItem('cookiePreferences');
    console.log('Consent:', consent);
    console.log('Preferences:', preferences ? JSON.parse(preferences) : null);

    // Check for GA cookies
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
    }, {} as Record<string, string>);

    const analyticsCookies = Object.keys(cookies).filter(key =>
        key.startsWith('_ga') || key.startsWith('_gid') || key.startsWith('_gtm')
    );

    console.log('Analytics cookies:', analyticsCookies);

    // Check if GA is loaded
    const gaLoaded = typeof window.gtag !== 'undefined' &&
        document.querySelector('script[src*="googletagmanager.com/gtag/js"]');
    console.log('GA loaded:', !!gaLoaded);

    // Test page view
    if (window.gtag) {
        console.log('Testing page view...');
        window.gtag('event', 'page_view', {
            page_title: document.title,
            page_location: window.location.href
        });
    }

    console.log('=== END DEBUG ===');
};

// Auto-run debug in development
if (process.env.NODE_ENV === 'development') {
    setTimeout(debugAnalytics, 2000);
}

