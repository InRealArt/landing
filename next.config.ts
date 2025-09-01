import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Configuration des patterns d'images distantes
    remotePatterns: [{
      protocol: 'https',
      hostname: 'firebasestorage.googleapis.com',
      pathname: '**',
    }],

    // Formats d'image optimisés (réduire le nombre de transformations)
    formats: ['image/webp', 'image/avif'],

    // Tailles d'image optimisées pour réduire les transformations
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],

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
};

export default nextConfig;
