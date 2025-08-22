/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    {
      pattern: /bg-(red|blue|orange|green|purple)-(100|200|300|400|500|600|700|800)/,
    },
    {
      pattern: /text-(red|blue|orange|green|purple)-(100|200|300|400|500|600|700|800)/,
    },
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
