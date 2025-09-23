// Debug utilities for Google Analytics

export const debugAnalytics = () => {
    if (typeof window === 'undefined') return;

    console.log('==== ANALYTICS DEBUG ====');

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
    console.log('Total cookies:', Object.keys(cookies).length);

    // Check if GA is loaded
    const gaScript = document.querySelector('script[src*="googletagmanager.com/gtag/js"]');
    const gtmScript = document.querySelector('script[src*="googletagmanager.com/gtm.js"]');
    console.log('GA script loaded:', !!gaScript);
    console.log('GTM script loaded:', !!gtmScript);
    console.log('gtag available:', typeof window.gtag !== 'undefined');

    // Test page view
    if (window.gtag) {
        console.log('Testing page view...');
        window.gtag('event', 'debug_test', {
            'event_category': 'debug',
            'event_label': 'analytics_debug_test',
            'value': 1
        });

        // Test page view
        window.gtag('event', 'page_view', {
            page_title: document.title,
            page_location: window.location.href
        });

        console.log('Test events sent!');
    } else {
        console.error('gtag function not available!');
    }

    // Debugging tips
    console.log('=== DEBUGGING TIPS ===');
    console.log('1. Check Network tab for requests to google-analytics.com or googletagmanager.com');
    console.log('2. Look for any JavaScript errors in console');
    console.log('3. Verify GTM container is published');
    console.log('4. Check GA4 property ID is correct: G-LRX6096NCS');
    console.log('5. Ensure consent mode is working properly');

    console.log('=== END DEBUG ===');
};

// Auto-run debug in development
if (process.env.NODE_ENV === 'development') {
    setTimeout(debugAnalytics, 2000);
}

