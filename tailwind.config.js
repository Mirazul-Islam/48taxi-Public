/** @type {import('tailwindcss').Config} */
// Colour scheme: rich chocolate-espresso backgrounds, cream text,
// amber (#FD9800) buttons/accents and the orange (#F85A00) logo.
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // accent (amber). `brand-700` is the main accent used for buttons, links and highlights.
        brand: { DEFAULT: '#FD9800', 50: '#3A2617', 100: '#4D321C', 600: '#E98C00', 700: '#FD9800', 800: '#FFB547' },
        logo: '#F85A00',
        // text on dark backgrounds
        ink: { DEFAULT: '#F3EEE9', 2: '#DCCFC3', 3: '#BCAEA2' },
        sand: '#D2C1AB',
        // surfaces
        paper: '#28170E', // page background (rich chocolate)
        band: '#321E13', // alternate section background
        coal: '#241A14', // darker band
        card: '#352115', // cards, panels
        chip: '#432C1E',
        line: '#523828', // borders
        night: '#1D1009', // footer and dark bands
        onaccent: '#141006', // text on amber buttons (AA contrast)
      },
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      maxWidth: { site: '76rem' },
    },
  },
  plugins: [],
};
