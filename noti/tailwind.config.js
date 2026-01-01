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
          hover: "#7de5ff"
        },
        secondery:{
          DEFAULT: "#034efc",
        }
      },
      width: {
        "preview": "400px"
      },
      height: {
        "preview": "230px"
      }
    },
  },
  plugins: [],
}