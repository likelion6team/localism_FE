import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // 네트워크 접근 허용
    port: 5173,
    // https: true 제거 - HTTP로 변경
  },
});
