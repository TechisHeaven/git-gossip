/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        mainBackgroundColor: "#050d21",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
