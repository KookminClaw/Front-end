/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4F6EF7',
        'primary-light': '#EEF1FE',
        accent: '#FF6B6B',
        surface: '#F4F6FB',
        heading: '#1A1A2E',
        subtext: '#6B7280',
        line: '#E5E7EB',
      },
    },
  },
  plugins: [],
}
