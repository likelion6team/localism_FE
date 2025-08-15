import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ReportListPage.css";

export default function ReportListPage() {
  const navigate = useNavigate();
  const [selectedReport, setSelectedReport] = useState(0);

  const goBack = () => navigate("/");

  // 샘플 신고 데이터
  const reports = [
    {
      id: 1,
      type: "심정지",
      address: "서울특별시 성북구 종암로 25길 10 (종암동)",
      time: "15:19",
    },
    {
      id: 2,
      type: "경련",
      address: "서울특별시 성북구 보문로 69길 6 (보문동)",
      time: "14:08",
    },
    {
      id: 3,
      type: "호흡곤란",
      address: "서울특별시 성북구 한천로 137 (석관동)",
      time: "14:01",
    },
    {
      id: 4,
      type: "의식 없음",
      address: "서울특별시 성북구 정릉로 174 (정릉동)",
      time: "09:47",
    },
    {
      id: 5,
      type: "화상",
      address: "서울특별시 성북구 삼선동1가 11-4",
      time: "09:46",
    },
  ];

  const handleReportClick = (index) => {
    setSelectedReport(index);
    // 환자 정보 페이지로 이동
    navigate("/patient-info");
  };

  return (
    <div className="report-list-page">
      {/* 상태바 */}
      <div className="status-bar">
        <span className="status-time">18:34</span>
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
        <h1 className="page-title">신고 리스트</h1>
        <div className="header-spacer"></div>
      </header>

      {/* 정렬 옵션 */}
      <div className="sort-option">
        <span className="sort-label">신고접수순</span>
      </div>

      {/* 신고 목록 */}
      <main className="report-list">
        {reports.map((report, index) => (
          <div
            key={report.id}
            className={`report-item ${
              selectedReport === index ? "selected" : ""
            }`}
            onClick={() => handleReportClick(index)}
          >
            <div className="report-content">
              <div className="report-type">{report.type}</div>
              <div className="report-address">{report.address}</div>
            </div>
            <div className="report-time">{report.time}</div>
          </div>
        ))}
      </main>

      {/* 홈 인디케이터 */}
      <div className="home-indicator" />
    </div>
  );
}
