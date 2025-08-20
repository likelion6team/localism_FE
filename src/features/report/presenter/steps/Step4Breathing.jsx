// src/features/report/presenter/steps/Step4Breathing.jsx
// Step4: 호흡 상태 선택 페이지 - 환자의 호흡 상태를 선택하는 화면
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Step4Breathing.css";

export default function Step4Breathing({ onNext, onBack }) {
  const navigate = useNavigate();

  // 선택된 호흡 상태 옵션을 저장하는 상태
  const [selected, setSelected] = useState(null);

  // 페이지 로드 시 이전에 선택한 옵션이 있다면 복원
  useEffect(() => {
    // const saved = localStorage.getItem("breathing");
    // if (saved) {
    //   setSelected(saved);
    // }
  }, []);

  // 호흡 상태 옵션을 선택하거나 선택 해제하는 함수 (토글 기능)
  const selectOption = (option) => {
    if (selected === option) {
      // 이미 선택된 옵션을 다시 클릭하면 선택 해제
      setSelected(null);
      localStorage.removeItem("breathing");
    } else {
      // 새로운 옵션 선택
      setSelected(option);
      localStorage.setItem("breathing", option);
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

  // 호흡 상태 옵션들 (피그마와 동일하게 3개로 수정)
  const options = [
    "정상 (규칙적)",
    "어려움 (가쁘거나 불규칙)",
    "없음 (호흡하지 않음)",
  ];

  return (
    <div className="step4-app-container">
      {/* 헤더 - 뒤로가기 버튼과 제목 */}
      <div className="step4-header">
        <button
          className="step4-back-btn"
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
        <h1>사고 리포트 작성</h1>
      </div>

      {/* 홈으로 버튼 */}
      <div className="step4-home-link-container">
        <button
          className="step4-home-btn"
          type="button"
          onClick={goHome}
          aria-label="홈으로"
        >
          ← 홈으로
        </button>
      </div>

      {/* 진행 상황 표시 - 현재 단계/전체 단계 */}
      <div className="step4-progress">
        <div className="step4-progress-text">4/5</div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="step4-content">
        {/* 제목 섹션 - 호흡 상태 입력 안내 */}
        <div className="step4-title-container">
          <div className="step4-main-title-container">
            <h2 className="step4-main-title">호흡상태를</h2>
            <p className="step4-sub-title">입력해주세요.</p>
          </div>
        </div>

        {/* 호흡 상태 선택 옵션들 */}
        <div className="step4-options-container">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              className={`step4-option-button ${
                selected === option ? "selected" : ""
              }`}
              onClick={() => selectOption(option)}
            >
              <div className="step4-option-text-lg">{option}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 다음 버튼 - 선택이 완료되어야 활성화 */}
      <button
        type="button"
        className="step4-next-button"
        onClick={goNext}
        disabled={!selected}
      >
        다음
      </button>
    </div>
  );
}
