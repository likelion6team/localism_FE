// src/features/report/presenter/steps/Step3Symptoms.jsx
// Step3: 현재 증상 선택 페이지 - 환자가 겪고 있는 증상을 선택하는 화면
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useReport } from "../../model/ReportContext";
import "./Step3Symptoms.css";

export default function Step3Symptoms({ onNext, onBack }) {
  const navigate = useNavigate();
  const { setSymptoms } = useReport();

  // 선택된 증상들을 저장하는 상태 (배열로 여러 개 선택 가능)
  const [selected, setSelected] = useState([]);
  // "기타/모름" 선택 시 추가 입력 필드를 보여줄지 결정하는 상태
  const [showOtherInput, setShowOtherInput] = useState(false);
  // "기타/모름" 입력 텍스트를 저장하는 상태
  const [otherText, setOtherText] = useState("");

  // 페이지 로드 시 localStorage 초기화 및 상태 초기화
  useEffect(() => {
    // localStorage에서 이전 데이터 완전 제거
    localStorage.removeItem("symptoms");
    console.log("Step3 - localStorage cleared");

    // 상태 초기화
    setSelected([]);
    setShowOtherInput(false);
    setOtherText("");
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
      // ReportContext에 즉시 저장하지 않음 (React 에러 방지)
      return newSelected;
    });
  };

  // 다음 단계로 이동하는 함수
  const goNext = () => {
    // 선택된 증상이 없으면 진행 불가
    if (selected.length === 0) {
      return;
    }

    let dataToSave = selected;
    // "기타/모름"이 선택된 경우 추가 텍스트도 함께 저장 (텍스트가 없어도 저장 가능)
    if (selected.includes("기타/모름")) {
      if (otherText.trim()) {
        dataToSave = selected.map((s) =>
          s === "기타/모름" ? `기타/모름: ${otherText.trim()}` : s
        );
      }
      // 텍스트가 없어도 "기타/모름" 선택은 유효
    }

    // ReportContext에 최종 선택된 값 저장
    setSymptoms(dataToSave);
    localStorage.setItem("symptoms", JSON.stringify(dataToSave));
    onNext();
  };

  // 홈으로 이동하는 함수
  const goHome = () => {
    navigate("/");
  };

  // 증상 옵션들 (10가지 주요 증상 + SVG 아이콘)
  const options = [
    {
      id: "breathing-difficulty",
      text: "호흡곤란",
      icon: "/icons/breathing-difficulty.svg",
    },
    {
      id: "drug-reaction",
      text: "약물반응",
      icon: "/icons/drug-reaction.svg",
    },
    {
      id: "bleeding",
      text: "출혈",
      icon: "/icons/bleeding.svg",
    },
    {
      id: "unconscious",
      text: "의식없음",
      icon: "/icons/unconscious.svg",
    },
    {
      id: "vomiting",
      text: "구토",
      icon: "/icons/vomiting.svg",
    },
    {
      id: "convulsion",
      text: "경련",
      icon: "/icons/convulsion.svg",
    },
    {
      id: "hypothermia",
      text: "저체온증",
      icon: "/icons/hypothermia.svg",
    },
    {
      id: "fracture",
      text: "골절",
      icon: "/icons/fracture.svg",
    },
    {
      id: "burn",
      text: "화상",
      icon: "/icons/burn.svg",
    },
    {
      id: "other",
      text: "기타/모름",
      icon: "/icons/other.svg",
    },
  ];

  return (
    <div className="step3-app-container">
      {/* 헤더 - 뒤로가기 버튼과 제목 */}
      <div className="step3-header">
        <button
          className="step3-back-btn"
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
      <div className="step3-home-link-container">
        <button
          className="step3-home-btn"
          type="button"
          onClick={goHome}
          aria-label="홈으로"
        >
          ← 홈으로
        </button>
      </div>

      {/* 진행 상황 표시 - 현재 단계/전체 단계 */}
      <div className="step3-progress">
        <div className="step3-progress-text">3/5</div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="step3-content">
        {/* 제목 섹션 - 현재 증상 입력 안내 */}
        <div className="step3-title-container">
          <div className="step3-main-title-container">
            <h2 className="step3-main-title">현재 증상을</h2>
            <p className="step3-sub-title">입력해주세요.</p>
          </div>
          <p className="step3-description">
            환자는 어떤 상태인가요? (중복가능)
          </p>
        </div>

        {/* 증상 선택 옵션들 */}
        <div className="step3-options-container">
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`step3-option-button ${
                selected.includes(option.text) ? "selected" : ""
              }`}
              onClick={() => toggle(option.text)}
            >
              <img
                src={option.icon}
                alt={option.text}
                className="step3-option-icon"
              />
              <div className="step3-option-text-lg">{option.text}</div>
            </button>
          ))}
        </div>

        {/* "기타/모름" 선택 시 추가 입력 필드 */}
        {showOtherInput && (
          <div className="step3-other-input-container">
            <input
              type="text"
              className="step3-other-input"
              placeholder="구체적인 증상을 입력해주세요."
              value={otherText}
              onChange={(e) => setOtherText(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* 다음 버튼 - 최소 1개 이상 선택되어야 활성화 */}
      <button
        type="button"
        className="step3-next-button"
        onClick={goNext}
        disabled={!selected || selected.length === 0}
      >
        다음
      </button>
    </div>
  );
}
