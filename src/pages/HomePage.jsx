import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

export default function HomePage() {
  const nav = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [authPopupOpen, setAuthPopupOpen] = useState(false);
  const [authType, setAuthType] = useState(""); // "emergency" or "hospital"
  const [authNumber, setAuthNumber] = useState("");

  const goReport = () => nav("/report"); // 예 → 1단계(의식상태)로 이동
  const closeConfirm = () => setConfirmOpen(false);

  const handleEmergencyClick = () => {
    setAuthType("emergency");
    setAuthPopupOpen(true);
  };

  const handleHospitalClick = () => {
    setAuthType("hospital");
    setAuthPopupOpen(true);
  };

  const closeAuthPopup = () => {
    setAuthPopupOpen(false);
    setAuthNumber("");
    setAuthType("");
  };

  const handleAuthSubmit = () => {
    if (authType === "emergency" && authNumber === "1111") {
      nav("/report-list");
    } else if (authType === "hospital" && authNumber === "0000") {
      nav("/hospital-viewer");
    } else {
      alert("잘못된 번호입니다.");
    }
    closeAuthPopup();
  };

  return (
    <div className="home-page">
      {/* 상단 영역 */}
      <header className="hero">
        <button
          className="admin-badge"
          onClick={() => alert("관리자 페이지 준비중")}
        >
          관리자
        </button>

        <div className="logo-row">
          <span className="logo-emoji">🚑</span>
          <span className="logo-word">ResQ</span>
        </div>

        <p className="slogan">Tech with a heartbeat. That&apos;s ResQ.</p>
      </header>

      <main className="main">
        <h1 className="title">자신의 역할을 골라주세요</h1>

        <div className="role-list">
          {/* 신고자 */}
          <button className="role-btn" onClick={() => setConfirmOpen(true)}>
            <span className="role-ico">📱</span>
            신고자
          </button>

          {/* 구급대원 */}
          <button className="role-btn" onClick={handleEmergencyClick}>
            <span className="role-ico">🚑</span>
            구급대원
          </button>

          {/* 병원 */}
          <button className="role-btn" onClick={handleHospitalClick}>
            <span className="role-ico">🏥</span>
            병원
          </button>
        </div>
      </main>

      <div className="home-indicator" />

      {/* ✅ 신고 확인 모달 (조건부 렌더링) */}
      {confirmOpen && (
        <div className="alert-overlay" role="dialog" aria-modal="true">
          <div className="alert-dialog">
            <div className="alert-title">신고 하시겠습니까?</div>
            <div className="alert-description">
              공공기관에 대한 장난전화는 60만원 이하의 벌금, 구류 또는 과료로
              처벌될 수 있습니다.
            </div>
            <div className="alert-buttons">
              <button className="alert-button no" onClick={closeConfirm}>
                아니요
              </button>
              <button className="alert-button yes" onClick={goReport}>
                예
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔐 인증 팝업 모달 */}
      {authPopupOpen && (
        <div className="alert-overlay" role="dialog" aria-modal="true">
          <div className="alert-dialog">
            <div className="alert-title" style={{ color: "#dc3545" }}>
              {authType === "emergency"
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
