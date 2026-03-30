import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/utils/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    'text-simulator',
    'text-white',
    'font-unbounded',
    'w-[65%]',
    'break-all',
    'text-4xl',
    'md:text-5xl',
    'font-bricolage',
    'font-bold',
    'serif',
    'italic',
    'tracking-[0.7em]',
    'tracking-[0.4em]',
    'tracking-[0.3em]',
    'tracking-[0.25em]',
    'text-gold-accent',
    'border-gold-accent',
    'border-gold-accent/30',
    'grayscale',
    'group-hover:grayscale-0',
  ],
  theme: {
    extend: {
      fontFamily: {
        'bricolage': ['var(--font-bricolage)', 'serif'],
        'unbounded': ['var(--font-unbounded)', 'sans-serif'],
        'cormorant': ['var(--font-cormorant)', 'serif'],
        'montserrat': ['var(--font-montserrat)', 'sans-serif'],
      },
      colors: {
        purpleColor: "var(--purple)",
        backgroundColor: "var(--background)",
        textColor: "var(--text)",
        cardBackground: "var(--card)",
        gradientStart: "var(--gradient-start)",
        gradientEnd: "var(--gradient-end)",
        borderColor: "var(--border-color)",
        strokeColor: "var(--stroke-color)",
        shadowColor: "var(--shadow-color)",
        gradientFrom: "var(--gradient-from)",
        gradientTo: "var(--gradient-to)",
        grayText: "var(--gray-text)",
        backgroundGrey: "var(--background-grey)",
        // InRealArt Gallery Palette
        'gold-accent': '#b89c72',
        'canvas-white': '#ffffff',
        'soft-gray': 'var(--soft-gray)',
        'border-light': 'var(--border-light)',
        'ink-black': 'var(--ink-black)',
      },
      minHeight: {
        headerSize: "var(--header-height)",
        footerSize: "var(--footer-height)"
      },
      height: {
        headerSize: "var(--header-height)",
        footerSize: "var(--footer-height)"
      },
      spacing: {
        headerSize: "calc(var(--header-height) + 2rem)",
        headerSizeMobile: "var(--header-height)",
        fullMinusHeader: "calc(100% - 200px)",
        90: '91.666667%',
        65: '65%',
        30: '30%',
        card: 'calc(100% / 4 - 1rem)',
        cardLarge: 'calc(100% / 3 - 1rem)',
        cardMobile: 'calc(100% / 2 - 0.5rem)',
      },
      maxWidth: {
        "screen-image": "1440px",
      },
      borderColor: {
        purpleColor: "var(--purple)"
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(40px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-right': {
          from: { opacity: '0', transform: 'translateX(40px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.8s ease-out 0.2s both',
        'fade-up-delay': 'fade-up 0.8s ease-out 0.38s both',
        'fade-right': 'fade-right 0.9s ease-out 0.38s both',
      },
    },
  },
  plugins: [
    function ({ addUtilities }: { addUtilities: (utilities: Record<string, Record<string, string>>) => void }) {
      const newUtilities = {
        '.text-simulator': {
          'color': 'var(--text)',
          'font-family': 'var(--font-unbounded), sans-serif',
          'width': '65%',
          'word-break': 'break-all'
        },
        '.hero-text-container': {
          'backdrop-filter': 'blur(4px)',
          'background-color': 'rgba(0, 0, 0, 0.4)',
          'border-radius': '0.5rem',
          'box-shadow': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          'padding': '1rem 1.5rem',
          'max-width': '56rem'
        },
        '.hero-title': {
          'color': 'white',
          'text-shadow': '0 4px 6px rgba(0, 0, 0, 0.3)',
          'font-family': 'var(--font-bricolage), serif',
          'font-weight': '700'
        },
        '.hero-subtitle': {
          'color': 'white',
          'text-shadow': '0 2px 4px rgba(0, 0, 0, 0.3)'
        },
        '.hero-text-container-sm': {
          'padding': '1.5rem 2rem'
        },
        '.hero-text-container-md': {
          'padding': '2rem'
        },
        // Gallery Style Utilities - InRealArt Design System
        '.serif': {
          'font-family': 'var(--font-cormorant), serif',
          'font-weight': '300'
        },
        '.btn-cta': {
          'padding': '0.9rem 1.8rem',
          'border': '1px solid var(--ink-black)',
          'font-size': '0.6rem',
          'letter-spacing': '0.25em',
          'text-transform': 'uppercase',
          'transition': 'all 0.5s cubic-bezier(0.19, 1, 0.22, 1)',
          'display': 'inline-block',
          'margin-top': '1.5rem',
          'background': 'transparent',
          'cursor': 'pointer'
        },
        '.btn-cta:hover': {
          'background': 'var(--ink-black)',
          'color': 'var(--background)'
        },
        '.section-number': {
          'font-size': '0.6rem',
          'letter-spacing': '0.5em',
          'text-transform': 'uppercase',
          'color': '#aaa',
          'margin-bottom': '1.5rem',
          'display': 'block'
        },
        '.footer-link': {
          'font-size': '0.75rem',
          'color': 'var(--gray-text)',
          'transition': 'color 0.3s, transform 0.3s',
          'display': 'block',
          'margin-bottom': '0.5rem'
        },
        '.footer-link:hover': {
          'color': 'var(--ink-black)',
          'transform': 'translateX(5px)'
        },
        '.artist-list-item': {
          'font-size': '0.7rem',
          'letter-spacing': '0.05em',
          'color': 'var(--gray-text)',
          'margin-bottom': '0.3rem',
          'display': 'block'
        },
        '.artist-list-item:hover': {
          'color': 'var(--gold-accent)'
        },
        '.artwork-image img': {
          'transition': 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
        },
        '.artwork-container:hover .artwork-image img': {
          'transform': 'scale(1.03)'
        }
      }
      addUtilities(newUtilities)
    }
  ],
} satisfies Config;