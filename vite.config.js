import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // Cho phép truy cập từ IP LAN
    port: 5173,
    allowedHosts: [
      "5d76-14-231-180-44.ngrok-free.app",
      "localhost",
      "127.0.0.1",
    ],
  },
});
