/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',         // ← include your App‐Router files
    './pages/**/*.{js,ts,jsx,tsx}',       // ← only if you still have pages/
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
