import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{vue,ts,tsx}',
    './components/**/*.{vue,ts,tsx}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: {
          DEFAULT: '#FEF2E8',
          surface: '#F4E9DF',
          elevated: '#EADFD5',
          dark: '#002429',
          'dark-surface': '#003136',
          'dark-elevated': '#004146',
        },
        gold: {
          DEFAULT: '#00FF90',
          light: '#00FFB8',
          dim: '#00AF61',
        },
        crimson: {
          DEFAULT: '#FF00A6',
          light: '#FF00BF',
          dim: '#FC006C',
        },
        emerald: {
          DEFAULT: '#FF00A6',
          light: '#FF00BF',
          dim: '#FC006C',
        },
        ink: {
          DEFAULT: '#002429',
          muted: '#3A5C5D',
          faint: '#6F8585',
          light: '#FEF2E8',
          'light-muted': '#A0B2B2',
        },
      },
      spacing: {
        section: '6rem',
        'section-sm': '4rem',
        'section-lg': '10rem',
      },
      fontSize: {
        'display-sm': ['clamp(2.5rem, 6vw, 4rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(3.5rem, 8vw, 6rem)', { lineHeight: '1', letterSpacing: '-0.03em' }],
        'display-lg': ['clamp(4.5rem, 11vw, 9rem)', { lineHeight: '0.95', letterSpacing: '-0.04em' }],
        'display-xl': ['clamp(5rem, 14vw, 12rem)', { lineHeight: '0.9', letterSpacing: '-0.05em' }],
      },
      transitionTimingFunction: {
        'expo-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'power2-out': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'power3-out': 'cubic-bezier(0.215, 0.61, 0.355, 1)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
      maxWidth: {
        site: '1440px',
      },
    },
  },
  plugins: [],
} satisfies Config
