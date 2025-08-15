import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PatientDetailPage.css";

export default function PatientDetailPage() {
  const navigate = useNavigate();
  const [selectedRecommendation, setSelectedRecommendation] =
    useState("oxygen");
  const [isPrinting, setIsPrinting] = useState(false);

  const goBack = () => navigate("/hospital-viewer");
  const handleComplete = () => navigate("/hospital-viewer");
  const handlePrint = () => {
    setIsPrinting(true);
    // 3초 후에 인쇄 상태를 false로 변경
    setTimeout(() => setIsPrinting(false), 3000);
  };

  return (
    <div className="patient-detail-page">
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
        <h1 className="page-title">환자 상세 정보</h1>
        <div className="header-spacer"></div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="main-content">
        {/* 환자 기본 정보 섹션 */}
        <section className="patient-info-card">
          <div className="info-content">
            <div className="info-row">
              <span className="info-label">환자 ID:</span>
              <span className="info-value">SX-2025-08-11-0012</span>
            </div>
            <div className="info-row">
              <span className="info-label">위치:</span>
              <span className="info-value">성북구 안암동 123-45</span>
            </div>
            <div className="info-row">
              <span className="info-label">ETA:</span>
              <span className="info-value">1분</span>
            </div>
            <div className="emt-findings">
              <h3 className="findings-title">EMT 소견</h3>
              <div className="findings-content">
                <p>GCS 13, SBP 90, RR 30</p>
                <p>10cm 자상</p>
              </div>
            </div>
          </div>
          <div className="red-indicator"></div>
        </section>

        {/* 활력징후 트렌드 그래프 섹션 */}
        <section className="vital-trends-section">
          <h2 className="section-title">활력징후 트렌드</h2>
          <div className="graph-container">
            <div className="graph-area">
              {/* 그래프 영역 - 실제 그래프는 CSS로 구현 */}
              <div className="graph-lines">
                <div className="heart-rate-line"></div>
                <div className="blood-pressure-line"></div>
              </div>
              <div className="graph-axes">
                <div className="y-axis-left">
                  <span>128</span>
                  <span>125</span>
                  <span>123</span>
                </div>
                <div className="y-axis-right">
                  <span>91.5</span>
                  <span>90.0</span>
                  <span>88.0</span>
                </div>
                <div className="x-axis">
                  <span>현재</span>
                  <span>2분전</span>
                  <span>4분전</span>
                  <span>6분전</span>
                  <span>8분전</span>
                  <span>10분전</span>
                </div>
              </div>
            </div>
            <div className="graph-legend">
              <div className="legend-item">
                <div className="legend-color heart-rate"></div>
                <span>심박수(bpm)</span>
              </div>
              <div className="legend-item">
                <div className="legend-color blood-pressure"></div>
                <span>수축기혈압(mmHg)</span>
              </div>
            </div>
          </div>
        </section>

        {/* AI 추천 섹션 */}
        <section className="ai-recommendation-section">
          <h2 className="section-title">AI 추천</h2>
          <div className="recommendation-options">
            <label className="radio-option">
              <input
                type="radio"
                name="recommendation"
                value="oxygen"
                checked={selectedRecommendation === "oxygen"}
                onChange={(e) => setSelectedRecommendation(e.target.value)}
              />
              <span className="radio-label">산소 투여 진행</span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="recommendation"
                value="cpr"
                checked={selectedRecommendation === "cpr"}
                onChange={(e) => setSelectedRecommendation(e.target.value)}
              />
              <span className="radio-label">CPR 실행</span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="recommendation"
                value="transfusion"
                checked={selectedRecommendation === "transfusion"}
                onChange={(e) => setSelectedRecommendation(e.target.value)}
              />
              <span className="radio-label">수혈 실시</span>
            </label>
          </div>
        </section>

        {/* 구분선 */}
        <div className="divider"></div>

        {/* 하단 정보 섹션 */}
        <section className="emergency-info-card">
          <div className="info-content">
            <h3 className="emergency-title">응급환자</h3>
            <div className="info-row">
              <span className="info-label">환자 ID:</span>
              <span className="info-value">SX-2025-08-11-0012</span>
            </div>
            <div className="info-row">
              <span className="info-label">시간:</span>
              <span className="info-value">2025. 8. 11. 오후 8:27:00</span>
            </div>
            <div className="info-row">
              <span className="info-label">증상:</span>
              <span className="info-value">과다출혈, 호흡곤란</span>
            </div>
          </div>
          <div className="barcode-indicator"></div>
        </section>

        {/* 인쇄 섹션 */}
        <div className="print-section">
          <button
            className="print-button"
            onClick={handlePrint}
            disabled={isPrinting}
          >
            {isPrinting ? "인쇄 중..." : "인쇄"}
          </button>
          {isPrinting && (
            <span className="print-status">라벨이 인쇄 중 입니다.</span>
          )}
        </div>
      </main>

      {/* 완료 버튼 */}
      <footer className="page-footer">
        <button className="complete-button" onClick={handleComplete}>
          완료
        </button>
      </footer>

      {/* 홈 인디케이터 */}
      <div className="home-indicator" />
    </div>
  );
}
