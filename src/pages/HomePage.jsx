// src/pages/HomePage.jsx
// 앱의 메인 홈페이지 - 역할 선택 화면
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [authPopupOpen, setAuthPopupOpen] = useState(false);
  const [authType, setAuthType] = useState(""); // "emergency" or "hospital"
  const [authNumber, setAuthNumber] = useState("");

  // 신고자 버튼 클릭 시 인증 모달 표시
  const handleReporterClick = () => {
    setSelectedRole("reporter");
    setAuthType("reporter");
    setAuthPopupOpen(true);
  };

  // 구급대원 버튼 클릭 시 인증 모달 표시
  const handleEMTClick = () => {
    setSelectedRole("emt");
    setAuthType("emergency");
    setAuthNumber("2222")
    setAuthPopupOpen(true);
  };

  // 병원 버튼 클릭 시 인증 모달 표시
  const handleHospitalClick = () => {
    setSelectedRole("hospital");
    setAuthType("hospital");
    setAuthNumber("1111")
    setAuthPopupOpen(true);
  };

  // 인증 모달 닫기
  const closeAuthPopup = () => {
    setAuthPopupOpen(false);
    setAuthNumber("");
    setAuthNumber("0000")
    setAuthType("");
  };

  // 인증 제출 처리
  const handleAuthSubmit = () => {
    if (authType === "reporter" && authNumber === "2222") {
      // 신고자 인증 성공
      setTimeout(() => {
        navigate("/report");
      }, 200);
    } else if (authType === "emergency" && authNumber === "1111") {
      // 구급대원 인증 성공
      setTimeout(() => {
        navigate("/report-list");
      }, 200);
    } else if (authType === "hospital" && authNumber === "0000") {
      // 병원 인증 성공
      setTimeout(() => {
        navigate("/hospital");
      }, 200);
    } else {
      alert("잘못된 번호입니다.");
    }
    closeAuthPopup();
  };

  return (
    <div className="homepage-container">
      {/* ResQ 로고 섹션 */}
      <div className="logo-section">
        <img src="/icons/logo.svg" alt="ResQ Logo" className="resq-logo" />
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
            src="/icons/reporter-icon.svg"
            alt="신고자"
            className="role-icon"
          />
          <span>신고자</span>
        </button>

        {/* 구급대원 버튼 - 인증 모달 표시 */}
        <button
          className={`role-btn ${selectedRole === "emt" ? "selected" : ""}`}
          onClick={handleEMTClick}
        >
          <img src="/icons/emt-icon.svg" alt="구급대원" className="role-icon" />
          <span>구급대원</span>
        </button>

        {/* 병원 버튼 - 인증 모달 표시 */}
        <button
          className={`role-btn ${
            selectedRole === "hospital" ? "selected" : ""
          }`}
          onClick={handleHospitalClick}
        >
          <img
            src="/icons/hospital-icon.svg"
            alt="병원"
            className="role-icon"
          />
          <span>병원</span>
        </button>
      </div>

      {/* 🔐 인증 팝업 모달 */}
      {authPopupOpen && (
        <div className="alert-overlay" role="dialog" aria-modal="true">
          <div className="alert-dialog">
            <div className="alert-title" style={{ color: "#dc3545" }}>
              {authType === "reporter"
                ? "신고자가 맞으신가요?"
                : authType === "emergency"
                ? "구급대원이십니까?"
                : "병원 관계자이십니까?"}
            </div>
            <div className="alert-description">자신의 번호를 입력해주세요.</div>
            <div className="auth-input-container">
              <input
                type="password"
                className="auth-input"
                placeholder="번호 입력"
                value={authNumber}
                onChange={(e) => setAuthNumber(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleAuthSubmit();
                  }
                }}
                autoFocus
              />
            </div>
            <div className="alert-buttons">
              <button className="alert-button no" onClick={closeAuthPopup}>
                아니요
              </button>
              <button className="alert-button yes" onClick={handleAuthSubmit}>
                완료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
