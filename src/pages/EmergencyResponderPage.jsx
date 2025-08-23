import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { sendRescueReport } from "../features/report/model/reportApi";
import "./EmergencyResponderPage.css";
import { toKoreaDateObject } from "../features/report/model/date";

export default function EmergencyResponderPage() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [recordingState, setRecordingState] = useState("ready"); // "ready", "recording", "processing", "completed"
  const [voiceText, setVoiceText] = useState("");
  const [reportId, setReportId] = useState(null);
  const [reportEta, setReportEta] = useState(null);
  const [reportHospital, setReportHospital] = useState(null);
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

  const [mediaStream, setMediaStream] = useState(null);
  const [audioContext, setAudioContext] = useState(null);
  const [processor, setProcessor] = useState(null);
  const [chunks, setChunks] = useState([]);

  if (!reportData) return <div>데이터 없음</div>;

  // 녹음 시작
  const startRecording = async () => {
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
      throw err;
    }
  };

  // 녹음 중지 후 처리
  const stopAndProcess = async () => {
    try {
      if (processor) processor.disconnect();
    } catch (e) {
      console.debug("processor disconnect failed", e);
    }
    try {
      if (mediaStream) mediaStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.debug("mediaStream stop failed", e);
    }
    try {
      if (audioContext) await audioContext.close();
    } catch (e) {
      console.debug("audioContext close failed", e);
    }

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
      const res = await fetch(
        "https://api.localism0825.store/api/voice/transcribe",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) throw new Error("STT API 요청 실패");
      const result = await res.json();

      setVoiceText(result.data?.text || "인식된 텍스트 없음");
    } catch (err) {
      console.error("🚨 음성 인식 실패:", err);
      setVoiceText("음성 인식에 실패했습니다.");
    } finally {
      setRecordingState("completed");
    }
  };

  // 오디오 리셋 (처리 없이 즉시 정리)
  const resetAudio = async () => {
    try {
      if (processor) processor.disconnect();
    } catch (e) {
      console.debug("processor disconnect failed", e);
    }
    try {
      if (mediaStream) mediaStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.debug("mediaStream stop failed", e);
    }
    try {
      if (audioContext) await audioContext.close();
    } catch (e) {
      console.debug("audioContext close failed", e);
    }
    setChunks([]);
    setVoiceText("");
    setRecordingState("ready");
  };

  // ⬇️ handleRecordClick 수정: 상태에 따라 분기
  const handleRecordClick = async () => {
    if (recordingState === "ready") {
      await startRecording();
    } else if (recordingState === "recording") {
      await stopAndProcess();
    }
  };

  // 음성 입력 영역 더블클릭 시 재녹음 (정리 후 즉시 새 녹음 시작)
  const handleVoiceDoubleClick = async () => {
    try {
      await resetAudio();
    } catch (e) {
      console.debug("double click re-record failed", e);
    }
  };

  // 🔧 WAV 변환 함수
  function exportWAV(pcmData, sampleRate) {
    const buffer = new ArrayBuffer(44 + pcmData.length * 2); // 16bit = 2바이트
    const view = new DataView(buffer);

    const writeString = (offset, str) => {
      for (let i = 0; i < str.length; i++)
        view.setUint8(offset + i, str.charCodeAt(i));
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
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
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

  const handleSend = async () => {
    if (!voiceText || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // 음성 녹음 blob 생성 (WAV 형식)
      const wavBlob = exportWAV(
        chunks.reduce((acc, cur) => acc + cur.length, 0) > 0
          ? (() => {
              let totalLength = chunks.reduce(
                (acc, cur) => acc + cur.length,
                0
              );
              let pcmData = new Float32Array(totalLength);
              let offset = 0;
              for (let chunk of chunks) {
                pcmData.set(chunk, offset);
                offset += chunk.length;
              }
              return pcmData;
            })()
          : new Float32Array(0),
        16000
      );

      // 구조 요청 리포트 전송
      const payload = {
        reportId: data.id || 1, // 실제 리포트 ID 사용
        voiceText: voiceText,
        voiceBlob: wavBlob, // 음성 녹음 blob 추가
        patientInfo: data,
        timestamp: new Date().toISOString(),
        location: data.location,
        emergencyType: data.majorSymptoms[0],
        estimatedArrival: "7분",
      };

      const result = await sendRescueReport(payload);

      if (result.ok) {
        setReportId(result.id);
        setReportEta(result.data.data.eta);
        setReportHospital(result.data.data.hospital);
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
        <div className="voice-card" onDoubleClick={handleVoiceDoubleClick}>
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
                  <span className="vital-value">{data.respiration}/min</span>
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
                  <span className="vital-value">
                    {data.systolic}/{data.diastolic}mmHg
                  </span>
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
                  <span className="vital-value">{data.spo2}%</span>
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
                  <span className="vital-value">{data.pulse} bpm</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 위치, 시간, 상태 정보 */}
        <section className="info-card">
          <div className="info-row">
            <img src="/icons/pin.svg" alt="위치" className="info-icon" />
            <span className="info-text">{data.location}</span>
          </div>
          <div className="info-row">
            <img src="/icons/clock.svg" alt="시간" className="info-icon" />
            <span className="info-text">
              {toKoreaDateObject(data.created).h < 12 ? "오전 " : "오후 "}
              {toKoreaDateObject(data.created).h < 12 ? `${toKoreaDateObject(data.created).h}` : `${toKoreaDateObject(data.created).h-12}`}
              :{`${toKoreaDateObject(data.created).min}`}:{`${toKoreaDateObject(data.created).s}`}
            </span>
          </div>
          <div className="info-row">
            <img
              src="/icons/heartbreaker.svg"
              alt="상태"
              className="info-icon"
            />
            <span className="info-text">{data.majorSymptoms?.join(", ")}</span>
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
                <p className="case-id">
                  <strong>리포트 ID:</strong>{" "}
                  {reportId ||
                    `SX-${toKoreaDateObject(data.created).y}-${toKoreaDateObject(data.created).m}-${toKoreaDateObject(data.created).d}-${data.id || 1}`}
                </p>
                <p className="eta">ETA: {Math.floor(reportEta / 60)}분 {reportEta % 60}초</p>
                <p className="hospital">병원: {reportHospital}</p>
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
