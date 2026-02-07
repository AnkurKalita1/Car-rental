/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#1D4ED8",
          gray: "#6B7280",
          dark: "#0F172A",
          lightBlue: "#E9F1FF",
          silkGrey: "#EEF0F4"
        }
      },
      boxShadow: {
        silky: "0 18px 40px rgba(15, 23, 42, 0.14)",
        glossy: "0 10px 24px rgba(15, 23, 42, 0.12)"
      }
    }
  },
  plugins: []
};
