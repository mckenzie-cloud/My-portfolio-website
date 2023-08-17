/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
          './views/**/*.ejs',
          './public/js/*.js',
        ],
  daisyui: {
    themes: ['retro', 'lofi', 'emerald', 'acid']
  },
  theme: {
    extend: {
      fontFamily: {
        heading: ['DM Sans', 'sans-serif'],
        paragraph: ['Open Sans', 'sans-serif']
      },
      fontSize: {
        heading: ['56px'],
        subheading: ['20px'],
        paragraph: ['12px', '24px']
      }
    },
  },
  plugins: [
    require("daisyui")
  ],
}

