// src/features/report/presenter/steps/Step2AccidentType.jsx
// Step2: 사고 유형 선택 페이지 - 어떤 종류의 사고인지 선택하는 화면
import { useState, useEffect } from "react";
import "./Step2AccidentType.css";

export default function Step2AccidentType({ onNext, onBack }) {
  // 선택된 사고 유형을 저장하는 상태
  const [selected, setSelected] = useState(null);
  // "기타/모름" 선택 시 추가 입력 필드를 보여줄지 결정하는 상태
  const [showOtherInput, setShowOtherInput] = useState(false);
  // "기타/모름" 입력 텍스트를 저장하는 상태
  const [otherText, setOtherText] = useState("");

  // 페이지 로드 시 이전에 선택한 옵션이 있다면 복원
  useEffect(() => {
    // const saved = localStorage.getItem("accidentTypes");
    // if (saved) {
    //   setSelected(saved);
    // }
  }, []);

  // 사고 유형 옵션을 선택하거나 선택 해제하는 함수 (토글 기능)
  const toggle = (option) => {
    if (selected === option) {
      // 이미 선택된 옵션을 다시 클릭하면 선택 해제
      setSelected(null);
      setShowOtherInput(false);
      setOtherText("");
      localStorage.removeItem("accidentTypes");
    } else {
      // 새로운 옵션 선택
      setSelected(option);
      if (option === "기타/모름") {
        setShowOtherInput(true);
      } else {
        setShowOtherInput(false);
        setOtherText("");
      }
      localStorage.setItem("accidentTypes", option);
    }
  };

  // 다음 단계로 이동하는 함수
  const goNext = () => {
    if (selected) {
      if (selected === "기타/모름" && otherText.trim()) {
        // "기타/모름" 선택 시 추가 텍스트도 함께 저장
        localStorage.setItem("accidentTypes", `기타/모름: ${otherText.trim()}`);
      }
      onNext();
    }
  };

  // 사고 유형 옵션들 (SVG 아이콘 포함)
  const options = [
    {
      id: "traffic",
      text: "교통사고",
      icon: "🚗",
    },
    {
      id: "fall",
      text: "추락/낙상",
      icon: "📉",
    },
    {
      id: "electric",
      text: "감전",
      icon: "⚡",
    },
    {
      id: "burn",
      text: "화상",
      icon: "🔥",
    },
    {
      id: "other",
      text: "기타/모름",
      icon: "❓",
    },
  ];

  return (
    <div className="app-container step2">
      {/* 헤더 - 뒤로가기 버튼과 제목 */}
      <div className="header">
        <button
          className="back-btn"
          type="button"
          aria-label="뒤로가기"
          onClick={onBack}
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
          onClick={() => (window.location.href = "/")}
          aria-label="홈으로"
        >
          ← 홈으로
        </button>
      </div>

      {/* 진행 상황 표시 - 현재 단계/전체 단계 */}
      <div className="progress">
        <div className="progress-text">2/5</div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="content">
        {/* 제목 섹션 - 사고 유형 입력 안내 */}
        <div className="title-container">
          <h2 className="main-title">구체적인 사고 유형을</h2>
          <p className="sub-title">입력해주세요</p>
        </div>

        {/* 사고 유형 선택 옵션들 */}
        <div className="options-container">
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`option-button ${
                selected === option.text ? "selected" : ""
              }`}
              onClick={() => toggle(option.text)}
            >
              <span className="option-icon">{option.icon}</span>
              <div className="option-text-lg">{option.text}</div>
            </button>
          ))}
        </div>

        {/* "기타/모름" 선택 시 추가 입력 필드 */}
        {showOtherInput && (
          <div className="other-input-container">
            <input
              type="text"
              className="other-input"
              placeholder="구체적인 사고 유형을 입력해주세요"
              value={otherText}
              onChange={(e) => setOtherText(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* 다음 버튼 - 선택이 완료되어야 활성화 */}
      <button
        type="button"
        className="next-button"
        onClick={goNext}
        disabled={!selected || (selected === "기타/모름" && !otherText.trim())}
      >
        다음
      </button>

      {/* 홈 인디케이터 - 하단 검은 선 */}
      <div className="home-indicator" />
    </div>
  );
}
