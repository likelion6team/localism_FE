import { useNavigate } from "react-router-dom";
import "./PatientInfoPage.css";
import PhotoPlaceholder from "../components/PhotoPlaceholder";

export default function PatientInfoPage() {
  const navigate = useNavigate();

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
          <img
            src="/src/assets/arrow-left.png"
            alt="뒤로가기"
            className="back-icon"
          />
        </button>
        <h1 className="page-title">환자 정보</h1>
        <div className="header-spacer"></div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="main-content">
        <h2 className="main-title">
          <span className="title-blue">환자 정보</span>
          <br />
          <span className="title-black">를 확인해주세요</span>
        </h2>

        {/* 의식 섹션 */}
        <div className="section-container">
          <label className="section-label">의식</label>
          <section className="info-section">
            <div className="single-button-container">
              <div className="info-button">흐림 (반응이 느림)</div>
            </div>
          </section>
        </div>

        {/* 사고 유형 섹션 */}
        <div className="section-container">
          <label className="section-label">사고 유형</label>
          <section className="info-section">
            <div className="button-group">
              <div className="info-button">
                <img
                  src="/src/assets/car.svg"
                  alt="교통사고"
                  className="button-icon"
                />
                교통사고
              </div>
              <div className="info-button">
                <img
                  src="/src/assets/knife.svg"
                  alt="자상"
                  className="button-icon"
                />
                자상
              </div>
            </div>
          </section>
        </div>

        {/* 환자 증상 섹션 */}
        <div className="section-container">
          <label className="section-label">환자 증상</label>
          <section className="info-section">
            <div className="button-group">
              <div className="info-button">
                <img
                  src="/src/assets/blood.svg"
                  alt="출혈"
                  className="button-icon"
                />
                출혈
              </div>
              <div className="info-button">
                <img
                  src="/src/assets/bone.svg"
                  alt="골절"
                  className="button-icon"
                />
                골절
              </div>
            </div>
          </section>
        </div>

        {/* 호흡 섹션 */}
        <div className="section-container">
          <label className="section-label">호흡</label>
          <section className="info-section">
            <div className="single-button-container">
              <div className="info-button">어려움 (가쁘거나 불규칙)</div>
            </div>
          </section>
        </div>

        {/* 현장사진 섹션 */}
        <section className="info-section">
          <label className="section-label"></label>
          <PhotoPlaceholder />
        </section>
      </main>

      {/* 확인 완료 버튼 */}
      <footer className="page-footer">
        <button className="complete-button" onClick={handleComplete}>
          확인 완료
        </button>
      </footer>

      {/* 홈 인디케이터 */}
      <div className="home-indicator" />
    </div>
  );
}
