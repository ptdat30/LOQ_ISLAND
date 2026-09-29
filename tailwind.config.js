/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sf: ["'SF Pro Display'", '-apple-system', 'BlinkMacSystemFont', "'Inter'", 'system-ui', 'sans-serif'],
      },
      colors: {
        island: {
          bg: "#000000",
          accent: "#0A84FF",
        }
      },
      animation: {
        'wave': 'wave 1.2s ease-in-out infinite',
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'scaleY(0.4)' },
          '50%': { transform: 'scaleY(1)' },
        }
      }
    },
  },
  plugins: [],
}
