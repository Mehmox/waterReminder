/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#D0F0FF",
          hover: "#AEEFFF"
        },
        secondery:{
          DEFAULT: "#034efc",
        }
      }
    },
  },
  plugins: [],
}