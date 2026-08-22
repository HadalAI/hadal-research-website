/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        deep: "#05070a",
        ocean: "#0e7490",
        accent: "#0ea5e9",
        muted: "#7e8994",
        surface: "#1e293b",
        card: "#2d3a4f",
      }
    },
  },
  plugins: [],
}
