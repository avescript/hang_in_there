import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Warm color palette: soft blues, creams, earthy greens
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        cream: {
          50: '#fefdfb',
          100: '#fdfbf7',
          200: '#faf6ed',
          300: '#f7f1e3',
          400: '#f4ecd9',
          500: '#f1e7cf',
          600: '#c1b9a6',
          700: '#918b7d',
          800: '#605c53',
          900: '#302e2a',
        },
        earth: {
          50: '#f4f7f4',
          100: '#e9efe9',
          200: '#c8d7c8',
          300: '#a7bfa7',
          400: '#86a786',
          500: '#658f65',
          600: '#517251',
          700: '#3d563d',
          800: '#283928',
          900: '#141d14',
        },
      },
    },
  },
  plugins: [],
};

export default config;
