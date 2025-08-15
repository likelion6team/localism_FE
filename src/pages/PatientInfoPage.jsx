import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PatientInfoPage.css";

export default function PatientInfoPage() {
  const navigate = useNavigate();
  const [selectedAccidentType, setSelectedAccidentType] = useState("traffic");
  const [selectedSymptom, setSelectedSymptom] = useState("bleeding");

  const goBack = () => navigate("/report-list");
  const handleComplete = () => {
    navigate("/emergency-responder");
  };

  return (
    <div className="patient-info-page">
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
        <h1 className="page-title">환자 정보</h1>
        <div className="header-spacer"></div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="main-content">
        <h2 className="main-title">환자 정보를 확인해주세요.</h2>

        {/* 의식 섹션 */}
        <section className="info-section">
          <label className="section-label">의식</label>
          <div className="single-button-container">
            <button className="info-button yellow-border">
              흐림 (반응이 느림)
            </button>
          </div>
        </section>

        {/* 사고 유형 섹션 */}
        <section className="info-section">
          <label className="section-label">사고 유형</label>
          <div className="button-group">
            <button
              className={`info-button ${
                selectedAccidentType === "traffic" ? "selected" : ""
              }`}
              onClick={() => setSelectedAccidentType("traffic")}
            >
              <span className="button-icon">🚗</span>
              교통사고
            </button>
            <button
              className={`info-button ${
                selectedAccidentType === "stab" ? "selected" : ""
              }`}
              onClick={() => setSelectedAccidentType("stab")}
            >
              <span className="button-icon">🔪</span>
              자상
            </button>
          </div>
        </section>

        {/* 환자 증상 섹션 */}
        <section className="info-section">
          <label className="section-label">환자 증상</label>
          <div className="button-group">
            <button
              className={`info-button ${
                selectedSymptom === "bleeding" ? "selected" : ""
              }`}
              onClick={() => setSelectedSymptom("bleeding")}
            >
              <span className="button-icon">🩸</span>
              출혈
            </button>
            <button
              className={`info-button ${
                selectedSymptom === "fracture" ? "selected" : ""
              }`}
              onClick={() => setSelectedSymptom("fracture")}
            >
              <span className="button-icon">🦴</span>
              골절
            </button>
          </div>
        </section>

        {/* 호흡 섹션 */}
        <section className="info-section">
          <label className="section-label">호흡</label>
          <div className="single-button-container">
            <button className="info-button yellow-border">
              어려움 (가쁘거나 불규칙)
            </button>
          </div>
        </section>

        {/* 현장사진 섹션 */}
        <section className="info-section">
          <label className="section-label">현장사진</label>
          <div className="photo-placeholder">
            <span className="photo-text">현장사진</span>
          </div>
        </section>
      </main>

      {/* 접수 완료 버튼 */}
      <footer className="page-footer">
        <button className="complete-button" onClick={handleComplete}>
          접수 완료
        </button>
      </footer>

      {/* 홈 인디케이터 */}
      <div className="home-indicator" />
    </div>
  );
}
