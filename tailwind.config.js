/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#fffdf7',
        'paper-2': '#f8f3e2',
        ink: '#12100c',
        pencil: '#6b6353',
        marker: '#cf3f22',
        pen: '#26478c',
        highlight: '#ffe680',
        rule: '#12100c',
        /* aliases kept so older post bodies keep their meaning after the restyle */
        muted: '#6b6353',
        accent: '#cf3f22',
      },
      fontFamily: {
        marker: ['Permanent Marker', 'Marker Felt', 'Comic Sans MS', 'cursive'],
        hand: ['Patrick Hand', 'Segoe Print', 'Comic Sans MS', 'cursive'],
        note: ['Caveat', 'Bradley Hand', 'Segoe Print', 'cursive'],
        serif: ['Patrick Hand', 'Segoe Print', 'Comic Sans MS', 'cursive'],
        sans: ['Patrick Hand', 'Segoe Print', 'Comic Sans MS', 'cursive'],
      },
      maxWidth: {
        page: '1080px',
        measure: '62ch',
      },
      boxShadow: {
        sketch: '3px 3px 0 0 #12100c',
        'sketch-lg': '5px 5px 0 0 #12100c',
        'sketch-sm': '2px 2px 0 0 #12100c',
      },
      keyframes: {
        wobble: {
          '0%,100%': { transform: 'rotate(-0.5deg)' },
          '50%': { transform: 'rotate(0.5deg)' },
        },
      },
      animation: {
        wobble: 'wobble 3.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
