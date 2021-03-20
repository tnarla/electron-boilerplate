const tailwindcss = require("tailwindcss");
const colors = require("tailwindcss/colors");

module.exports = {
  purge: ["./src/**/*.tsx"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        yellow: colors.amber,
        gray: colors.coolGray,
        green: colors.emerald,
        red: colors.rose,
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
