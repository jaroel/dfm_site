/** @type {import('tailwindcss').Config} */
module.exports = {
  content: {
    files: ["*.html", "./app/src/**/*.rs", "./server/src/**/*.rs", "./frontend/src/**/*.rs"],
  },
  theme: {
    extend: {},
  },
  plugins: [],
}