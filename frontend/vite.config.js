import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: [
      "38e4a0c6ed70.ngrok-free.app",
      'braidster.locally.me',
      'localhost',
      '.locally.me'
    ]
  },
});
