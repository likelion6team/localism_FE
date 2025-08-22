import { useState } from "react";
import "./VoiceInput.css";

export default function VoiceInput() {
  const [recordingState, setRecordingState] = useState("ready"); // "ready", "recording", "processing", "completed"
  const [voiceText, setVoiceText] = useState("");

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

  const handleReset = () => {
    setRecordingState("ready");
    setVoiceText("");
  };

  const renderVoiceContent = () => {
    switch (recordingState) {
      case "ready":
        return (
          <>
            <div className="voice-text">버튼을 눌러 녹음을 시작해주세요</div>
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
        return (
          <>
            <div className="voice-text result">{voiceText}</div>
            <div className="media-controls">
              <button className="control-btn stop" onClick={handleReset}>
                🔄
              </button>
              <button className="control-btn play active">▶</button>
              <button className="control-btn pause">⏸</button>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="voice-input-section">
      <div className="voice-header">
        <div className="voice-wave-icon">((o))</div>
        <h3 className="voice-title">음성 입력</h3>
      </div>
      <div className="voice-content">{renderVoiceContent()}</div>
    </div>
  );
}
