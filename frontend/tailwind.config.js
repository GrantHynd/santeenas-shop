/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.tsx"],
  daisyui: {
    styled: true,
    themes: false,
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    darkTheme: "dark",
    themes: [
      {
        theme: {
        "primary": "#ED407A",
        "secondary": "#A991F7",
        "accent": "#88DBDD",
        "neutral": "#db2777",
        "base-100": "#FFFFFF",
        "info": "#c7d2fe",
        "success": "#a7f3d0",
        "warning": "#fef08a",
        "error": "#fca5a5",
        },
      },
    ],
  },
  plugins: [
    require("daisyui")
  ],
}
