import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        beacon: {
          amber: '#F59E0B',
          blue: '#3B82F6',
          dark: '#0F172A',
          card: '#1E293B',
        },
      },
    },
  },
  plugins: [],
};

export default config;
