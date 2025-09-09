/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        'muhammadi': ['MUHAMMADIBOLD', 'serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#055160',
          light: '#055160',
          dark: '#044050',
          50: '#e6f1f3',
          100: '#cce3e7',
          200: '#99c8cf',
          300: '#66acb7',
          400: '#33919f',
          500: '#055160',
          600: '#04414d',
          700: '#03313a',
          800: '#022026',
          900: '#011013'
        },
        secondary: '#055160',
      },
    },
  },
  plugins: [],
} 