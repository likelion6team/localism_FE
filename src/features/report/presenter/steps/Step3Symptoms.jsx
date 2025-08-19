// src/features/report/presenter/steps/Step3Symptoms.jsx
// Step3: 현재 증상 선택 페이지 - 환자가 겪고 있는 증상을 선택하는 화면
import { useState, useEffect } from "react";
import "./Step3Symptoms.css";

export default function Step3Symptoms({ onNext, onBack }) {
  // 선택된 증상들을 저장하는 상태 (배열로 여러 개 선택 가능)
  const [selected, setSelected] = useState([]);
  // "기타/모름" 선택 시 추가 입력 필드를 보여줄지 결정하는 상태
  const [showOtherInput, setShowOtherInput] = useState(false);
  // "기타/모름" 입력 텍스트를 저장하는 상태
  const [otherText, setOtherText] = useState("");

  // 페이지 로드 시 이전에 선택한 옵션이 있다면 복원
  useEffect(() => {
    const saved = localStorage.getItem("symptoms");
    if (saved) {
      try {
        const symptoms = JSON.parse(saved);
        setSelected(symptoms);
        // "기타/모름"이 선택되어 있다면 입력 필드도 표시
        if (symptoms.includes("기타/모름")) {
          setShowOtherInput(true);
        }
      } catch (error) {
        console.error("Failed to parse saved symptoms:", error);
      }
    }
  }, []);

  // 증상 옵션을 선택하거나 선택 해제하는 함수 (토글 기능)
  const toggle = (symptom) => {
    setSelected((prev) => {
      let newSelected;
      if (prev.includes(symptom)) {
        // 이미 선택된 증상을 다시 클릭하면 선택 해제
        newSelected = prev.filter((s) => s !== symptom);
        if (symptom === "기타/모름") {
          setShowOtherInput(false);
          setOtherText("");
        }
      } else {
        // 새로운 증상 선택
        newSelected = [...prev, symptom];
        if (symptom === "기타/모름") {
          setShowOtherInput(true);
        }
      }
      return newSelected;
    });
  };

  // 다음 단계로 이동하는 함수
  const goNext = () => {
    if (selected.length > 0) {
      let dataToSave = selected;
      // "기타/모름"이 선택된 경우 추가 텍스트도 함께 저장
      if (selected.includes("기타/모름") && otherText.trim()) {
        dataToSave = selected.map((s) =>
          s === "기타/모름" ? `기타/모름: ${otherText.trim()}` : s
        );
      }
      localStorage.setItem("symptoms", JSON.stringify(dataToSave));
      onNext();
    }
  };

  // 증상 옵션들 (10가지 주요 증상)
  const options = [
    "호흡곤란",
    "약물반응",
    "통증",
    "출혈",
    "구토",
    "경련",
    "골절",
    "화상",
    "기타/모름",
  ];

  return (
    <div className="app-container step3">
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
        <div className="progress-text">3/5</div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="content">
        {/* 제목 섹션 - 현재 증상 입력 안내 */}
        <div className="title-container">
          <h2 className="main-title">현재 증상을</h2>
          <p className="sub-title">입력해주세요</p>
        </div>

        {/* 질문 텍스트 */}
        <div className="question-text">환자는 어떤 상태인가요?</div>

        {/* 증상 선택 옵션들 */}
        <div className="options-container">
          {options.map((symptom) => (
            <button
              key={symptom}
              type="button"
              className={`option-button ${
                selected.includes(symptom) ? "selected" : ""
              }`}
              onClick={() => toggle(symptom)}
            >
              <div className="option-text-lg">{symptom}</div>
            </button>
          ))}
        </div>

        {/* "기타/모름" 선택 시 추가 입력 필드 */}
        {showOtherInput && (
          <div className="other-input-container">
            <input
              type="text"
              className="other-input"
              placeholder="구체적인 증상을 입력해주세요"
              value={otherText}
              onChange={(e) => setOtherText(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* 다음 버튼 - 최소 1개 이상 선택되어야 활성화 */}
      <button
        type="button"
        className="next-button"
        onClick={goNext}
        disabled={
          selected.length === 0 ||
          (selected.includes("기타/모름") && !otherText.trim())
        }
      >
        다음
      </button>

      {/* 홈 인디케이터 - 하단 검은 선 */}
      <div className="home-indicator" />
    </div>
  );
}
