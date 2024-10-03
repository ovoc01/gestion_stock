import { colors, nextui } from '@nextui-org/theme'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {

    container: {
      center: true,


    },
    extend: {
      colors: {
        dark: {
          DEFAULT: 'RGBA(29,29,29,100)'
        },
        warning: {
          DEFAULT: ' RGBA(255,242,0,100)'
        },
        primary: {
          DEFAULT: 'RGBA(10,72,102,1)'
        },
        secondary: {
          DEFAULT: 'RGBA(107,74,116,1)'
        },
        success: {
          DEFAULT: 'RGBA(192,206,46,100)'
        },
        light: {
          DEFAULT: 'RGBA(255,255,255,100)'
        },
        colaYellow: 'rgba(255, 242, 0, 1)',
        colaBlack: 'rgba(29, 29, 29, 1)',
        colaWhite: 'rgba(255, 255, 255, 1)',
        colaBlueF: 'rgba(10, 72, 102, 1)',
        colaBlueF20: 'rgba(10, 72, 102, 0.2)',
        colaBlueC: 'rgba(160, 200, 216, 1)',
        colaGreen: 'rgba(192, 206, 46, 1)',
        colaVioletF: 'rgba(107, 74, 116, 1)',
        colaTurquoise: 'rgba(0, 187, 187, 1)',
        colaPrune: 'rgba(192, 17, 111, 1)',
        colaOrange: 'rgba(238, 116, 2, 1)',
        colaGrayP: 'rgba(202, 202, 202, 1)',
      },

    }
  },
  darkMode: "class",
  plugins: [
    nextui()
  ],
}
