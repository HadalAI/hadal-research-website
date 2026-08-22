/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#030405',
        surface: '#07090b',
        'surface-2': '#0b0e11',
        line: '#161a1e',
        ink: '#f5f5f2',
        'ink-2': '#8c9197',
        'ink-3': '#555b61',
        accent: '#5b8fa8',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
