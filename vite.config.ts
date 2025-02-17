import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  server: {
    host: "0.0.0.0",
    proxy: {
      "/api": {
        // target: "http://192.168.0.144:5221",
        target: "http://112.222.157.157:5221",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
