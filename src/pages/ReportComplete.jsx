import { useNavigate } from "react-router-dom";
import "./ReportComplete.css";

export default function ReportComplete() {
  const navigate = useNavigate();

  return (
    <div className="rc-page">
      {/* Header */}
      <header className="rc-header">
        <button
          type="button"
          className="rc-back"
          aria-label="뒤로가기"
          onClick={() => navigate(-1)}
        >
          ←
        </button>
        <h1 className="rc-header-title">사고 리포트</h1>
      </header>

      {/* Main */}
      <main className="rc-main">
        <section className="rc-titleblock">
          <p className="rc-line rc-line-1">신고 접수가</p>
          <p className="rc-line rc-line-2">완료</p>
          <p className="rc-line rc-line-3">되었습니다.</p>
          <p className="rc-thanks">오늘도 감사합니다.</p>
        </section>

        <div className="rc-btn-wrap">
          <button
            type="button"
            className="rc-home-btn"
            onClick={() => navigate("/")} // 홈으로
          >
            홈으로 이동
          </button>
        </div>
      </main>

      {/* Home indicator (decor) */}
      <div className="rc-home-indicator" />
    </div>
  );
}
