import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // 네트워크 접근 허용
    port: 5173,
    // https: true 제거 - HTTP로 변경
  },
  define: {
    // 환경 변수를 클라이언트에서 사용할 수 있도록 설정
    "import.meta.env.VITE_API_URL": JSON.stringify(
      "https://api.localism0825.store"
    ),
  },
});
