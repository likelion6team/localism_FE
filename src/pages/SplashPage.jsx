// src/pages/SplashPage.jsx
// 앱 시작 시 나타나는 스플래시 화면 - 로고와 슬로건 표시
import React, { useState, useEffect } from "react";
import "./SplashPage.css";

export default function SplashPage({ onComplete }) {
  // 스플래시 화면을 보여줄지 결정하는 상태
  const [showSplash, setShowSplash] = useState(true);

  // 3초 후 자동으로 스플래시 화면을 숨기고 메인 앱으로 이동
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      onComplete(); // 부모 컴포넌트에 완료 알림
    }, 3000);

    // 컴포넌트가 언마운트될 때 타이머 정리
    return () => clearTimeout(timer);
  }, [onComplete]);

  // 클릭/터치 시 즉시 스플래시 화면을 숨기고 메인 앱으로 이동
  const handleClick = () => {
    setShowSplash(false);
    onComplete(); // 부모 컴포넌트에 완료 알림
  };

  // 스플래시가 false면 아무것도 렌더링하지 않음
  if (!showSplash) return null;

  return (
    <div className="splash-container" onClick={handleClick}>
      <div className="splash-content">
        {/* ResQ 로고 이미지 */}
        <img
          src="/src/assets/icons/logo2.svg"
          alt="ResQ Logo"
          className="splash-logo"
        />

        {/* ResQ 슬로건 */}
        <p className="splash-slogan">Tech with a heartbeat. That's ResQ.</p>

        {/* 사용자 안내 텍스트 */}
        <p className="splash-hint">터치하면 자동으로 진행됩니다</p>
      </div>
    </div>
  );
}
