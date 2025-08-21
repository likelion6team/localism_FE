import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EmergencyResponderPage.css";

export default function EmergencyResponderPage() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [recordingState, setRecordingState] = useState("ready"); // "ready", "recording", "processing", "completed"
  const [voiceText, setVoiceText] = useState("");

  const goBack = () => navigate("/patient-info");
  const handleSend = () => setShowPopup(true);
  const handleNewCase = () => navigate("/report-list");

  const handleRecordClick = () => {
    if (recordingState === "ready") {
      setRecordingState("recording");
      // 3초 후 자동으로 처리 상태로 변경 (시뮬레이션)
      setTimeout(() => {
        setRecordingState("processing");
        // 2초 후 결과 표시 (시뮬레이션)
        setTimeout(() => {
          setRecordingState("completed");
          setVoiceText(
            "환자는 20대 남성으로 운동 중 쓰러졌습니다. 현재 반응이 느린 상태이고, 호흡수 30회, 혈압 90에 60, 맥박 124, 산소포화도 88%입니다. 머리 외상은 없으나 구토가 있어 뇌출혈이 의심됩니다. 현재 성북구 서경대학교에서 병원으로 이송 중입니다."
          );
        }, 2000);
      }, 3000);
    } else if (recordingState === "recording") {
      setRecordingState("processing");
      // 2초 후 결과 표시 (시뮬레이션)
      setTimeout(() => {
        setRecordingState("completed");
        setVoiceText(
          "환자는 20대 남성으로 운동 중 쓰러졌습니다. 현재 반응이 느린 상태이고, 호흡수 30회, 혈압 90에 60, 맥박 124, 산소포화도 88%입니다. 머리 외상은 없으나 구토가 있어 뇌출혈이 의심됩니다. 현재 성북구 서경대학교에서 병원으로 이송 중입니다."
        );
      }, 2000);
    }
  };

  const renderVoiceContent = () => {
    switch (recordingState) {
      case "ready":
        return (
          <>
            <div className="voice-text">버튼을 눌러 녹음을 시작하시오</div>
            <div className="record-button-container">
              <button
                className="record-button ready"
                onClick={handleRecordClick}
              >
                <img
                  src="/src/assets/material-symbols_mic.svg"
                  alt="마이크"
                  className="mic-icon"
                />
              </button>
            </div>
          </>
        );

      case "recording":
        return (
          <>
            <div className="voice-waveform">
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
            </div>
            <div className="record-button-container">
              <button
                className="record-button recording"
                onClick={handleRecordClick}
              >
                ⏹
              </button>
            </div>
          </>
        );

      case "processing":
        return (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <div className="loading-text">loading...</div>
          </div>
        );

      case "completed":
        return <div className="voice-text result">{voiceText}</div>;

      default:
        return null;
    }
  };

  return (
    <div className="emergency-responder-page">
      {/* 헤더 */}
      <header className="page-header">
        <button className="back-button" onClick={goBack}>
          <img
            src="/src/assets/arrow-left.png"
            alt="뒤로가기"
            className="back-icon"
          />
        </button>
        <h1 className="page-title">환자 정보 작성</h1>
        <div className="header-spacer"></div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="main-content">
        {/* 음성 입력 섹션 */}
        <div className="voice-card">
          <div className="voice-header">
            <div className="voice-wave-icon">((o))</div>
            <h3 className="voice-title">음성 입력</h3>
          </div>
          <div className="voice-content">{renderVoiceContent()}</div>
        </div>

        {/* 활력징후 섹션 */}
        <div className="vital-card">
          <div className="vital-header">
            <img
              src="/src/assets/buzz.svg"
              alt="활력징후"
              className="vital-icon"
            />
            <h3 className="vital-title">
              활력징후 <span className="vital-subtitle">(BLE 자동수집)</span>
            </h3>
          </div>
          <div className="vital-content">
            <div className="vital-signs">
              <div className="vital-item">
                <img
                  src="/src/assets/Rectangle2.png"
                  alt="아이콘"
                  className="vital-item-icon"
                />
                <div className="vital-text">
                  <span className="vital-label">호흡수</span>
                  <span className="vital-value">30 /min</span>
                </div>
              </div>
              <div className="vital-item">
                <img
                  src="/src/assets/Rectangle2.png"
                  alt="아이콘"
                  className="vital-item-icon"
                />
                <div className="vital-text">
                  <span className="vital-label">혈압</span>
                  <span className="vital-value">90/60mmHg</span>
                </div>
              </div>
              <div className="vital-item">
                <img
                  src="/src/assets/Rectangle2.png"
                  alt="아이콘"
                  className="vital-item-icon"
                />
                <div className="vital-text">
                  <span className="vital-label">산소포화도</span>
                  <span className="vital-value">88%</span>
                </div>
              </div>
              <div className="vital-item">
                <img
                  src="/src/assets/Rectangle2.png"
                  alt="아이콘"
                  className="vital-item-icon"
                />
                <div className="vital-text">
                  <span className="vital-label">맥박</span>
                  <span className="vital-value">124 bpm</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 위치, 시간, 상태 정보 */}
        <section className="info-card">
          <div className="info-row">
            <img src="/src/assets/pin.svg" alt="위치" className="info-icon" />
            <span className="info-text">
              서울특별시 성북구 종암로 25길 10 (종암동)
            </span>
          </div>
          <div className="info-row">
            <img
              src="/src/assets/clock2.svg"
              alt="시간"
              className="info-icon"
            />
            <span className="info-text">오후 2:15:35</span>
          </div>
          <div className="info-row">
            <img
              src="/src/assets/heartbreaker.svg"
              alt="상태"
              className="info-icon"
            />
            <span className="info-text">심정지</span>
          </div>
        </section>
      </main>

      {/* 전송 버튼 */}
      <footer className="page-footer">
        <button className="send-button" onClick={handleSend}>
          전송
        </button>
      </footer>

      {/* 홈 인디케이터 */}
      <div className="home-indicator" />

      {/* 팝업 모달 */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-dialog">
            <div className="popup-header">
              <img
                src="/src/assets/resqlooogo.svg"
                alt="ResQ"
                className="popup-logo"
              />
            </div>
            <div className="popup-content">
              <div className="popup-success">
                <span className="check-icon">✅</span>
                <h3 className="popup-title">병원 수신 완료</h3>
              </div>
              <div className="popup-info">
                <p className="case-id">SX-2025-08-11-2073</p>
                <p className="eta">ETA: 7분</p>
                <p className="hospital">병원: 고려대안암병원</p>
              </div>
            </div>
            <div className="popup-footer">
              <button className="new-case-button" onClick={handleNewCase}>
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
