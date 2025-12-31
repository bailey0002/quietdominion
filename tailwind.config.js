/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Muted, atmospheric palette
        parchment: '#f4f1eb',
        ink: '#1a1a1a',
        sepia: '#8b7355',
        moss: '#4a5c4a',
        rust: '#8b4513',
        slate: '#4a5568',
        gold: '#b8860b',
        ember: '#cd5c5c',
      },
      fontFamily: {
        display: ['Cinzel', 'serif'],
        body: ['Crimson Text', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(184, 134, 11, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(184, 134, 11, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}
