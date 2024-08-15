/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#00acb4",
        secondary: "#0e7d81",
      },
    },
  },
  plugins: [],
};
