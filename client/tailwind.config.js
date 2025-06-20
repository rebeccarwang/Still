/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'near-white': '#FFF6EB',
        'med-orange': {
          'DEFAULT': '#D8693D',
          200: '#D8693D'
        },
        'med-grey': '#595959'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}

