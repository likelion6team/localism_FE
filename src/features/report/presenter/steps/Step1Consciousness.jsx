// src/features/report/presenter/steps/Step1Consciousness.jsx
import { useEffect, useState } from "react";
import "./Step1Consciousness.css";

export default function Step1Consciousness({ onNext, onBack }) {
  const [selected, setSelected] = useState("");

  const options = [
    { id: "normal", text: "정상 (말을 하고 반응함)" },
    { id: "drowsy", text: "흐림 (반응이 느림)" },
    { id: "unconscious", text: "의식잃음 (반응하지 않음)" },
  ];

  const selectOption = (id) => {
    setSelected(id);
  };

  const goToNext = () => {
    if (!selected) return;
    localStorage.setItem("consciousness", selected);
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
    const saved = localStorage.getItem("consciousness");
    if (saved) setSelected(saved);
  }, []);

  return (
    <div className="app-container">
      {/* Header - 뒤로가기 + 제목만 */}
      <div className="header">
        <button
          className="back-btn"
          type="button"
          onClick={goBack}
          aria-label="뒤로가기"
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
        <div className="progress-text">1/5</div>
      </div>

      {/* Main Content */}
      <div className="content">
        <div className="text-center mb-8">
          <h2 className="main-title">
            <span className="blue-text">의식상태</span>
            <span className="black-text">를</span>
          </h2>
          <p className="main-title black-text">입력해주세요.</p>
        </div>

        {/* Options */}
        <div>
          {options.map((o) => (
            <button
              key={o.id}
              id={o.id}
              type="button"
              onClick={() => selectOption(o.id)}
              className={`option-button ${selected === o.id ? "selected" : ""}`}
            >
              <div className="option-text-lg">{o.text}</div>
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          id="nextBtn"
          type="button"
          onClick={goToNext}
          disabled={!selected}
          className="next-button"
        >
          다음
        </button>
      </div>

      {/* Home Indicator */}
      <div className="home-indicator" />
    </div>
  );
}
