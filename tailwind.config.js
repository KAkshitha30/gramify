/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(210, 50%, 55%)',
        accent: 'hsl(45, 60%, 55%)',
        background: 'hsl(0, 0%, 98%)',
        surface: 'hsl(0, 0%, 100%)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
