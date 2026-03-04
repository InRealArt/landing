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
    'font-bold'
  ],
  theme: {
    extend: {
      fontFamily: {
        'bricolage': ['var(--font-bricolage)', 'serif'],
        'unbounded': ['var(--font-unbounded)', 'sans-serif'],
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
        }
      }
      addUtilities(newUtilities)
    }
  ],
} satisfies Config;