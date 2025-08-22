import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./EmergencyResponderPage.css";

export default function EmergencyResponderPage() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [recordingState, setRecordingState] = useState("ready"); // "ready", "recording", "processing", "completed"
  const [voiceText, setVoiceText] = useState("");

  const location = useLocation();
  const reportData = location.state;

  if (!reportData) return <div>데이터 없음</div>;

  const goBack = () => navigate("/patient-info");
  const handleSend = () => setShowPopup(true);
  const handleNewCase = () => navigate("/report-list");

const [mediaStream, setMediaStream] = useState(null);
const [audioContext, setAudioContext] = useState(null);
const [processor, setProcessor] = useState(null);
const [chunks, setChunks] = useState([]);

// ⬇️ handleRecordClick 수정
const handleRecordClick = async () => {
  if (recordingState === "ready") {
    setRecordingState("recording");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      const ctx = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: 16000,
      });

      // AudioWorklet 로드
      await ctx.audioWorklet.addModule("/recorder-processor.js");
      const source = ctx.createMediaStreamSource(stream);
      const proc = new AudioWorkletNode(ctx, "recorder-processor");

      const localChunks = [];
      proc.port.onmessage = (event) => {
        localChunks.push(new Float32Array(event.data));
      };

      source.connect(proc);
      proc.connect(ctx.destination);

      setMediaStream(stream);
      setAudioContext(ctx);
      setProcessor(proc);
      setChunks(localChunks);
    } catch (err) {
      console.error("🚨 마이크 접근 실패:", err);
      setVoiceText("마이크 권한이 필요합니다.");
      setRecordingState("completed");
    }
  } else if (recordingState === "recording") {
    // 🔴 중지 버튼 클릭 시
    processor.disconnect();
    mediaStream.getTracks().forEach((track) => track.stop());
    audioContext.close();

    let totalLength = chunks.reduce((acc, cur) => acc + cur.length, 0);
    let pcmData = new Float32Array(totalLength);
    let offset = 0;
    for (let chunk of chunks) {
      pcmData.set(chunk, offset);
      offset += chunk.length;
    }

    const wavBlob = exportWAV(pcmData, 16000);
    const formData = new FormData();
    formData.append("file", wavBlob, "recording.wav");

    setRecordingState("processing");
    try {
      const res = await fetch("https://api.localism0825.store/api/voice/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("STT API 요청 실패");
      const result = await res.json();

      setVoiceText(result.data?.text || "인식된 텍스트 없음");
    } catch (err) {
      console.error("🚨 음성 인식 실패:", err);
      setVoiceText("음성 인식에 실패했습니다.");
    } finally {
      setRecordingState("completed");
    }
  }
};

// 🔧 WAV 변환 함수
function exportWAV(pcmData, sampleRate) {
  const buffer = new ArrayBuffer(44 + pcmData.length * 2); // 16bit = 2바이트
  const view = new DataView(buffer);

  const writeString = (offset, str) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };

  // WAV 헤더
  writeString(0, "RIFF");
  view.setUint32(4, 36 + pcmData.length * 2, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); // byte rate
  view.setUint16(32, 2, true); // block align
  view.setUint16(34, 16, true); // bits per sample
  writeString(36, "data");
  view.setUint32(40, pcmData.length * 2, true);

  // Float32 → Int16 변환
  let offset = 44;
  for (let i = 0; i < pcmData.length; i++, offset += 2) {
    let s = Math.max(-1, Math.min(1, pcmData[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }

  return new Blob([view], { type: "audio/wav" });
}


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
                  src="/icons/material-symbols_mic.svg"
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
                <img
                  src="/icons/recordingrectangle.png"
                  alt="정지"
                  className="recording-icon"
                />
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
            src="/icons/arrow-left.png"
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
            <img src="/icons/buzz.svg" alt="활력징후" className="vital-icon" />
            <h3 className="vital-title">
              활력징후 <span className="vital-subtitle">(BLE 자동수집)</span>
            </h3>
          </div>
          <div className="vital-content">
            <div className="vital-signs">
              <div className="vital-item">
                <img
                  src="/icons/Rectangle2.png"
                  alt="아이콘"
                  className="vital-item-icon"
                />
                <div className="vital-text">
                  <span className="vital-label">호흡수</span>
                  <span className="vital-value">{reportData.respiration}/min</span>
                </div>
              </div>
              <div className="vital-item">
                <img
                  src="/icons/Rectangle2.png"
                  alt="아이콘"
                  className="vital-item-icon"
                />
                <div className="vital-text">
                  <span className="vital-label">혈압</span>
                  <span className="vital-value">{reportData.systolic}/{reportData.diastolic}mmHg</span>
                </div>
              </div>
              <div className="vital-item">
                <img
                  src="/icons/Rectangle2.png"
                  alt="아이콘"
                  className="vital-item-icon"
                />
                <div className="vital-text">
                  <span className="vital-label">산소포화도</span>
                  <span className="vital-value">{reportData.spo2}%</span>
                </div>
              </div>
              <div className="vital-item">
                <img
                  src="/icons/Rectangle2.png"
                  alt="아이콘"
                  className="vital-item-icon"
                />
                <div className="vital-text">
                  <span className="vital-label">맥박</span>
                  <span className="vital-value">{reportData.pulse} bpm</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 위치, 시간, 상태 정보 */}
        <section className="info-card">
          <div className="info-row">
            <img src="/icons/pin.svg" alt="위치" className="info-icon" />
            <span className="info-text">
              {reportData.location}
            </span>
          </div>
          <div className="info-row">
            <img src="/icons/clock.svg" alt="시간" className="info-icon" />
            <span className="info-text">
              {new Date(reportData.created).toLocaleTimeString("ko-KR", {
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                hour12: true,
              })}
            </span>
          </div>
          <div className="info-row">
            <img
              src="/icons/heartbreaker.svg"
              alt="상태"
              className="info-icon"
            />
            <span className="info-text">
              {reportData.majorSymptoms?.join(", ")}
            </span>
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
                src="/icons/resqlooogo.svg"
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
