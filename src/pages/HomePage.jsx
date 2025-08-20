// src/pages/HomePage.jsx
// 앱의 메인 홈페이지 - 역할 선택 화면
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);

  // 신고자 버튼 클릭 시 리포트 작성 페이지로 이동
  const handleReporterClick = () => {
    setSelectedRole("reporter");
    // 약간의 지연 후 페이지 이동 (선택 효과를 보기 위해)
    setTimeout(() => {
      navigate("/report");
    }, 200);
  };

  // 구급대원 버튼 클릭 시 구급대원 페이지로 이동
  const handleEMTClick = () => {
    setSelectedRole("emt");
    // 약간의 지연 후 페이지 이동 (선택 효과를 보기 위해)
    setTimeout(() => {
      navigate("/emergency-responder");
    }, 200);
  };

  // 병원 버튼 클릭 시 병원 페이지로 이동
  const handleHospitalClick = () => {
    setSelectedRole("hospital");
    // 약간의 지연 후 페이지 이동 (선택 효과를 보기 위해)
    setTimeout(() => {
      navigate("/hospital");
    }, 200);
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
        <button
          className={`role-btn ${
            selectedRole === "reporter" ? "selected" : ""
          }`}
          onClick={handleReporterClick}
        >
          <img
            src="/src/assets/icons/reporter-icon.svg"
            alt="신고자"
            className="role-icon"
          />
          <span>신고자</span>
        </button>

        {/* 구급대원 버튼 - 아직 미구현 */}
        <button
          className={`role-btn ${selectedRole === "emt" ? "selected" : ""}`}
          onClick={handleEMTClick}
        >
          <img
            src="/src/assets/icons/emt-icon.svg"
            alt="구급대원"
            className="role-icon"
          />
          <span>구급대원</span>
        </button>

        {/* 병원 버튼 - 아직 미구현 */}
        <button
          className={`role-btn ${
            selectedRole === "hospital" ? "selected" : ""
          }`}
          onClick={handleHospitalClick}
        >
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
