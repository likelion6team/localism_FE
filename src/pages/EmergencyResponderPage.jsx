import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { sendRescueReport } from "../features/report/model/reportApi";
import "./EmergencyResponderPage.css";

export default function EmergencyResponderPage() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [recordingState, setRecordingState] = useState("ready"); // "ready", "recording", "processing", "completed"
  const [voiceText, setVoiceText] = useState("");
  const [reportId, setReportId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const location = useLocation();
  const reportData = location.state;

  // 테스트용 더미 데이터 (실제로는 location.state에서 받아와야 함)
  const defaultReportData = {
    respiration: 30,
    systolic: 90,
    diastolic: 60,
    spo2: 88,
    pulse: 124,
    location: "서울특별시 성북구 종암로 25길 10 (종암동)",
    created: new Date().toISOString(),
    majorSymptoms: ["심정지", "의식저하"],
  };

  // reportData가 없으면 기본 데이터 사용
  const data = reportData || defaultReportData;

  const goBack = () => navigate("/patient-info");
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

  const handleSend = async () => {
    if (!voiceText || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // 구조 요청 리포트 전송
      const payload = {
        voiceText: voiceText,
        patientInfo: data,
        timestamp: new Date().toISOString(),
        location: data.location,
        emergencyType: data.majorSymptoms[0],
        estimatedArrival: "7분",
      };

      const result = await sendRescueReport(payload);

      if (result.ok) {
        setReportId(result.id);
        setShowPopup(true);
      } else {
        alert("리포트 전송에 실패했습니다: " + result.error);
      }
    } catch (error) {
      console.error("전송 오류:", error);
      alert("전송 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="emergency-responder-page">
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
          ←
        </button>
        <h1 className="page-title">구급대원 인터페이스</h1>
        <div className="header-spacer"></div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="main-content">
        {/* 환자 정보 확인 섹션 */}
        <section className="info-card">
          <h2 className="card-title">환자 정보 확인</h2>
          <div className="voice-input-section">
            <h3 className="voice-title">((o)) 음성 입력</h3>
            <div className="voice-text">
              {voiceText || "음성 녹음을 시작하려면 녹음 버튼을 클릭하세요"}
            </div>
            <div className="media-controls">
              <button
                className="control-btn play active"
                onClick={handleRecordClick}
                disabled={recordingState === "recording"}
              >
                {recordingState === "ready"
                  ? "🎤"
                  : recordingState === "recording"
                  ? "⏹"
                  : recordingState === "processing"
                  ? "⏳"
                  : "✅"}
              </button>
            </div>
          </div>
        </section>

        {/* 활력징후 섹션 */}
        <section className="info-card">
          <h2 className="card-title">활력징후 (BLE 자동수집)</h2>
          <div className="vital-signs">
            <div className="vital-item">
              <span className="vital-label">혈압</span>
              <span className="vital-value">
                {data.systolic}/{data.diastolic} mmHg
              </span>
            </div>
            <div className="vital-item">
              <span className="vital-label">맥박</span>
              <span className="vital-value">{data.pulse} bpm</span>
            </div>
            <div className="vital-item">
              <span className="vital-label">호흡수</span>
              <span className="vital-value">{data.respiration}/min</span>
            </div>
            <div className="vital-item">
              <span className="vital-label">산소포화도</span>
              <span className="vital-value">{data.spo2}%</span>
            </div>
          </div>
        </section>

        {/* 위치, 시간, 상태 정보 */}
        <section className="info-card">
          <div className="info-row">
            <span className="info-icon">📍</span>
            <span className="info-text">
              서울특별시 성북구 종암로 25길 10 (종암동)
            </span>
          </div>
          <div className="info-row">
            <span className="info-icon">🕐</span>
            <span className="info-text">
              {new Date(data.created).toLocaleTimeString("ko-KR", {
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                hour12: true,
              })}
            </span>
          </div>
          <div className="info-row">
            <span className="info-icon">💓</span>
            <span className="info-text">
              {data.majorSymptoms?.join(", ") || "심정지"}
            </span>
          </div>
        </section>
      </main>

      {/* 전송 버튼 */}
      <footer className="page-footer">
        <button
          className="send-button"
          onClick={handleSend}
          disabled={isSubmitting || !voiceText}
        >
          {isSubmitting ? "전송 중..." : "전송"}
        </button>
      </footer>

      {/* 홈 인디케이터 */}
      <div className="home-indicator" />

      {/* 팝업 모달 */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-dialog">
            <div className="popup-header">
              <span className="check-icon">✅</span>
            </div>
            <div className="popup-content">
              <h3 className="popup-title">병원 수신 완료</h3>
              <div className="popup-info">
                <p>
                  <strong>리포트 ID:</strong> {reportId || "SX-2025-08-11-2073"}
                </p>
                <p>
                  <strong>ETA:</strong> 7분
                </p>
                <p>
                  <strong>병원:</strong> 고려대안암병원
                </p>
              </div>
            </div>
            <div className="popup-footer">
              <button className="new-case-button" onClick={handleNewCase}>
                새로운 케이스
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
