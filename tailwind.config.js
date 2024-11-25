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
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
      backgroundColor: {
        dark: {
          DEFAULT: '#1a1b1e',
          paper: '#2c2d31',
          card: '#323232',
          hover: '#2a2a2a',
        },
        light: {
          DEFAULT: '#ffffff',
          paper: '#f8fafc',
          card: '#ffffff',
          hover: '#f1f5f9',
        }
      },
      textColor: {
        dark: {
          primary: '#ffffff',
          secondary: '#9ca3af',
          disabled: '#6b7280',
        },
        light: {
          primary: '#111827',
          secondary: '#4b5563',
          disabled: '#9ca3af',
        }
      },
      borderColor: {
        dark: {
          DEFAULT: '#404040',
          hover: '#525252',
        },
        light: {
          DEFAULT: '#e5e7eb',
          hover: '#d1d5db',
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

