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
          babyPink: '#FFB6C1',
          rosePink: '#FF69B4',
          softPeach: '#FFDAB9',
          lavender: '#E6E6FA',
          darkPink: '#DB7093',
          lightPink: '#FFE4E1',
        },
        secondary: {
          gray: '#F5F5F5',
          dark: '#333333',
          light: '#FAFAFA',
        }
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['Inter', 'sans-serif'],
        'cursive': ['Dancing Script', 'cursive'],
      },
      backgroundImage: {
        'gradient-pink': 'linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%)',
        'gradient-peach': 'linear-gradient(135deg, #FFDAB9 0%, #FFE4E1 100%)',
        'gradient-lavender': 'linear-gradient(135deg, #E6E6FA 0%, #D8BFD8 100%)',
      },
      boxShadow: {
        'soft': '0 10px 30px -5px rgba(255, 182, 193, 0.3)',
        'glass': '0 8px 32px 0 rgba(255, 182, 193, 0.15)',
        'premium': '0 20px 60px -10px rgba(255, 105, 180, 0.2)',
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