/** @type {import('tailwindcss').Config} */
// Colour scheme matched to the current 48taxi.co theme: espresso-brown backgrounds, cream text,
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
        paper: '#231A18', // page background
        band: '#301E19', // alternate section background
        coal: '#232120', // charcoal band
        card: '#2B201D', // cards, panels
        chip: '#3A2C27',
        line: '#46362F', // borders
        night: '#1F140F', // footer and dark bands
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
