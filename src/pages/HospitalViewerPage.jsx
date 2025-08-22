import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HospitalViewerPage.css";

export default function HospitalViewerPage() {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const goBack = () => navigate("/");
  const handleCaseClick = (id) => navigate(`/patient-detail/${id}`);

  // 공통 유틸: mm:ss 포맷, 우선순위 분류
  const formatMmSs = (sec) => {
    if (sec == null || Number.isNaN(sec)) return "-";
    const s = Math.max(0, Math.floor(sec));
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  };

  const classifyPrioritySec = (etaSec) => {
    if (etaSec == null) return "low";
    if (etaSec < 5 * 60) return "high";
    if (etaSec < 10 * 60) return "medium";
    return "low";
  };

  // 최초 진입 시 캐시된 카드 즉시 표시
  useEffect(() => {
    try {
      const raw = localStorage.getItem("hospital_cases_cache");
      if (raw) {
        const cached = JSON.parse(raw);
        if (Array.isArray(cached) && cached.length > 0) {
          setCases(cached);
        }
      }
    } catch (e) {
      console.debug("hospital_cases_cache read failed", e);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const toDate = (value) => {
      if (!value) return "-";
      if (typeof value === "number") {
        const d = new Date(value < 10 ** 12 ? value * 1000 : value);
        if (!isNaN(d)) {
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, "0");
          const dd = String(d.getDate()).padStart(2, "0");
          return `${yyyy}.${mm}.${dd}`;
        }
      }
      const d1 = new Date(value);
      if (!isNaN(d1)) {
        const yyyy = d1.getFullYear();
        const mm = String(d1.getMonth() + 1).padStart(2, "0");
        const dd = String(d1.getDate()).padStart(2, "0");
        return `${yyyy}.${mm}.${dd}`;
      }
      return String(value);
    };

    const formatMmSs = (sec) => {
      if (sec == null || Number.isNaN(sec)) return "-";
      const s = Math.max(0, Math.floor(sec));
      const mm = String(Math.floor(s / 60)).padStart(2, "0");
      const ss = String(s % 60).padStart(2, "0");
      return `${mm}:${ss}`;
    };

    const classifyPrioritySec = (etaSec) => {
      if (etaSec == null) return "low";
      if (etaSec < 5 * 60) return "high";
      if (etaSec < 10 * 60) return "medium";
      return "low";
    };

    const extractList = (payload) => {
      if (!payload) return [];
      const pickArray = (arr) =>
        Array.isArray(arr) && arr.length && typeof arr[0] === "object"
          ? arr
          : null;

      if (Array.isArray(payload)) {
        const picked = pickArray(payload);
        if (picked) return picked;
      }

      const top = [
        payload?.rescueReports,
        payload?.reports,
        payload?.content,
        payload?.items,
        payload?.list,
        payload?.results,
        payload?.rows,
      ];
      for (const x of top) {
        const picked = pickArray(x);
        if (picked) return picked;
      }

      const dataObj = payload?.data;
      const underData = [
        dataObj?.rescueReports,
        dataObj?.reports,
        dataObj?.content,
        dataObj?.items,
        dataObj?.list,
        dataObj?.results,
        dataObj?.rows,
      ];
      for (const x of underData) {
        const picked = pickArray(x);
        if (picked) return picked;
      }
      return [];
    };

    async function fetchCases() {
      try {
        setLoading(true);
        setError("");
        // 캐시 방지 파라미터 추가로 새 데이터 즉시 반영
        const res = await fetch(
          `https://api.localism0825.store/api/rescueReports/wait?t=${Date.now()}`,
          {
            method: "GET",
            headers: { accept: "*/*" },
            signal: controller.signal,
          }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const list = extractList(json);

        const mapped = list.map((it, idx) => {
          const id = it?.id ?? it?.reportId ?? it?.rescueReportId ?? idx + 1;
          const date = toDate(
            it?.date ??
              it?.created ??
              it?.createdAt ??
              it?.created_at ??
              it?.reportedAt
          );
          // ETA(초)
          const etaSec =
            it?.eta ??
            it?.etaSeconds ??
            it?.eta_sec ??
            it?.etaSec ??
            it?.remainEtaSeconds ??
            it?.remainSeconds ??
            it?.seconds;
          const etaSecNum = etaSec == null ? null : Number(etaSec);
          const etaText =
            etaSecNum == null || Number.isNaN(etaSecNum)
              ? "-"
              : formatMmSs(etaSecNum);
          const priority = classifyPrioritySec(etaSecNum);

          const mainSymptom =
            it?.mainSymptom ??
            (Array.isArray(it?.majorSymptoms)
              ? it.majorSymptoms.join(", ")
              : Array.isArray(it?.symptoms)
              ? it.symptoms.join(", ")
              : it?.type ?? "-");
          const consciousness = it?.consciousness ?? it?.awareness ?? "-";

          return {
            id,
            date,
            mainSymptom,
            consciousness,
            eta: etaText,
            etaSec: etaSecNum,
            priority,
          };
        });

        setCases(mapped);
        try {
          localStorage.setItem("hospital_cases_cache", JSON.stringify(mapped));
        } catch (e) {
          console.debug("hospital_cases_cache write failed", e);
        }
      } catch {
        setError("데이터를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    }

    fetchCases();

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        fetchCases();
      }
    };
    window.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);

    return () => {
      controller.abort();
      window.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
    };
  }, []);

  // 초 단위 카운트다운
  useEffect(() => {
    const t = setInterval(() => {
      setCases((prev) =>
        prev.map((c) => {
          if (c.etaSec == null || Number.isNaN(c.etaSec) || c.etaSec <= 0)
            return c;
          const next = c.etaSec - 1;
          return {
            ...c,
            etaSec: next,
            eta: formatMmSs(next),
            priority: classifyPrioritySec(next),
          };
        })
      );
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="hospital-viewer-page">
      {/* 헤더 */}
      <header className="page-header">
        <button className="back-button" onClick={goBack}>
          <img
            src="/icons/arrow-left.png"
            alt="뒤로가기"
            className="back-icon"
          />
        </button>
        <h1 className="page-title">응급 환자 현황</h1>
        <div className="header-spacer"></div>
      </header>

      {/* 제목은 항상 표시 */}
      <div className="section-title">
        <img
          src="/icons/Rectangle 34625276.png"
          alt="section icon"
          className="section-icon"
        />
        <span className="hospital-section-label">Incoming Strip</span>
        <span className="section-subtitle">(ETA 순 정렬)</span>
      </div>

      {/* 카드 영역 */}
      <main className="emergency-list">
        {error && !cases.length && <div className="error-text">{error}</div>}

        {cases.length > 0 &&
          cases.map((case_) => (
            <div
              key={case_.id}
              className={`emergency-card ${case_.priority}`}
              onClick={() => handleCaseClick(case_.id)}
            >
              <div className="card-content">
                <div className="card-date">{case_.date}</div>
                <div className="card-details">
                  <div className="detail-item">
                    <span className="detail-label">주증상</span>
                    <span className="detail-value">{case_.mainSymptom}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">의식</span>
                    <span className="detail-value">{case_.consciousness}</span>
                  </div>
                </div>
              </div>
              <div className="eta-section">
                <span className="eta-label">ETA</span>
                <span className="eta-time">{case_.eta}</span>
              </div>
            </div>
          ))}

        {cases.length === 0 && loading && (
          <>
            {[0, 1, 2].map((i) => (
              <div key={i} className="emergency-card loading">
                <div className="card-content">
                  <div className="card-date">&nbsp;</div>
                  <div className="card-details">
                    <div className="detail-item">
                      <span className="detail-label">주증상</span>
                      <span className="detail-value">불러오는 중...</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">의식</span>
                      <span className="detail-value">불러오는 중...</span>
                    </div>
                  </div>
                </div>
                <div className="eta-section">
                  <span className="eta-label">ETA</span>
                  <span className="eta-time">--:--</span>
                </div>
              </div>
            ))}
          </>
        )}

        {cases.length === 0 && !loading && !error && (
          <div className="empty-text">대기 중인 환자가 없습니다.</div>
        )}
      </main>

      {/* 홈 인디케이터 */}
      <div className="home-indicator" />
    </div>
  );
}
