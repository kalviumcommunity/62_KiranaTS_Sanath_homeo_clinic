/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        cursive: ['"Dancing Script"', 'cursive'],
      },
      keyframes: {
        leaf1: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(-20deg)' },
        },
        leaf2: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-14px) rotate(15deg)' },
        },
        leaf3: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(-10deg)' },
        },
      },
      animation: {
        leaf1: 'leaf1 3s ease-in-out infinite',
        leaf2: 'leaf2 3.5s ease-in-out infinite',
        leaf3: 'leaf3 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
