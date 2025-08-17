/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // enable dark mode with "class" strategy
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-open-sans)", "sans-serif"], // 👈 Open Sans is your default font
      },
      colors: {
        brand: {
          DEFAULT: "#3B82F6", // blue-500
          dark: "#2563EB",    // blue-600
          light: "#60A5FA",   // blue-400
        },
        accent: "#F59E0B", // amber-500
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
