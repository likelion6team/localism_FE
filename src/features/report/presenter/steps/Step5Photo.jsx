// src/features/report/presenter/steps/Step5Photo.jsx
// Step5: 현장 사진 업로드 페이지 - 사고 현장의 사진을 업로드하는 마지막 단계
import { useRef, useState, useMemo } from "react";
import "./Step5Photo.css";

export default function Step5Photo({ onSubmit, onBack }) {
  // 파일 입력을 위한 ref
  const fileRef = useRef(null);
  // 업로드된 사진의 미리보기 URL을 저장하는 상태
  const [previewUrl, setPreviewUrl] = useState(null);
  // "신고 접수 완료" 모달을 보여줄지 결정하는 상태
  const [showModal, setShowModal] = useState(false);

  // 간단한 케이스 ID 생성 (디자인 데모용)
  const caseId = useMemo(() => {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return `SX-${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
      d.getDate()
    )}-${Math.floor(1000 + Math.random() * 9000)}`;
  }, []);

  // 파일 선택 다이얼로그를 여는 함수
  const pickFile = () => fileRef.current?.click();

  // 파일이 선택되었을 때 호출되는 함수
  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    // 선택된 파일을 URL로 변환하여 미리보기 표시
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
  };

  // 사진이 없어도 신고 가능 → 모달 먼저 띄움
  const openModal = () => setShowModal(true);

  // 모달의 "확인" 버튼을 클릭했을 때 호출되는 함수
  const confirm = () => {
    setShowModal(false);
    // 바로 홈화면으로 이동
    window.location.href = "/";
  };

  // 홈으로 이동하는 함수
  const goHome = () => {
    // 역할 선택 페이지로 이동
    window.location.href = "/role-selection"; // 또는 적절한 경로
  };

  return (
    <div className="app-container step5">
      {/* 헤더 - 뒤로가기 버튼과 제목 */}
      <div className="header">
        <button
          className="back-btn"
          type="button"
          aria-label="뒤로가기"
          onClick={onBack}
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h1 className="text-base font-bold text-black">사고 리포트 작성</h1>
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

      {/* 진행 상황 표시 - 현재 단계/전체 단계 */}
      <div className="progress">
        <div className="progress-text">5/5</div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="content">
        {/* 제목 섹션 - 현장 사진 업로드 안내 */}
        <div className="title-container">
          <h2 className="main-title">
            <span className="blue-text">현장 사진</span>
            <span className="black-text">을</span>
          </h2>
          <p className="sub-title">보여주세요.</p>
        </div>

        {/* 선택 사항 안내 텍스트 */}
        <div className="optional-text">(선택)</div>

        {/* 사진이 업로드되지 않았을 때 표시되는 옵션들 */}
        {!previewUrl && (
          <div className="options-container">
            {/* 사진 업로드 버튼 */}
            <button type="button" className="option-button" onClick={pickFile}>
              <div className="option-text-lg">사진 업로드</div>
            </button>

            {/* 사진 찍기 버튼 (카메라 기능은 앱/모바일 환경에서 구현) */}
            <button
              type="button"
              className="option-button"
              onClick={() => alert("카메라는 앱/모바일 환경에서 구현됩니다.")}
            >
              <div className="option-text-lg">사진 찍기</div>
            </button>
          </div>
        )}

        {/* 사진이 업로드되었을 때 표시되는 미리보기와 재업로드 버튼 */}
        {previewUrl && (
          <div className="photo-preview">
            {/* 사진 미리보기 영역 */}
            <div className="preview-placeholder">
              <img
                src={previewUrl}
                alt="현장사진"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            {/* 다시 업로드 버튼 */}
            <button
              type="button"
              className="reupload-button"
              onClick={pickFile}
            >
              다시 업로드
            </button>
          </div>
        )}
      </div>

      {/* 신고 완료 버튼 - 모달을 열어 신고 접수 완료 처리 */}
      <button type="button" className="next-button" onClick={openModal}>
        신고 완료
      </button>

      {/* 홈 인디케이터 - 하단 검은 선 */}
      <div className="home-indicator" />

      {/* 숨겨진 파일 입력 요소 */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={onFileChange}
      />

      {/* 신고 접수 완료 모달 */}
      {showModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-content">
            {/* 모달 닫기 버튼 */}
            <button
              className="close-button"
              onClick={() => setShowModal(false)}
              aria-label="닫기"
            >
              ×
            </button>

            {/* ResQ 로고 제목 */}
            <div className="modal-resq-title">
              <img
                src="/src/assets/icons/logo.svg"
                alt="ResQ Logo"
                style={{ width: "90px", height: "auto" }}
              />
            </div>

            {/* 모달 본문 내용 */}
            <div className="modal-body">
              {/* 신고 접수 완료 상태 표시 */}
              <div className="modal-status">
                <div className="checkmark">✓</div>
                <span className="status-text">신고 접수 완료</span>
              </div>

              {/* 케이스 ID 표시 */}
              <div className="case-id">케이스 ID: {caseId}</div>

              {/* 안내 메시지 */}
              <div className="modal-text">
                119 구급대원과 병원에 정보가
                <br />
                전송되었습니다.
              </div>
            </div>

            {/* 확인 버튼 - 클릭 시 홈화면으로 이동 */}
            <button className="modal-button" onClick={confirm}>
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
