/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-red': '#e50914',
        'brand-black': '#0a0a0a',
        'brand-gray': '#1a1a1a'
      }
    },
  },
  plugins: [],
}
