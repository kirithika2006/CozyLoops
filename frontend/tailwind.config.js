/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          white: '#FFFFFF',
          babyPink: '#E7D1D7',
          rosePink: '#A23F62',
          softPeach: '#E9D9C9',
          lavender: '#E7E3EC',
          darkPink: '#79354D',
          lightPink: '#F7EDF0',
        },
        secondary: {
          gray: '#F0EEEB',
          dark: '#3B3034',
          light: '#FAF8F5',
        }
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['Inter', 'sans-serif'],
        'cursive': ['Dancing Script', 'cursive'],
      },
      backgroundImage: {
        'gradient-pink': 'linear-gradient(135deg, #A23F62 0%, #79354D 100%)',
        'gradient-peach': 'linear-gradient(135deg, #E9D9C9 0%, #F7EDF0 100%)',
        'gradient-lavender': 'linear-gradient(135deg, #E7E3EC 0%, #D7CFDD 100%)',
      },
      boxShadow: {
        'soft': '0 8px 24px -8px rgba(59, 48, 52, 0.14)',
        'glass': '0 8px 24px 0 rgba(59, 48, 52, 0.08)',
        'premium': '0 12px 32px -12px rgba(59, 48, 52, 0.2)',
      },
      backdropBlur: {
        'glass': 'blur(10px)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.8s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 },
        },
        slideUp: {
          '0%': { transform: 'translateY(50px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}
