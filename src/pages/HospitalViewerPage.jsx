import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HospitalViewerPage.css";

export default function HospitalViewerPage() {
  const navigate = useNavigate();

  const goBack = () => navigate("/");
  const handleCaseClick = () => navigate("/patient-detail");

  // 샘플 응급 상황 데이터 (이미지와 동일한 형식)
  const emergencyCases = [
    {
      id: 1,
      date: "2025.08.14",
      mainSymptom: "호흡 어려움, 뇌출혈",
      consciousness: "흐림",
      eta: "01:01",
      priority: "high", // red
    },
    {
      id: 2,
      date: "2025.08.14",
      mainSymptom: "골절",
      consciousness: "있음",
      eta: "05:15",
      priority: "medium", // yellow
    },
    {
      id: 3,
      date: "2025.08.14",
      mainSymptom: "화상, 출혈",
      consciousness: "없음",
      eta: "08:18",
      priority: "low", // grey
    },
  ];

  return (
    <div className="hospital-viewer-page">
      {/* 헤더 */}
      <header className="page-header">
        <button className="back-button" onClick={goBack}>
          <img
            src="/src/assets/arrow-left.png"
            alt="뒤로가기"
            className="back-icon"
          />
        </button>
        <h1 className="page-title">응급 환자 현황</h1>
        <div className="header-spacer"></div>
      </header>

      {/* 섹션 제목 */}
      <div className="section-title">
        <img
          src="/src/assets/Rectangle 34625276.png"
          alt="section icon"
          className="section-icon"
        />
        <span className="hospital-section-label">Incoming Strip</span>
        <span className="section-subtitle">(ETA 순 정렬)</span>
      </div>

      {/* 응급 상황 목록 */}
      <main className="emergency-list">
        {emergencyCases.map((case_) => (
          <div
            key={case_.id}
            className={`emergency-card ${case_.priority}`}
            onClick={handleCaseClick}
          >
            <div className="card-content">
              <div className="card-date">{case_.date}</div>
              <div className="card-details">
                <div className="detail-item">
                  <span className="detail-label">주증상</span>
                  <span className="detail-value">{case_.mainSymptom}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">의식</span>
                  <span className="detail-value">{case_.consciousness}</span>
                </div>
              </div>
            </div>
            <div className="eta-section">
              <span className="eta-label">ETA</span>
              <span className="eta-time">{case_.eta}</span>
            </div>
          </div>
        ))}
      </main>

      {/* 홈 인디케이터 */}
      <div className="home-indicator" />
    </div>
  );
}
