import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HospitalViewerPage.css";

export default function HospitalViewerPage() {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const goBack = () => navigate("/");
  const handleCaseClick = () => navigate("/patient-detail");

  // 샘플 응급 상황 데이터 (fallback)
  const fallbackCases = [
    {
      id: 1,
      date: "2025.08.14",
      mainSymptom: "호흡 어려움, 뇌출혈",
      consciousness: "흐림",
      eta: "01:01",
      priority: "high", // red
    },
    {
      id: 2,
      date: "2025.08.14",
      mainSymptom: "골절",
      consciousness: "있음",
      eta: "05:15",
      priority: "medium", // yellow
    },
    {
      id: 3,
      date: "2025.08.14",
      mainSymptom: "화상, 출혈",
      consciousness: "없음",
      eta: "08:18",
      priority: "low", // grey
    },
  ];

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
      if (Array.isArray(payload)) return payload;
      const candidates = [
        payload?.rescueReports,
        payload?.reports,
        payload?.data,
        payload?.content,
        payload?.items,
        payload?.list,
        payload?.rows,
        payload?.results,
      ];
      const found = candidates.find((c) => Array.isArray(c));
      if (found) return found;
      const dataObj = payload?.data;
      const nested = [
        dataObj?.rescueReports,
        dataObj?.reports,
        dataObj?.content,
        dataObj?.items,
        dataObj?.list,
        dataObj?.rows,
        dataObj?.results,
      ];
      const foundNested = nested.find((c) => Array.isArray(c));
      if (foundNested) return foundNested;
      // BFS로 첫 번째 배열 찾기 (totalCount가 있는 페이지 응답 대응)
      const bfs = (obj, depth = 0) => {
        if (!obj || depth > 3) return [];
        if (Array.isArray(obj)) return obj;
        if (typeof obj === "object") {
          for (const key of Object.keys(obj)) {
            const res = bfs(obj[key], depth + 1);
            if (Array.isArray(res) && res.length) return res;
          }
        }
        return [];
      };
      const deep = bfs(payload);
      if (deep.length) return deep;
      return [];
    };

    async function fetchCases() {
      try {
        setLoading(true);
        setError("");
        const endpoints = [
          "https://api.localism0825.store/api/rescueReports/wait",
          "https://api.localism0825.store/api/rescueReports",
          "https://api.localism0825.store/api/rescueReports/list",
          "https://api.localism0825.store/api/rescueReports/waits",
        ];
        let list = [];
        for (const url of endpoints) {
          try {
            const res = await fetch(url, {
              method: "GET",
              headers: { accept: "*/*" },
              signal: controller.signal,
            });
            if (!res.ok) continue;
            const json = await res.json();
            console.log("rescueReports fetch", url, json);
            const extracted = extractList(json);
            if (extracted.length) {
              list = extracted;
              break;
            }
          } catch {
            // try next
          }
        }
        // 목록이 비어도 에러로 처리하지 않고 fallback 사용

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
      } catch {
        setError("데이터를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    }

    fetchCases();
    return () => controller.abort();
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

      {/* 섹션 제목 */}
      <div className="section-title">
        <img
          src="/icons/Rectangle 34625276.png"
          alt="section icon"
          className="section-icon"
        />
        <span className="hospital-section-label">Incoming Strip</span>
        <span className="section-subtitle">(ETA 순 정렬)</span>
      </div>

      {/* 응급 상황 목록 */}
      <main className="emergency-list">
        {loading && <div>불러오는 중...</div>}
        {!loading && error && <div>{error}</div>}
        {!loading &&
          !error &&
          (cases.length ? cases : fallbackCases).map((case_) => (
            <div
              key={case_.id}
              className={`emergency-card ${case_.priority}`}
              onClick={handleCaseClick}
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
      </main>

      {/* 홈 인디케이터 */}
      <div className="home-indicator" />
    </div>
  );
}
