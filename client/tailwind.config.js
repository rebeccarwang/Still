/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'near-white': '#eef3f9',
        'light-blue': '#d3e0e4',
        'med-blue': '#7c95af',
        'dark-blue': '#525f6b',
        'navy': 	'#14232d'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}

