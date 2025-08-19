// src/App.jsx
// 메인 앱 컴포넌트 - 스플래시 화면과 메인 라우팅을 관리
import { BrowserRouter } from "react-router-dom";
import { useState } from "react";
import SplashPage from "./pages/SplashPage";
import AppRoutes from "./routes/AppRoutes";
import "./styles/globals.css";

export default function App() {
  // 스플래시 화면을 보여줄지 결정하는 상태
  const [showSplash, setShowSplash] = useState(true);

  // 스플래시 화면이 완료되었을 때 호출되는 함수
  const handleSplashComplete = () => {
    setShowSplash(false); // 스플래시 숨기고 메인 앱 표시
  };

  return (
    <BrowserRouter>
      <div className="mobile">
        {/* 스플래시 화면이 true면 스플래시, false면 메인 앱 표시 */}
        {showSplash ? (
          <SplashPage onComplete={handleSplashComplete} />
        ) : (
          <AppRoutes />
        )}
      </div>
    </BrowserRouter>
  );
}
