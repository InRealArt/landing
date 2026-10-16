import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Robots servis avec les métadonnées (title, description, canonical, hreflang, robots) dans le <head>.
  // Par défaut Next diffuse en streaming celles de generateMetadata dans le <body> : constaté le 16/10/2026 sur
  // les fiches artiste/œuvre et les articles, y compris pour Googlebot. Les robots IA n'exécutent pas le JS
  // et une canonical / des hreflang hors du <head> sont ignorés. = liste par défaut de Next
  // (next/dist/shared/lib/router/utils/html-bots.js) + Googlebot, Bing et robots IA.
  // ⚠️ Fiable tant que ces pages sont rendues à chaque requête (`headers()` dans le layout, cf. docs/CACHE_REVALIDATION.md).
  // Si elles repassent en ISR, le cache n'a pas de Vary User-Agent : la variante « streaming » rendue pour un visiteur
  // serait servie aux robots jusqu'à la revalidation suivante. Revérifier alors le <head> servi à Googlebot.
  htmlLimitedBots: /Googlebot|bingbot|GPTBot|OAI-SearchBot|ChatGPT-User|ClaudeBot|Claude-User|Claude-SearchBot|anthropic-ai|PerplexityBot|Perplexity-User|CCBot|Amazonbot|meta-externalagent|[\w-]+-Google|Google-[\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight/i,
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

    // Qualités d'image autorisées (doit inclure toutes les valeurs utilisées dans le code)
    qualities: [75, 85],

    // Désactiver l'optimisation pour les images qui n'en bénéficient pas
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Pages héritées (audit V2, IRA-07) : 308 permanentes vers la page qui les remplace.
  // Exécutées avant src/proxy.ts. /terms-nft répond 410 (GONE_ROUTES dans src/proxy.ts).
  async redirects() {
    return [
      { source: '/marketplace', destination: '/presale', permanent: true },
      { source: '/about', destination: '/team', permanent: true },
      { source: '/academy', destination: '/blog', permanent: true },
      { source: '/roadmap', destination: '/', permanent: true },
      { source: '/usecase/fractionate', destination: '/usecase', permanent: true },
      { source: '/usecase/lending', destination: '/usecase/leasing', permanent: true },
      // Une seule URL pour le simulateur LOA (IRA-18)
      { source: '/simulators/loa', destination: '/loa-simulator', permanent: true },
      // Slugs de blog tronqués corrigés en base (IRA-06, docs/audit/sql/2026-10-16-blog-slugs-ira06.sql)
      { source: '/blog/institutions-et-pme-des-partenaires-incontournables-pour-la-culture-franaise', destination: '/blog/institutions-et-pme-des-partenaires-incontournables-pour-la-culture-francaise', permanent: true },
      { source: '/blog/en-catherine-s-n-chal-the-alchemist-of-pure-color', destination: '/blog/en-catherine-senechal-the-alchemist-of-pure-color', permanent: true },
      { source: '/blog/en-fran-ois-poulat-travel-nature-and-art-the-journey-of-an-inspired-artist', destination: '/blog/en-francois-poulat-travel-nature-and-art-the-journey-of-an-inspired-artist', permanent: true },
      { source: '/blog/en-l-art-ce-passeur-silencieux-la-transmission-patrimoniale-comme-acte-de-r-sistance-culturelle', destination: '/blog/en-lart-ce-passeur-silencieux-la-transmission-patrimoniale-comme-acte-de-resistance-culturelle', permanent: true },
      { source: '/blog/en-the-versaillaise-biennale-contemporary-art-takes-place-at-carr-la-farine-in-partnership-with-inrealart', destination: '/blog/en-the-versaillaise-biennale-contemporary-art-takes-place-at-carre-a-la-farine-in-partnership-with-inrealart', permanent: true },
      { source: '/blog/en-artialy-in-the-spotlight-in-les-m-tiers-de-la-cr-ation-an-immersion-in-the-world-of-a-young-artist-in-the-making', destination: '/blog/en-artialy-in-the-spotlight-in-les-metiers-de-la-creation-an-immersion-in-the-world-of-a-young-artist-in-the-making', permanent: true },
      { source: '/blog/en-cime-et-cistre-the-pictorial-horizon-of-lucia-mamos-moreaux-at-the-cimes-du-ch-teau', destination: '/blog/en-cime-et-cistre-the-pictorial-horizon-of-lucia-mamos-moreaux-at-the-cimes-du-chateau', permanent: true },
      { source: '/blog/en-plong-e-dans-l-univers-d-alexandre-leadouze-une-vie-au-service-des-artistes-de-la-culture-et-du-patrimoine', destination: '/blog/en-plongee-dans-lunivers-dalexandre-leadouze-une-vie-au-service-des-artistes-de-la-culture-et-du-patrimoine', permanent: true },
    ]
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
    // Cache disque Turbopack en dev désactivé : il gonflait (~3 Go) et bloquait
    // le serveur à ~100% CPU sur tous les cœurs au repos
    turbopackFileSystemCacheForDev: false,
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
