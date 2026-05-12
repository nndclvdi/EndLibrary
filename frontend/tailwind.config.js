/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        espresso: '#2B1710',
        mocha: '#5A3825',
        caramel: '#B97845',
        latte: '#F7E7CE',
        cream: '#FFF8ED',
        cocoa: '#8A5A3B',
      },
      fontFamily: {
        display: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 70px rgba(90, 56, 37, 0.18)',
      },
    },
  },
  plugins: [],
};
