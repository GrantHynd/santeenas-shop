/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {},
    colors: {
      'currentColor': 'currentColor',
      'primary': {
        DEFAULT: '#ED4078',
        50: '#FDE8EF',
        100: '#FBD5E1',
        200: '#F8B0C7',
        300: '#F48BAD',
        400: '#F16592',
        500: '#ED4078',
        600: '#E01557',
        700: '#AD1043',
        800: '#790B2F',
        900: '#46071B'
      },
      'white': '#fff',
    },
  },
  plugins: [],
}
