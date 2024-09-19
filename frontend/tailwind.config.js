import {colors, nextui} from '@nextui-org/theme'

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
    
    container:{
      center:true,
      
      
    },
    extend:{
      colors:{
          dark:{
              DEFAULT:'RGBA(29,29,29,100)'
          },
          warning:{
            DEFAULT:' RGBA(255,242,0,100)'
          },
          primary:{
            DEFAULT:'RGBA(10,72,102,1)'
          },
          secondary:{
            DEFAULT:'RGBA(160,200,216,100)'
          },
          success:{
            DEFAULT:'RGBA(192,206,46,100)'
          },
          light:{
            DEFAULT:'RGBA(255,255,255,100)'
          }
      },

    }
  },
  darkMode: "class",
  plugins: [
    nextui()
  ],
}
