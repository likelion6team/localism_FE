import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EmergencyResponderPage.css";

export default function EmergencyResponderPage() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  const goBack = () => navigate("/patient-info");
  const handleSend = () => setShowPopup(true);
  const handleNewCase = () => navigate("/report-list");

  return (
    <div className="emergency-responder-page">
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
        <h1 className="page-title">구급대원 인터페이스</h1>
        <div className="header-spacer"></div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="main-content">
        {/* 환자 정보 확인 섹션 */}
        <section className="info-card">
          <h2 className="card-title">환자 정보 확인</h2>
          <div className="voice-input-section">
            <h3 className="voice-title">((o)) 음성 입력</h3>
            <div className="voice-text">
              위쪽 복부 통증이 심하고 왼쪽 복부에 10cm 자상이 심합니다. 과다출혈
              예상됩니다. GCS 13, SBP 90, RR 30
            </div>
            <div className="media-controls">
              <button className="control-btn stop">⏹</button>
              <button className="control-btn play active">▶</button>
              <button className="control-btn pause">⏸</button>
            </div>
          </div>
        </section>

        {/* 활력징후 섹션 */}
        <section className="info-card">
          <h2 className="card-title">활력징후 (BLE 자동수집)</h2>
          <div className="vital-signs">
            <div className="vital-item">
              <span className="vital-label">혈압</span>
              <span className="vital-value">90/60 mmHg</span>
            </div>
            <div className="vital-item">
              <span className="vital-label">맥박</span>
              <span className="vital-value">124 bpm</span>
            </div>
            <div className="vital-item">
              <span className="vital-label">호흡수</span>
              <span className="vital-value">30/min</span>
            </div>
            <div className="vital-item">
              <span className="vital-label">산소포화도</span>
              <span className="vital-value">88%</span>
            </div>
          </div>
        </section>

        {/* 위치, 시간, 상태 정보 */}
        <section className="info-card">
          <div className="info-row">
            <span className="info-icon">📍</span>
            <span className="info-text">
              서울특별시 성북구 종암로 25길 10 (종암동)
            </span>
          </div>
          <div className="info-row">
            <span className="info-icon">🕐</span>
            <span className="info-text">오후 2:15:35</span>
          </div>
          <div className="info-row">
            <span className="info-icon">💓</span>
            <span className="info-text">심정지</span>
          </div>
        </section>
      </main>

      {/* 전송 버튼 */}
      <footer className="page-footer">
        <button className="send-button" onClick={handleSend}>
          전송
        </button>
      </footer>

      {/* 홈 인디케이터 */}
      <div className="home-indicator" />

      {/* 팝업 모달 */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-dialog">
            <div className="popup-header">
              <span className="check-icon">✅</span>
            </div>
            <div className="popup-content">
              <h3 className="popup-title">병원 수신 완료</h3>
              <div className="popup-info">
                <p>
                  <strong>케이스ID:</strong> SX-2025-08-11-2073
                </p>
                <p>
                  <strong>ETA:</strong> 7분
                </p>
                <p>
                  <strong>병원:</strong> 고려대안암병원
                </p>
              </div>
            </div>
            <div className="popup-footer">
              <button className="new-case-button" onClick={handleNewCase}>
                새로운 케이스
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
