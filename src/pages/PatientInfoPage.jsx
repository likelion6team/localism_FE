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
  const handleComplete = () => {
    navigate("/emergency-responder", { state: report.data });
  };

  useEffect(() => {
    if (id) {
      getDetailReport(id).then((data) => {
        setReport(data); // result.data만 리턴하도록 해뒀으니 바로 환자 객체 들어옴
      });
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
          <img
            src="/icons/arrow-left.png"
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
          <span className="title-black">를</span>
          <br />
          <span className="title-black">확인해주세요</span>
        </h2>

        {/* 의식 */}
        <div className="section-container">
          <label className="section-label">의식</label>
          <section className="info-section">
            <div className="single-button-container">
              <div className="info-button">
                {report.data.consciousnessStatus}
              </div>
            </div>
          </section>
        </div>

        {/* 사고 유형 */}
        <div className="section-container">
          <label className="section-label">사고 유형</label>
          <section className="info-section">
            <div className="button-group">
              {report.data.accidentType?.map((type, idx) => {
                const isOther = /기타|모름/.test(type);
                let icon = "";
                if (!isOther) {
                  if (/교통/.test(type)) icon = "/icons/traffic.svg";
                  else if (/감전/.test(type)) icon = "/icons/electric.svg";
                  else if (/추락|낙상/.test(type)) icon = "/icons/fall.svg";
                  else if (/자상|출혈/.test(type)) icon = "/icons/bleeding.svg";
                  else if (/화재|화상/.test(type)) icon = "/icons/burn.svg";
                  else icon = "/icons/other.svg";
                }
                let displayText = isOther
                  ? type
                      .replace(/\s*기타\s*\/?\s*모름\s*:??\s*/gi, "")
                      .trim() || type
                  : type;
                displayText = displayText.replace(/^\s*[:\-–—·•]\s*/u, "");
                return (
                  <div
                    key={idx}
                    className={`info-button ${isOther ? "text-only" : ""}`}
                  >
                    {!isOther && icon && (
                      <img src={icon} alt="아이콘" className="button-icon" />
                    )}
                    {displayText}
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* 환자 증상 */}
        <div className="section-container">
          <label className="section-label">환자 증상</label>
          <section className="info-section">
            <div className="button-group">
              {report.data.majorSymptoms?.map((symptom, idx) => {
                const isOther = /기타/.test(symptom);
                let icon = "";
                if (!isOther) {
                  if (/호흡/.test(symptom))
                    icon = "/icons/breathing-difficulty.svg";
                  else if (/약물/.test(symptom))
                    icon = "/icons/drug-reaction.svg";
                  else if (/출혈/.test(symptom)) icon = "/icons/bleeding.svg";
                  else if (/의식없|의식 없음|의식없음/.test(symptom))
                    icon = "/icons/unconscious.svg";
                  else if (/구토/.test(symptom)) icon = "/icons/vomiting.svg";
                  else if (/경련/.test(symptom)) icon = "/icons/convulsion.svg";
                  else if (/저체온/.test(symptom))
                    icon = "/icons/hypothermia.svg";
                  else if (/골절/.test(symptom)) icon = "/icons/fracture.svg";
                  else if (/화상/.test(symptom)) icon = "/icons/burn.svg";
                  else icon = "/icons/other.svg";
                }
                let displayText = isOther
                  ? symptom
                      .replace(/\s*기타\s*\/?\s*모름\s*:??\s*/gi, "")
                      .trim() || symptom
                  : symptom;
                displayText = displayText.replace(/^\s*[:\-–—·•]\s*/u, "");
                return (
                  <div
                    key={idx}
                    className={`info-button ${isOther ? "text-only" : ""}`}
                  >
                    {!isOther && icon && (
                      <img src={icon} alt="아이콘" className="button-icon" />
                    )}
                    {displayText}
                  </div>
                );
              })}
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
        {report?.data?.isPhotoPath ? (
        <section className="info-section">
          <label className="section-label"></label>
          <PhotoPlaceholder
            reportId={report?.data?.reportId || report?.data?.id}
          />
        </section>
        ) : null
        }
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
