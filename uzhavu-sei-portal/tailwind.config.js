/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#166534", // Green-800
        secondary: "#ca8a04", // Yellow-600
        danger: "#dc2626", // Red-600
        dark: "#1c1917", // Stone-900
        light: "#f5f5f4", // Stone-100
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
