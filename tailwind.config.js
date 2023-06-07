/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary1:  "#0B1437"  ,//"#4338ca",
        secondary1: "#111C44",//"#1F2937" ,//"#4f46e5",
        sidebar1: "#0B1437",//"#1f2937"

        primary:  "#fff"  ,//"#4338ca",
        secondary: "#e5e7eb",//"#1F2937" ,//"#4f46e5",
        sidebar: "#fff",//"#1f2937"

        // whgpk: '#000000',
        // blgpk: '#fff'
        whgpk: '#fff',
        blgpk: '#000000'

      }
    },
  },
  plugins: [],
}
