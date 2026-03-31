import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Configuration des patterns d'images distantes
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'event.inrealart.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'pub-d7df68395d644bd3bc80d24168d6d8be.r2.dev',
        pathname: '**',
      },
    ],

    // Formats d'image optimisés (réduire le nombre de transformations)
    formats: ['image/webp', 'image/avif'],

    // Tailles d'image optimisées pour réduire les transformations
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 661, 665, 750, 828, 1080, 1200, 1920, 2048, 3840],

    // TTL de cache minimum pour réduire les transformations
    minimumCacheTTL: 2678400, // 31 jours

    // Désactiver l'optimisation pour les images qui n'en bénéficient pas
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Configuration des en-têtes de cache pour les images
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2678400, immutable',
          },
        ],
      },
    ];
  },

  // Optimisation CSS : inline les CSS critiques pour réduire le blocage du rendu
  // Cela élimine les requêtes bloquantes pour les CSS et améliore le Speed Index
  experimental: {
    inlineCss: true,
  },

  // Configuration SWC pour éviter les polyfills inutiles pour les navigateurs modernes
  // Ces fonctionnalités sont supportées nativement par Chrome 111+, Edge 111+, Firefox 111+, Safari 16.4+
  compiler: {
    // Désactiver les transformations pour les fonctionnalités Baseline
    // Cela évite d'inclure des polyfills pour Array.at, Object.fromEntries, etc.
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

};

export default nextConfig;
