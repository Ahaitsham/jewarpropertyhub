/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Warm terracotta/rust — deliberately not the generic "trust green"
        // SaaS palette, closer to brick and soil tones of local UP real estate.
        brand: {
          50: '#fbf3ee',
          100: '#f5e1d3',
          200: '#e8bfa2',
          300: '#d89968',
          400: '#c17843',
          500: '#a85f31',
          600: '#8c4a27',
          700: '#713c22',
          800: '#5c3220',
          900: '#4c2b1e',
        },
        sand: {
          50: '#faf8f4',
          100: '#f1ece1',
          200: '#e3d9c6',
        },
      },
      fontFamily: {
        sans: ['"Manrope"', 'system-ui', 'sans-serif'],
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
