// src/features/report/presenter/steps/Step1Consciousness.jsx
// Step1: 의식 상태 선택 페이지 - 환자의 의식 상태를 선택하는 화면
import { useState, useEffect } from "react";
import "./Step1Consciousness.css";

export default function Step1Consciousness({ onNext, onBack }) {
  // 선택된 의식 상태 옵션을 저장하는 상태
  const [selected, setSelected] = useState(null);

  // 페이지 로드 시 이전에 선택한 옵션이 있다면 복원
  useEffect(() => {
    const saved = localStorage.getItem("consciousness");
    if (saved) {
      setSelected(saved);
    }
  }, []);

  // 의식 상태 옵션을 선택하거나 선택 해제하는 함수 (토글 기능)
  const selectOption = (option) => {
    if (selected === option) {
      // 이미 선택된 옵션을 다시 클릭하면 선택 해제
      setSelected(null);
      localStorage.removeItem("consciousness");
    } else {
      // 새로운 옵션 선택
      setSelected(option);
      localStorage.setItem("consciousness", option);
    }
  };

  // 다음 단계로 이동하는 함수
  const goNext = () => {
    if (selected) {
      onNext();
    }
  };

  // 의식 상태 옵션들
  const options = ["정상", "혼미", "무의식", "기타/모름"];

  return (
    <div className="app-container step1">
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
        <div className="progress-text">1/5</div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="content">
        {/* 제목 섹션 - 의식 상태 입력 안내 */}
        <div className="title-container">
          <div className="main-title-container">
            <h2 className="main-title">의식 상태를</h2>
            <p className="sub-title">입력해주세요</p>
          </div>
        </div>

        {/* 의식 상태 선택 옵션들 */}
        <div className="options-container">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              className={`option-button ${
                selected === option ? "selected" : ""
              }`}
              onClick={() => selectOption(option)}
            >
              <div className="option-text-lg">{option}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 다음 버튼 - 선택이 완료되어야 활성화 */}
      <button
        type="button"
        className="next-button"
        onClick={goNext}
        disabled={!selected}
      >
        다음
      </button>

      {/* 홈 인디케이터 - 하단 검은 선 */}
      <div className="home-indicator" />
    </div>
  );
}
