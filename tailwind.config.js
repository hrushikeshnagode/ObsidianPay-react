/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#090b11',
          900: '#0f1218',
        },
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 16px 40px rgba(0, 0, 0, 0.35)',
      },
    },
  },
  plugins: [],
}
