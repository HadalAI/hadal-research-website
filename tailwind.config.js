/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#faf7f0',
        'paper-2': '#f1e7ce',
        ink: '#16181d',
        muted: '#6c6862',
        faint: '#9a958c',
        rule: '#e3dccb',
        accent: '#1c5d5a',
        pencil: '#6c6862',
        marker: '#16181d',
      },
      fontFamily: {
        serif: ['Newsreader', 'Georgia', 'serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Newsreader', 'Georgia', 'serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'monospace'],
      },
      maxWidth: { page: '864px', measure: '40rem' },
    },
  },
  plugins: [],
};
