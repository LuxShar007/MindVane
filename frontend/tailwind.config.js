/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#040d1a', // Twilight Midnight Blue
        accentPurple: 'rgb(var(--color-primary) / <alpha-value>)', // Dynamic Twilight Blue
        accentMagenta: 'rgb(var(--color-secondary) / <alpha-value>)', // Dynamic Sunset Orange
        accentEmerald: '#10b981', // Emerald Green for stable metrics
        accentAmber: '#f59e0b', // Amber for elevated stress
        scarletRed: '#dc2626', // Scarlet for alert
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'marquee': 'marquee 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        }
      }
    },
  },
  plugins: [],
}
