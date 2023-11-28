/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        title: "#FFA500",
        primary: {
          DEFAULT: "#EC5863",
          100: " #FFE8EA",
          200: "#F7BCC1",
          300: "#F49BA1",
          400: "#F07982",
          500: "#EC5863",
          600: "#BD464F",
          700: "#8E353B",
          800: "#5E2328",
          900: "#2F1214",
        },
        secondary: {
          100: "#f5f7fb"
        }
      },
    },
  },
  plugins: [],
};
