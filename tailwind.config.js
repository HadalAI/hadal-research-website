/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#f4f1e9',
        'paper-2': '#eae6da',
        ink: '#17171a',
        muted: '#6a665c',
        rule: '#d5cfc0',
        accent: '#8a3324',
      },
      fontFamily: {
        serif: ['var(--font-plex-serif)', 'Iowan Old Style', 'Georgia', 'serif'],
        sans: ['var(--font-plex-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-plex-mono)', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        page: '1120px',
        measure: '64ch',
      },
    },
  },
  plugins: [],
};
