/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Vite 프로젝트에 맞는 파일 확장자 추가
  ],

  plugins: [require("@tailwindcss/line-clamp")],
  theme: {
    extend: {
      screens: {
        xxs: "320px",
        xs: "480px",
      },
      colors: {
        primary: "#0DD1FD",
        primary2: "#A5EEFE",
        primary3: "#02AED5",
        secondary1: "#FFF600",
        secondary1_2: "#FFFDCC",
        secondary1_3: "#CCC500",
        secondary2: "#6B4AD6",
        secondary2_2: "#AF9DE9",
        secondary2_3: "#4F2CC1",
        secondary3: "#FB653D",
        secondary3_2: "#FDB4A1",
        secondary3_3: "#FA3D0B",
        slate: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
        },
        info: "#006BFF",
        warning: "#FDE047",
        error: "#EF4444",
      },
      fontFamily: {
        "work-sans": ['"Work Sans"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
