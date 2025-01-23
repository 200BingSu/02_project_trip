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
        secondary1: "#FFF600",
        secondary2: "#6B4AD6",
        secondary3: "#FB653D",
      },
    },
  },
  plugins: [],
};
