/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Archivo', 'Saira', '"Helvetica Neue"', 'sans-serif'],
        'sans': ['"Noto Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'barlow': ['"Barlow Condensed"', 'sans-serif'],
      },
      colors: {
        accent: {
          DEFAULT: 'var(--accent-solid)',
          light: 'var(--accent-light)',
          deep: 'var(--accent-deep)',
        },
        ink: '#181C20',
        charcoal: {
          DEFAULT: '#2E3438',
          deep: '#1C2124',
          black: '#111111',
        },
        onDark: '#9DA8AE',
      },
      spacing: {
        'large': '5.5rem',
      },
      maxWidth: {
        'shell': '1440px',
      },
    },
  },
  plugins: [],
}
