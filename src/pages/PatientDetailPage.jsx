import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./PatientDetailPage.css";
import VitalTrendGraph from "../components/VitalTrendGraph";

export default function PatientDetailPage() {
  const navigate = useNavigate();
  const [isPrinting, setIsPrinting] = useState(false);

  const goBack = () => navigate("/hospital");
  const handleComplete = () => {
    navigate("/hospital");
  };

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      setIsPrinting(false);
    }, 10000); // 10초 후 숨김
  };

  return (
    <div className="patient-detail-page">
      {/* 헤더 */}
      <header className="page-header">
        <button className="back-button" onClick={goBack}>
          <img
            src="/src/assets/arrow-left.png"
            alt="뒤로가기"
            className="back-icon"
          />
        </button>
        <h1 className="page-title">환자 상세 정보</h1>
        <div className="header-spacer"></div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="main-content">
        {/* 환자 상세 정보 카드 */}
        <section className="patient-info-section">
          <h2 className="section-title">환자 상세 정보</h2>
          <div className="patient-info-card">
            <div className="patient-info-content">
              <div className="info-item">
                <span className="info-value id-value">SX-2025-08-11-0012</span>
              </div>
              <div className="info-item">
                <span className="info-label">주증상</span>
                <span className="info-value">호흡 어려움, 뇌출혈</span>
              </div>
              <div className="info-item">
                <span className="info-label">의식</span>
                <span className="info-value">흐림</span>
              </div>
              <div className="info-item emt-label-item">
                <span className="info-label emt-label">
                  {"<"}EMT 소견{">"}
                </span>
              </div>
              <div className="info-item">
                <span className="info-value emt-findings">
                  호흡수 30회, 혈압 90에 60, 맥박 124, 산소포화도 88%, 구토
                  있음, 뇌출혈 가능성 큼
                </span>
              </div>
            </div>
            <div className="eta-bar">
              <span className="eta-label">ETA</span>
              <span className="eta-time">01:01</span>
            </div>
          </div>
        </section>

        {/* 활력징후 트렌드 섹션 */}
        <section className="vital-trend-section">
          <h2 className="section-title">활력징후 트렌드</h2>
          <VitalTrendGraph />
        </section>

        {/* 라벨 섹션 */}
        <section className="label-section">
          <div className="label-header">
            <h2 className="section-title">라벨</h2>
            <button className="print-button" onClick={handlePrint}>
              클릭하여 인쇄하기
            </button>
          </div>
          {isPrinting && (
            <div className="printing-status">
              <span className="printing-text">인쇄중입니다</span>
              <span className="printing-dots">...</span>
            </div>
          )}
          <div className="label-card">
            <div className="label-content">
              <div className="label-item">
                <span className="label-id">SX-2025-08-11-0012</span>
                <span className="label-emergency">응급환자</span>
              </div>
              <div className="label-item">
                <span className="label-time-symptoms">시간</span>
                <span className="label-datetime-content">
                  2025.8.11 PM 8:27
                </span>
              </div>
              <div className="label-item">
                <span className="label-time-symptoms">증상</span>
                <span className="label-datetime-content">뇌출혈, 호흡곤란</span>
              </div>
            </div>
            <div className="barcode-bar">
              <img
                src="/src/assets/barcode.svg"
                alt="바코드"
                className="barcode-image"
              />
            </div>
          </div>
        </section>
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
