// src/features/report/presenter/steps/Step1Consciousness.jsx
// Step1: 의식 상태 선택 페이지 - 환자의 의식 상태를 선택하는 화면
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useReport } from "../../model/ReportContext";
import "./Step1Consciousness.css";

export default function Step1Consciousness({ onNext }) {
  const navigate = useNavigate();
  const { setConsciousness } = useReport();

  // 선택된 의식 상태 옵션을 저장하는 상태
  const [selected, setSelected] = useState(null);

  // 의식 상태 옵션을 선택하거나 선택 해제하는 함수 (토글 기능)
  const selectOption = (option) => {
    if (selected === option) {
      // 이미 선택된 옵션을 다시 클릭하면 선택 해제
      setSelected(null);
      setConsciousness(null);
      localStorage.removeItem("consciousness");
    } else {
      // 새로운 옵션 선택
      setSelected(option);
      setConsciousness(option);
      localStorage.setItem("consciousness", option);
    }
  };

  // 다음 단계로 이동하는 함수
  const goNext = () => {
    if (selected) {
      onNext();
    }
  };

  // 홈으로 이동하는 함수
  const goHome = () => {
    navigate("/");
  };

  // 뒤로가기 함수 추가
  const goBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  // 의식 상태 옵션들 (디자인 이미지와 동일하게)
  const options = [
    "정상 (말을 하고 반응함)",
    "흐림 (반응이 느림)",
    "잃음 (반응하지 않음)",
  ];

  return (
    <div className="step1-app-container">
      {/* 헤더 - 뒤로가기 버튼과 제목 */}
      <div className="step1-header">
        <button
          className="step1-back-btn"
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
        <h1>사고 리포트 작성</h1>
      </div>

      {/* 홈으로 버튼 */}
      <div className="step1-home-link-container">
        <button
          className="step1-home-btn"
          type="button"
          onClick={goHome}
          aria-label="홈으로"
        >
          ← 홈으로
        </button>
      </div>

      {/* 진행 상황 표시 - 현재 단계/전체 단계 */}
      <div className="step1-progress">
        <div className="step1-progress-text">1/5</div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="step1-content">
        {/* 제목 섹션 - 의식 상태 입력 안내 */}
        <div className="step1-title-container">
          <div className="step1-main-title-container">
            <h2 className="step1-main-title">의식 상태를</h2>
            <p className="step1-sub-title">입력해주세요.</p>
          </div>
        </div>

        {/* 의식 상태 선택 옵션들 */}
        <div className="step1-options-container">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              className={`step1-option-button ${
                selected === option ? "selected" : ""
              }`}
              onClick={() => selectOption(option)}
            >
              <div className="step1-option-text-lg">{option}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 다음 버튼 - 선택이 완료되어야 활성화 */}
      <button
        type="button"
        className="step1-next-button"
        onClick={goNext}
        disabled={!selected}
      >
        다음
      </button>
    </div>
  );
}
