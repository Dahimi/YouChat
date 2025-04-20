/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#ff0000', // YouTube red
        'primary-dark': '#cc0000',
        'primary-light': '#ff3333',
        'background': '#0f0f0f', // Dark theme
        'surface': '#1f1f1f',
        'text': '#ffffff',
        'text-secondary': '#aaaaaa',
      },
      boxShadow: {
        'command': '0 0 0 1px rgba(255, 255, 255, 0.1), 0 8px 16px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
} 