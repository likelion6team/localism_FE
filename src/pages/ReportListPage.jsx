import { useNavigate } from "react-router-dom";
import "./ReportListPage.css";

export default function ReportListPage() {
  const navigate = useNavigate();

  const goBack = () => navigate("/");

  // 샘플 신고 데이터 (이미지와 일치)
  const reports = [
    {
      id: 1,
      date: "2025.08.14",
      time: "22:15:03",
      type: "쓰러짐_호흡약함",
      address: "서울특별시 성북구 종암로 25길 10 (종암동)",
    },
    {
      id: 2,
      date: "2025.08.14",
      time: "19:20:21",
      type: "화재_의식 없음",
      address: "서울특별시 성북구 종암로 25길 10 (종암동)",
    },
    {
      id: 3,
      date: "2025.08.14",
      time: "17:46:55",
      type: "추락_골절",
      address: "서울특별시 성북구 종암동 ○○아파트 단지 내",
    },
  ];

  const handleReportClick = () => {
    setTimeout(() => {
      navigate("/patient-info");
    }, 200);
  };

  return (
    <div className="report-list-page">
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
        <h1 className="page-title">신고 리스트</h1>
        <div className="header-spacer"></div>
      </header>

      {/* 신고 목록 */}
      <main className="report-list">
        {reports.map((report) => (
          <div
            key={report.id}
            className="report-item"
            onClick={handleReportClick}
          >
            <div className="report-content">
              <div className="report-header">
                <span className="report-date">{report.date}</span>
                <img src="/icons/clock.svg" alt="시계" className="time-icon" />
                <span className="report-time">{report.time}</span>
              </div>
              <div className="report-type">{report.type}</div>
              <div className="report-address">{report.address}</div>
            </div>
          </div>
        ))}
      </main>

      {/* 홈 인디케이터 */}
      <div className="home-indicator" />
    </div>
  );
}
