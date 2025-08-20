// src/features/report/presenter/steps/Step2AccidentType.jsx
// Step2: 사고 유형 선택 페이지 - 어떤 종류의 사고인지 선택하는 화면
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Step2AccidentType.css";

export default function Step2AccidentType({ onNext, onBack }) {
  const navigate = useNavigate();

  // 선택된 사고 유형들을 저장하는 상태 (배열로 변경)
  const [selected, setSelected] = useState([]);
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
    if (selected.includes(option)) {
      // 이미 선택된 옵션을 다시 클릭하면 선택 해제
      setSelected(selected.filter((item) => item !== option));
      if (option === "기타 / 모름") {
        setShowOtherInput(false);
        setOtherText("");
      }
      localStorage.removeItem("accidentTypes");
    } else {
      // 새로운 옵션 선택 (기존 선택에 추가)
      const newSelected = [...selected, option];
      setSelected(newSelected);
      if (option === "기타 / 모름") {
        setShowOtherInput(true);
      }
      localStorage.setItem("accidentTypes", newSelected.join(", "));
    }
  };

  // 다음 단계로 이동하는 함수
  const goNext = () => {
    if (selected.length > 0) {
      if (selected.includes("기타 / 모름") && otherText.trim()) {
        // "기타/모름" 선택 시 추가 텍스트가 있으면 함께 저장
        const otherIndex = selected.indexOf("기타 / 모름");
        const newSelected = [...selected];
        newSelected[otherIndex] = `기타 / 모름: ${otherText.trim()}`;
        localStorage.setItem("accidentTypes", newSelected.join(", "));
      } else if (selected.includes("기타 / 모름")) {
        // "기타/모름" 선택 시 텍스트가 없어도 그냥 저장
        localStorage.setItem("accidentTypes", selected.join(", "));
      } else {
        // 다른 옵션들만 선택된 경우
        localStorage.setItem("accidentTypes", selected.join(", "));
      }
      onNext();
    }
  };

  // 홈으로 이동하는 함수
  const goHome = () => {
    navigate("/");
  };

  // 사고 유형 옵션들 (SVG 아이콘 포함)
  const options = [
    {
      id: "traffic",
      text: "교통사고",
      icon: "/src/assets/icons/traffic.svg",
    },
    {
      id: "electric",
      text: "감전",
      icon: "/src/assets/icons/electric.svg",
    },
    {
      id: "fall",
      text: "추락/낙상",
      icon: "/src/assets/icons/fall.svg",
    },
    {
      id: "bleeding",
      text: "자상/출혈",
      icon: "/src/assets/icons/bleeding.svg",
    },
    {
      id: "burn",
      text: "화상",
      icon: "/src/assets/icons/burn.svg",
    },
    {
      id: "other",
      text: "기타 / 모름",
      icon: "/src/assets/icons/other.svg",
    },
  ];

  return (
    <div className="step2-app-container">
      {/* 헤더 - 뒤로가기 버튼과 제목 */}
      <div className="step2-header">
        <button
          className="step2-back-btn"
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
      <div className="step2-home-link-container">
        <button
          className="step2-home-btn"
          type="button"
          onClick={goHome}
          aria-label="홈으로"
        >
          ← 홈으로
        </button>
      </div>

      {/* 진행 상황 표시 - 현재 단계/전체 단계 */}
      <div className="step2-progress">
        <div className="step2-progress-text">2/5</div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="step2-content">
        {/* 제목 섹션 - 사고 유형 입력 안내 */}
        <div className="step2-title-container">
          <div className="step2-main-title-container">
            <h2 className="step2-main-title">사고 유형을</h2>
            <p className="step2-sub-title">선택해주세요.</p>
          </div>
          <p className="step2-description">어떤 사고 상황인가요? (중복가능)</p>
        </div>

        {/* 사고 유형 선택 옵션들 */}
        <div className="step2-options-container">
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`step2-option-button ${
                selected.includes(option.text) ? "selected" : ""
              }`}
              onClick={() => toggle(option.text)}
            >
              <img
                src={option.icon}
                alt={option.text}
                className="step2-option-icon"
              />
              <div className="step2-option-text-lg">{option.text}</div>
            </button>
          ))}
        </div>

        {/* "기타/모름" 선택 시 추가 입력 필드 */}
        {showOtherInput && (
          <div className="step2-other-input-container">
            <input
              type="text"
              className="step2-other-input"
              placeholder="구체적인 사고 유형을 입력해주세요."
              value={otherText}
              onChange={(e) => setOtherText(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* 다음 버튼 - 선택이 완료되어야 활성화 */}
      <button
        type="button"
        className="step2-next-button"
        onClick={goNext}
        disabled={selected.length === 0}
      >
        다음
      </button>
    </div>
  );
}
