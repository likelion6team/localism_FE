// src/features/report/presenter/steps/Step3Symptoms.jsx
import { useEffect, useState } from "react";
import "./Step3Symptoms.css";

export default function Step3Symptoms({ onNext, onBack }) {
  const [selected, setSelected] = useState([]);

  const options = [
    { id: "breathing", icon: "😮‍💨", text: "호흡곤란" },
    { id: "drug", icon: "💊", text: "약물반응" },
    { id: "bleeding", icon: "🩸", text: "출혈" },
    { id: "unconscious", icon: "😵", text: "의식없음" },
    { id: "vomiting", icon: "🤮", text: "구토" },
    { id: "convulsion", icon: "💫", text: "경련" },
    { id: "hypothermia", icon: "🥶", text: "저체온증" },
    { id: "fracture", icon: "🦴", text: "골절" },
    { id: "burn", icon: "🔥", text: "화상" },
    { id: "other", icon: "❓", text: "기타 / 모름" },
  ];

  const toggle = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const goNext = () => {
    if (selected.length === 0) return;
    localStorage.setItem("symptoms", JSON.stringify(selected));
    onNext?.();
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
    const saved = localStorage.getItem("symptoms");
    if (saved) setSelected(JSON.parse(saved));
  }, []);

  return (
    <div className="app-container step3">
      {/* Header - Step1, Step2와 동일하게 추가 */}
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

      {/* Progress - 3/5 추가 */}
      <div className="progress">
        <div className="progress-text">3/5</div>
      </div>

      <div className="content">
        <h2 className="main-title">
          <span className="blue-text">증상</span>을
        </h2>
        <p className="main-title black-text">선택해주세요.</p>
        <p className="sub-title">어떤 증상이 나타나나요? (중복가능)</p>

        <div className="option-grid">
          {options.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => toggle(o.id)}
              className={`option-button ${
                selected.includes(o.id) ? "selected" : ""
              }`}
            >
              <span className="option-icon">{o.icon}</span>
              <span className="option-text">{o.text}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        className="next-button"
        disabled={selected.length === 0}
        onClick={goNext}
        type="button"
      >
        다음
      </button>

      {/* Home Indicator 추가 */}
      <div className="home-indicator" />
    </div>
  );
}
