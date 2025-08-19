// src/pages/HomePage.jsx
// 앱의 메인 홈페이지 - 역할 선택 화면
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();

  // 신고자 버튼 클릭 시 리포트 작성 페이지로 이동
  const handleReporterClick = () => {
    navigate("/report");
  };

  // 구급대원 버튼 클릭 시 알림 표시 (아직 구현되지 않음)
  const handleEMTClick = () => {
    alert("구급대원 기능은 아직 구현되지 않았습니다.");
  };

  // 병원 버튼 클릭 시 알림 표시 (아직 구현되지 않음)
  const handleHospitalClick = () => {
    alert("병원 기능은 아직 구현되지 않았습니다.");
  };

  return (
    <div className="homepage-container">
      {/* ResQ 로고 섹션 */}
      <div className="logo-section">
        <img
          src="/src/assets/icons/logo.svg"
          alt="ResQ Logo"
          className="resq-logo"
        />
        <p className="slogan">
          Tech with a heartbeat.
          <br />
          That's ResQ.
        </p>
      </div>

      {/* 역할 선택 버튼들 */}
      <div className="role-buttons">
        {/* 신고자 버튼 - 리포트 작성으로 이동 */}
        <button className="role-btn" onClick={handleReporterClick}>
          <img
            src="/src/assets/icons/reporter-icon.svg"
            alt="신고자"
            className="role-icon"
          />
          <span>신고자</span>
        </button>

        {/* 구급대원 버튼 - 아직 미구현 */}
        <button className="role-btn" onClick={handleEMTClick}>
          <img
            src="/src/assets/icons/emt-icon.svg"
            alt="구급대원"
            className="role-icon"
          />
          <span>구급대원</span>
        </button>

        {/* 병원 버튼 - 아직 미구현 */}
        <button className="role-btn" onClick={handleHospitalClick}>
          <img
            src="/src/assets/icons/hospital-icon.svg"
            alt="병원"
            className="role-icon"
          />
          <span>병원</span>
        </button>
      </div>
    </div>
  );
}
