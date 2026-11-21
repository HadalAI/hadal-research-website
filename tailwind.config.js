/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#ffffff',
        'paper-2': '#f3f3f2',
        ink: '#282828',
        muted: '#676767',
        faint: '#969696',
        rule: '#e8e8e6',
        accent: '#0155bf',
        pencil: '#676767',
        marker: '#282828',
      },
      fontFamily: {
        serif: ['"Iowan Old Style BT"', '"Iowan Old Style"', 'Charter', 'Georgia', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Arial', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        display: ['"Chakra Petch"', 'Inter', 'sans-serif'],
      },
      maxWidth: {
        page: '900px',
        measure: '660px',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
