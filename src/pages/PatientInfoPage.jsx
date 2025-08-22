import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDetailReport } from "../features/report/model/rescueReportDetailApi"; // 경로는 맞게 조정
import "./PatientInfoPage.css";
import PhotoPlaceholder from "../components/PhotoPlaceholder";

export default function PatientInfoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);

  const goBack = () => navigate("/report-list");
  const handleComplete = () => navigate("/emergency-responder");

  useEffect(() => {
    if (id) {
      getDetailReport(id).then((data) => {
        setReport(data); // result.data만 리턴하도록 해뒀으니 바로 환자 객체 들어옴
      });

      console.log("신고 리포트 상세 조회:", report);
    }
  }, [id]);

  if (!report) return <div>로딩 중...</div>;

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
          <img src="/icons/arrow-left.png" alt="뒤로가기" className="back-icon" />
        </button>
        <h1 className="page-title">환자 정보</h1>
        <div className="header-spacer"></div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="main-content">
        <h2 className="main-title">
          <span className="title-blue">환자 정보</span>
          <span className="title-black">를</span>
          <br />
          <span className="title-black">확인해주세요</span>
        </h2>

        {/* 의식 */}
        <div className="section-container">
          <label className="section-label">의식</label>
          <section className="info-section">
            <div className="single-button-container">
              <div className="info-button">{report.data.consciousnessStatus}</div>
            </div>
          </section>
        </div>

        {/* 사고 유형 */}
        <div className="section-container">
          <label className="section-label">사고 유형</label>
          <section className="info-section">
            <div className="button-group">
              {report.data.accidentType?.map((type, idx) => (
                <div key={idx} className="info-button">
                  {/* 아이콘 매핑 */}
                  {type.includes("교통") && (
                    <img src="/icons/car.svg" alt="교통사고" className="button-icon" />
                  )}
                  {type.includes("자상") && (
                    <img src="/icons/knife.svg" alt="자상" className="button-icon" />
                  )}
                  {type}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* 환자 증상 */}
        <div className="section-container">
          <label className="section-label">환자 증상</label>
          <section className="info-section">
            <div className="button-group">
              {report.data.majorSymptoms?.map((symptom, idx) => (
                <div key={idx} className="info-button">
                  {symptom.includes("출혈") && (
                    <img src="/icons/blood.svg" alt="출혈" className="button-icon" />
                  )}
                  {symptom.includes("골절") && (
                    <img src="/icons/bone.svg" alt="골절" className="button-icon" />
                  )}
                  {symptom}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* 호흡 */}
        <div className="section-container">
          <label className="section-label">호흡</label>
          <section className="info-section">
            <div className="single-button-container">
              <div className="info-button">{report.data.breathingStatus}</div>
            </div>
          </section>
        </div>

        {/* 현장사진 */}
        <section className="info-section">
          <label className="section-label">현장 사진</label>
          <PhotoPlaceholder />
        </section>
      </main>

      {/* 확인 완료 버튼 */}
      <footer className="page-footer">
        <button className="complete-button" onClick={handleComplete}>
          확인 완료
        </button>
      </footer>

      <div className="home-indicator" />
    </div>
  );
}
