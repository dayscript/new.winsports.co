module.exports = {
  prefix: 'tw-',
  important: true,
  theme: {
    fontFamily: {
      sans: ['Source Sans Pro', 'sans-serif'],
      display: ['Source Sans Pro', 'sans-serif'],
      body: ['Source Sans Pro', 'sans-serif'],
    },
    extend: {
      colors: {
        primary: {
          default: '#0b3b41',
          dark:'#07262A',
        },
        secondary: {
          default: '#0ef8c3',
        },
        gray: {
          100: '#f7fafc',
          200: '#edf2f7',
          300:'#e2e8f0',
          400:'#cbd5e0',
          500:'#a0aec0',
          600:'#718096',
          700:'#4a5568',
          800:'#2d3748',
          900:'#1a202c',
          default: '#e3e3e3',
        }
      }
    },
  },
  variants: {},
  plugins: []
}
