/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FBF7F2',
          100: '#F7F1E8',
          200: '#EFE4D4',
          300: '#E4D3BC',
        },
        clay: {
          400: '#D49278',
          500: '#C4785A',
          600: '#A85F44',
          700: '#8A4A35',
        },
        sage: {
          400: '#A3B196',
          500: '#8B9A7D',
          600: '#6F7D62',
        },
        ink: {
          700: '#5C4033',
          800: '#3F2A22',
          900: '#2A1C16',
        },
        blush: '#E8B4B8',
        sand: '#C4A574',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Nunito Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 12px 40px -18px rgba(92, 64, 51, 0.28)',
        soft: '0 8px 24px -12px rgba(92, 64, 51, 0.18)',
      },
      borderRadius: {
        '2xl': '1.25rem',
      },
    },
  },
  plugins: [],
};
