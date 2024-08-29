/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Define tus colores personalizados aquí
        primary: {
          light: '#7c3aed',
          DEFAULT: '#6b21a8',
          dark: '#4c1d95',
        },
        secondary: {
          light: '#fbbf24',
          DEFAULT: '#f59e0b',
          dark: '#b45309',
        },
        // Sobrescribir colores predeterminados de Tailwind
        gray: {
          light: '#d1d5db',
          DEFAULT: '#9ca3af',
          dark: '#4b5563',
        },
        background: {
          light: '#ffffff',
          dark: '#4b5563',
        },
        text: {
          light: '#000000',
          dark: '#ffffff',
        },
      },
    },
  },
  plugins: [],
}

