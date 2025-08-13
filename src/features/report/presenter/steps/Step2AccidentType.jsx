// src/features/report/presenter/steps/Step2AccidentType.jsx
import { useEffect, useState } from "react";
import "./Step2AccidentType.css";

export default function Step2AccidentType({ onNext, onBack }) {
  const [selected, setSelected] = useState([]);

  const options = [
    { id: "traffic", icon: "🚗", text: "교통사고" },
    { id: "electric", icon: "⚡", text: "감전" },
    { id: "fall", icon: "🔄", text: "추락/낙상" },
    { id: "stab", icon: "🔪", text: "자상/출혈" },
    { id: "burn", icon: "🔥", text: "화상" },
    { id: "other", icon: "❓", text: "기타 / 모름" },
  ];

  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const goNext = () => {
    if (selected.length === 0) return;
    localStorage.setItem("accidentTypes", JSON.stringify(selected));
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
    const saved = localStorage.getItem("accidentTypes");
    if (saved) {
      try {
        const arr = JSON.parse(saved);
        if (Array.isArray(arr)) setSelected(arr);
      } catch {}
    }
  }, []);

  return (
    <div className="app-container">
      {/* Header */}
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
        <div className="progress-text">2/5</div>
      </div>

      {/* Main Content */}
      <div className="content">
        <div className="text-center mb-8">
          <h2 className="main-title">
            <span className="blue-text">사고 유형을</span>
          </h2>
          <p className="main-title black-text">선택해주세요.</p>
          <p className="sub-title">어떤 사고 상황인가요? (중복가능)</p>
        </div>

        {/* Options Grid */}
        <div className="option-grid">
          {options.map((o) => {
            const isSelected = selected.includes(o.id);
            return (
              <button
                key={o.id}
                id={o.id}
                type="button"
                className={`option-button ${isSelected ? "selected" : ""}`}
                onClick={() => toggle(o.id)}
              >
                <div className="option-icon">{o.icon}</div>
                <div className="option-text">{o.text}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Next Button */}
      <button
        id="nextBtn"
        type="button"
        onClick={goNext}
        disabled={selected.length === 0}
        className="next-button"
      >
        다음
      </button>

      {/* Home Indicator */}
      <div className="home-indicator" />
    </div>
  );
}
