/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Vite 프로젝트에 맞는 파일 확장자 추가
  ],
  theme: {
    extend: {
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
      },
    },
  },
  plugins: [],
};
