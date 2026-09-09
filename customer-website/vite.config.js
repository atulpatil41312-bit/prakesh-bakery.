import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // Relative assets work on both localhost and a GitHub Pages project URL.
  base: "./",
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
  },
});
