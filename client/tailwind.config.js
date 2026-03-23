/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(235, 85%, 65%)',
          glow: 'hsla(235, 85%, 65%, 0.3)',
        }
      },
      borderRadius: {
        'xl': '24px',
        'lg': '16px',
        'md': '12px',
      }
    },
  },
  plugins: [],
}
