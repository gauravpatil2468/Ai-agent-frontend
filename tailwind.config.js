/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        base: ['Poppins', 'sans-serif'],
      },
      colors: {
        'bg-primary':   '#081028',
        'bg-secondary': '#0A1330',
        'bg-card':      '#0B1739',
        'bg-hover':     '#1E2C57',
        violet:         '#CB3CFF',
        blue:           '#00C2FF',
        'text-default': '#FFFFFF',
        'text-base':    '#AEB9E1',
      }
    }
  },
  plugins: [],
}
