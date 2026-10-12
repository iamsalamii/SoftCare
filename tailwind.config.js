/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        night: '#021411',
        deep: '#041f1a',
        darkforest: '#010d0b',
        surface: {
          card: '#062e26',
          dim: '#031714',
          high: '#09382f',
          border: 'rgba(0, 220, 130, 0.22)',
        },
        neon: '#00dc82',
        mint: '#45f99c',
        emerald: '#10b981',
        paper: '#d0e7e2',
        // Preservation of tokens
        'soft-night': '#021411',
        'soft-deep': '#041f1a',
        'soft-electric': '#00dc82',
        'soft-turquoise': '#3fd0c9',
        'soft-paper': '#d0e7e2',
        'soft-text': '#0d1b33',
      },
      fontFamily: {
        serif: ['Newsreader', 'Fraunces', 'serif'],
        fraunces: ['Fraunces', 'serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['Space Grotesk', 'monospace'],
      },
      boxShadow: {
        'neon-glow': '0 0 35px rgba(0, 220, 130, 0.45)',
        'neon-sm': '0 0 15px rgba(0, 220, 130, 0.3)',
        'neon-lg': '0 0 50px rgba(0, 220, 130, 0.55)',
        'emerald-card': '0 20px 45px -10px rgba(0, 20, 15, 0.8), 0 0 25px rgba(0, 220, 130, 0.08)',
      },
      transitionTimingFunction: {
        cinematic: 'cubic-bezier(0.16, 1, 0.3, 1)',
        curtain: 'cubic-bezier(0.76, 0, 0.24, 1)',
      },
    },
  },
  plugins: [],
};
