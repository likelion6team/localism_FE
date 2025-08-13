// src/features/report/presenter/steps/Step4Breathing.jsx
import { useEffect, useState } from "react";
import "./Step4Breathing.css";

export default function Step4Breathing({ onNext, onBack }) {
  const [selected, setSelected] = useState("");

  const options = [
    { id: "normal", text: "정상 (규칙적)" },
    { id: "difficult", text: "어려움 (가쁘거나 불규칙)" },
    { id: "none", text: "없음 (호흡하지 않음)" },
  ];

  const selectOption = (id) => {
    setSelected(id);
  };

  const goNext = () => {
    if (!selected) return;
    localStorage.setItem("breathing", selected);
    if (onNext) onNext();
  };

  const goBack = () => {
    if (onBack) onBack();
    else window.history.back();
  };

  const goHome = () => {
    // 역할 선택 페이지로 이동
    window.location.href = "/role-selection"; // 또는 적절한 경로
  };

  useEffect(() => {
    const saved = localStorage.getItem("breathing");
    if (saved) setSelected(saved);
  }, []);

  return (
    <div className="step4-page">
      <div className="app-container">
        {/* Header */}
        <div className="header">
          <button
            className="back-btn"
            type="button"
            aria-label="뒤로가기"
            onClick={goBack}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-base font-bold text-black">사고 리포트 작성</h1>
          <div style={{ width: 24 }} />
        </div>

        {/* 홈으로 버튼 - 헤더 아래 오른쪽에 별도 배치 */}
        <div className="home-link-container">
          <button
            className="home-btn"
            type="button"
            onClick={goHome}
            aria-label="홈으로"
          >
            ← 홈으로
          </button>
        </div>

        {/* Progress */}
        <div className="progress">
          <div className="progress-text">4/5</div>
        </div>

        {/* Main */}
        <div className="content">
          <div className="text-center mb-8">
            <h2 className="main-title">
              <span className="blue-text">호흡상태</span>
            </h2>
            <p className="main-title black-text">를 입력해주세요.</p>
          </div>

          {/* Step4 전용: 1열 세로 스택 배치 */}
          <div className="option-stack">
            {options.map((o) => (
              <button
                key={o.id}
                id={o.id}
                type="button"
                className={`option-button ${
                  selected === o.id ? "selected" : ""
                }`}
                onClick={() => selectOption(o.id)}
              >
                <div className="option-text">{o.text}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Next */}
        <button
          type="button"
          className="next-button"
          onClick={goNext}
          disabled={!selected}
        >
          다음
        </button>

        <div className="home-indicator" />
      </div>
    </div>
  );
}
