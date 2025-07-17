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
        'bricolage': ['Bricolage Grotesque', 'sans-serif'],
        'unbounded': ['Unbounded', 'sans-serif'],
      },
      colors: {
        purpleColor: "var(--purple)",
        backgroundColor: "var(--background)",
        textColor: "var(--text)",
        cardBackground: "var(--card)",
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
      borderColor:{
        purpleColor: "var(--purple)"
      }
    },
  },
  plugins: [
    function({ addUtilities }: any) {
      const newUtilities = {
        '.text-simulator': {
          'color': 'white',
          'font-family': 'Unbounded, sans-serif',
          'width': '65%',
          'word-break': 'break-all'
        }
      }
      addUtilities(newUtilities)
    }
  ],
} satisfies Config;
