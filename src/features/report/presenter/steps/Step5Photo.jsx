// src/features/report/presenter/steps/Step5Photo.jsx
import { useRef, useState, useMemo } from "react";
import "./Step5Photo.css";

export default function Step5Photo({ onSubmit, onBack }) {
  const fileRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // 간단 케이스 ID/ETA (디자인 데모용)
  const caseId = useMemo(() => {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return `SX-${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
      d.getDate()
    )}-${Math.floor(1000 + Math.random() * 9000)}`;
  }, []);
  const etaMinutes = 7;

  const pickFile = () => fileRef.current?.click();
  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
  };

  // 사진이 없어도 신고 가능 → 모달 먼저 띄움
  const openModal = () => setShowModal(true);

  const confirm = () => {
    setShowModal(false);
    // parent로 사진(있으면 URL) 전달. 필요시 여기서 localStorage.clear() 등 처리 가능
    onSubmit?.({ photo: previewUrl || null, caseId, eta: etaMinutes });
  };

  const goHome = () => {
    // 역할 선택 페이지로 이동
    window.location.href = "/role-selection"; // 또는 적절한 경로
  };

  return (
    <div className="step5-page app-container">
      {/* 헤더 */}
      <div className="header">
        <button
          type="button"
          className="back-btn"
          onClick={onBack}
          aria-label="뒤로가기"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h1 className="title">사고 리포트 작성</h1>
        <div style={{ width: 24 }} />
      </div>

      {/* 홈으로 버튼 - 헤더 아래 오른쪽에 별도 배치 */}
      <div className="home-link-container">
        <button
          className="home-btn"
          type="button"
          onClick={goHome}
          aria-label="홈으로"
        >
          ← 홈으로
        </button>
      </div>

      {/* 진행도 */}
      <div className="progress">
        <div className="progress-text">5/5</div>
      </div>

      {/* 본문 */}
      <div className="content">
        <div className="text-center mb-8">
          <h2 className="main-title">
            <span className="blue-text">현장 사진</span>
          </h2>
          <p className="main-title black-text">을 보여주세요.</p>
        </div>

        <div className="optional-text">(선택)</div>

        <div className="option-grid">
          <button type="button" className="option-button" onClick={pickFile}>
            <div className="option-text">
              {previewUrl ? "사진 다시 업로드" : "사진 업로드"}
            </div>
          </button>

          <button
            type="button"
            className="option-button"
            onClick={() => alert("카메라는 앱/모바일 환경에서 구현됩니다.")}
          >
            <div className="option-text">사진 찍기</div>
          </button>
        </div>

        {previewUrl && (
          <div className="photo-preview">
            <div className="preview-placeholder">
              <img
                src={previewUrl}
                alt="미리보기"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 사진 없어도 항상 활성화 */}
      <button type="button" className="next-button" onClick={openModal}>
        신고 완료
      </button>

      {/* 파일 입력 */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={onFileChange}
      />

      {/* 완료 모달 */}
      {showModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-content">
            <button
              className="close-button"
              onClick={() => setShowModal(false)}
              aria-label="닫기"
            >
              ×
            </button>
            <div className="modal-title">신고 접수 완료</div>
            <div className="modal-body">
              <div className="checkmark">✓</div>
              <div className="case-id">케이스 ID: {caseId}</div>
              <div className="modal-text">
                119 구급대원과 병원에 정보가 전송되었습니다.
              </div>
              <div className="modal-text">
                구급차 도착 예상시간: {etaMinutes}분
              </div>
            </div>
            <button className="modal-button" onClick={confirm}>
              확인
            </button>
          </div>
        </div>
      )}

      <div className="home-indicator" />
    </div>
  );
}
