import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  define: {
    global: "window",
  }, // stompjs 사용시 필요
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  server: {
    host: "0.0.0.0",
    proxy: {
      "/api": {
        // target: "http://192.168.0.144:5231",
        target: "http://112.222.157.157:5231",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
