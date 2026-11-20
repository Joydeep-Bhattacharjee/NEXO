/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark Navy Gaming Theme
        background: '#0f1626',
        'background-light': '#141d2e',
        'background-feed': '#0f1626',
        'background-card': '#141d2e',
        card: '#141d2e',
        navbar: '#0a101a',
        sidebar: '#0a101a',
        // Neon accent colors
        primary: {
          DEFAULT: '#00FFFF', // Electric cyan
          dark: '#00CCCC',
          light: '#33FFFF',
        },
        neon: {
          cyan: '#00FFFF',
          purple: '#A020F0',
          green: '#39FF14',
          pink: '#FF10F0',
          orange: '#FF6B00',
        },
        // Secondary accents
        live: '#FF10F0',
        accent: '#39FF14',
        warning: '#FF6B00',
        success: '#39FF14',
        // Text colors
        text: {
          primary: '#E0E0E0',
          secondary: '#A0A0A0',
          muted: '#707070',
          light: '#FFFFFF',
        },
        // Border colors
        border: {
          DEFAULT: '#1a2744',
          light: '#243554',
          dark: '#0f1626',
          neon: '#00FFFF',
        },
        // Hover states
        hover: {
          DEFAULT: '#1a2744',
          dark: '#141d2e',
        },
      },
      fontFamily: {
        heading: ['Rajdhani', 'Orbitron', 'sans-serif'],
        body: ['Rajdhani', 'Roboto Mono', 'sans-serif'],
        gaming: ['Orbitron', 'Rajdhani', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-gaming': 'linear-gradient(135deg, #00FFFF 0%, #A020F0 50%, #39FF14 100%)',
        'gradient-dark': 'linear-gradient(180deg, #1E1E1E 0%, #2A2A2A 50%, #1A1A2E 100%)',
        'gradient-card': 'linear-gradient(145deg, #2C2C2C 0%, #1E1E1E 100%)',
        'gradient-neon': 'linear-gradient(90deg, #00FFFF, #A020F0, #39FF14)',
      },
      animation: {
        'pulse-live': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'border-glow': 'border-glow 3s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #00FFFF, 0 0 10px #00FFFF, 0 0 15px #00FFFF' },
          '100%': { boxShadow: '0 0 10px #A020F0, 0 0 20px #A020F0, 0 0 30px #A020F0' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 5px currentColor, 0 0 10px currentColor' },
          '50%': { boxShadow: '0 0 15px currentColor, 0 0 25px currentColor' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'border-glow': {
          '0%, 100%': { borderColor: '#00FFFF' },
          '33%': { borderColor: '#A020F0' },
          '66%': { borderColor: '#39FF14' },
        },
      },
      boxShadow: {
        'neon': '0 0 10px #00FFFF, 0 0 20px #00FFFF',
        'neon-purple': '0 0 10px #A020F0, 0 0 20px #A020F0',
        'neon-green': '0 0 10px #39FF14, 0 0 20px #39FF14',
        'neon-pink': '0 0 10px #FF10F0, 0 0 20px #FF10F0',
        'card': '0 4px 20px rgba(0, 0, 0, 0.5)',
        'card-hover': '0 8px 30px rgba(0, 255, 255, 0.2)',
      },
    },
  },
  plugins: [],
};
