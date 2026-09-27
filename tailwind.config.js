/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf1f6',
          100: '#fce4ee',
          200: '#f9c8dd',
          300: '#f593bf',
          400: '#ee5aa0',
          500: '#e91e86',
          600: '#d0116f',
          700: '#a80f5c',
          800: '#7e0e48',
          900: '#520a30',
        },
        teal: {
          50: '#eafbf5',
          500: '#0f9d69',
          600: '#0c7f56',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(82, 10, 48, 0.06), 0 1px 3px rgba(82, 10, 48, 0.08)',
      },
    },
  },
  plugins: [],
}
