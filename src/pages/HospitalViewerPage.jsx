import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HospitalViewerPage.css";

export default function HospitalViewerPage() {
  const navigate = useNavigate();

  const goBack = () => navigate("/");
  const handleCaseClick = () => navigate("/patient-detail");

  // 샘플 응급 상황 데이터
  const emergencyCases = [
    {
      id: "SX-2025-08-11-0012",
      symptoms: "주증상 : 호흡 어려움, 과다출혈",
      consciousness: "의식 : 흐림",
      eta: "2분",
      etaColor: "red",
    },
    {
      id: "SX-2025-08-11-0012",
      symptoms: "주증상 : 호흡 어려움, 과다출혈",
      consciousness: "의식 : 흐림",
      eta: "8분",
      etaColor: "yellow",
    },
    {
      id: "SX-2025-08-11-0012",
      symptoms: "주증상 : 호흡 어려움, 과다출혈",
      consciousness: "의식 : 흐림",
      eta: "14분",
      etaColor: "blue",
    },
    {
      id: "SX-2025-08-11-0012",
      symptoms: "주증상 : 호흡 어려움, 과다출혈",
      consciousness: "의식 : 흐림",
      eta: "17분",
      etaColor: "blue",
    },
  ];

  return (
    <div className="hospital-viewer-page">
      {/* 상태바 */}
      <div className="status-bar">
        <span className="status-time">9:41</span>
        <div className="status-icons">
          <span className="signal-icon">📶</span>
          <span className="wifi-icon">📶</span>
          <span className="battery-icon">🔋</span>
        </div>
      </div>

      {/* 헤더 */}
      <header className="page-header">
        <button className="back-button" onClick={goBack}>
          ←
        </button>
        <h1 className="page-title">병원 응급실 뷰어</h1>
        <div className="header-spacer"></div>
      </header>

      {/* 정렬 옵션 */}
      <div className="sort-option">
        <span className="sort-icon">📋</span>
        <span className="sort-label">Incoming Strip (ETA 순 정렬)</span>
      </div>

      {/* 응급 상황 목록 */}
      <main className="emergency-list">
        {emergencyCases.map((case_, index) => (
          <div key={index} className="emergency-card" onClick={handleCaseClick}>
            <div className="case-info">
              <div className="case-id">{case_.id}</div>
              <div className="case-symptoms">{case_.symptoms}</div>
              <div className="case-consciousness">{case_.consciousness}</div>
            </div>
            <div className={`eta-section ${case_.etaColor}`}>
              <span className="eta-text">ETA {case_.eta}</span>
            </div>
          </div>
        ))}
      </main>

      {/* 홈 인디케이터 */}
      <div className="home-indicator" />
    </div>
  );
}
