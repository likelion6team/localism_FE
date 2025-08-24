import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
const API_BASE_URL = import.meta.env.VITE_API_URL;
import "./ReportListPage.css";
import { toKoreaDateObject } from "../features/report/model/date.js";

export default function ReportListPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const goBack = () => navigate("/");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchReports() {
      try {
        setLoading(true);
        setError("");
        const extractList = (payload) => {
          if (!payload) return [];
          if (Array.isArray(payload)) return payload;

          // 1) 흔한 루트/1단계 키들
          const level1 = [
            payload?.data,
            payload?.reports,
            payload?.list,
            payload?.items,
            payload?.content,
            payload?.rows,
            payload?.result,
            payload?.results,
          ];
          const found1 = level1.find((c) => Array.isArray(c));
          if (found1) return found1;

          // 2) 2단계: data 내부의 배열
          const dataObj = payload?.data;
          const level2 = [
            dataObj?.list,
            dataObj?.items,
            dataObj?.content,
            dataObj?.rows,
            dataObj?.results,
          ];
          const found2 = level2.find((c) => Array.isArray(c));
          if (found2) return found2;

          // 3) totalCount가 있을 때, 함께 내려오는 배열 후보들 찾기 (광역 탐색)
          const bfsFindArray = (obj, maxDepth = 3) => {
            const queue = [{ node: obj, depth: 0 }];
            while (queue.length) {
              const { node, depth } = queue.shift();
              if (!node || depth > maxDepth) continue;
              if (Array.isArray(node) && node.length) return node;
              if (typeof node === "object") {
                for (const key of Object.keys(node)) {
                  queue.push({ node: node[key], depth: depth + 1 });
                }
              }
            }
            return [];
          };

          const deep = bfsFindArray(payload);
          if (deep.length) return deep;

          // 4) 리스트가 아니면 표시하지 않음 (빈 배열 반환)
          return [];
        };

        // 1) 기본 엔드포인트
        const endpoints = [
          `${API_BASE_URL}/api/reports/wait`,
          //`${API_BASE_URL}/api/reports?status=WAIT`,
          //`${API_BASE_URL}/api/reports`,
          //`${API_BASE_URL}/api/reports/list`,
          //`${API_BASE_URL}/api/reports/waits`,
        ];

        let aggregated = [];
        for (const url of endpoints) {
          try {
            const res = await fetch(url, {
              method: "GET",
              headers: { accept: "*/*" },
              signal: controller.signal,
            });
            if (!res.ok) continue;
            const json = await res.json();
            console.log("reports fetch", url, json);
            const extracted = extractList(json);
            if (extracted.length > 0) {
              aggregated = extracted;
              // 최소 2개 이상이면 바로 사용
              if (aggregated.length > 1) break;
            }
          } catch {
            // 다음 후보로 진행
          }
        }

        const rawList = aggregated;

        const toDateTime = (value) => {
          if (!value) return { date: "-", time: "-" };
          // 숫자 타임스탬프 (초/밀리초)
          if (typeof value === "number") {
            const ms = value < 10 ** 12 ? value * 1000 : value;
            const d = new Date(ms);
            if (!isNaN(d)) {
              const yyyy = d.getFullYear();
              const mm = String(d.getMonth() + 1).padStart(2, "0");
              const dd = String(d.getDate()).padStart(2, "0");
              const hh = String(d.getHours()).padStart(2, "0");
              const mi = String(d.getMinutes()).padStart(2, "0");
              const ss = String(d.getSeconds()).padStart(2, "0");
              return { date: `${yyyy}.${mm}.${dd}`, time: `${hh}:${mi}:${ss}` };
            }
          }
          if (typeof value === "string") {
            // ISO/일반 파싱 먼저 시도
            const d1 = new Date(value);
            if (!isNaN(d1)) {
              const yyyy = d1.getFullYear();
              const mm = String(d1.getMonth() + 1).padStart(2, "0");
              const dd = String(d1.getDate()).padStart(2, "0");
              const hh = String(d1.getHours()).padStart(2, "0");
              const mi = String(d1.getMinutes()).padStart(2, "0");
              const ss = String(d1.getSeconds()).padStart(2, "0");
              return { date: `${yyyy}.${mm}.${dd}`, time: `${hh}:${mi}:${ss}` };
            }
            // 패턴: 2025.8.11 PM 8:27 또는 2025.08.11 20:27
            const ampmMatch = value.match(
              /(\d{4})[./-](\d{1,2})[./-](\d{1,2})\s*(AM|PM)?\s*(\d{1,2}):(\d{2})/i
            );
            if (ampmMatch) {
              const [, y, m, d, ap, hStr, min] = ampmMatch;
              let h = parseInt(hStr, 10);
              if (ap) {
                const isPM = ap.toUpperCase() === "PM";
                if (isPM && h < 12) h += 12;
                if (!isPM && h === 12) h = 0;
              }
              const yyyy = String(y);
              const mm = String(m).padStart(2, "0");
              const dd = String(d).padStart(2, "0");
              const hh = String(h).padStart(2, "0");
              const mi = String(min).padStart(2, "0");
              return { date: `${yyyy}.${mm}.${dd}`, time: `${hh}:${mi}` };
            }
            // 시간만 있는 경우 그대로 노출
            if (/\d{1,2}:\d{2}/.test(value)) return { date: "-", time: value };
          }
          return { date: "-", time: "-" };
        };

        const mapped = rawList.map((item, idx) => {
          const id = item?.id ?? item?.reportId ?? idx + 1;
          // const created =
          //   item?.createdAt ??
          //   item?.created_at ??
          //   item?.reportedAt ??
          //   item?.writedAt ??
          //   item?.time ??
          //   item?.timestamp;
          const created = toKoreaDateObject(item.created);
          // 날짜/시간 필드가 분리된 경우 우선 사용
          const explicitDate =
            item?.date ?? item?.reportDate ?? item?.eventDate ?? item?.day;
          const explicitTime =
            item?.time ?? item?.reportTime ?? item?.eventTime ?? item?.hour;
          let { date, time } =
            explicitDate || explicitTime
              ? { date: explicitDate ?? "-", time: explicitTime ?? "-" }
              : toDateTime(created);

          // 보강: 객체 전체에서 시간 단서를 탐색해 보정
          if (date === "-" || time === "-") {
            const tryInferTime = (obj, depth = 0) => {
              if (!obj || depth > 3) return null;
              if (typeof obj === "string") {
                if (
                  /\d{1,2}:\d{2}(:\d{2})?/.test(obj) ||
                  /T\d{2}:\d{2}/.test(obj)
                ) {
                  return obj;
                }
                return null;
              }
              if (typeof obj === "number") return obj;
              if (Array.isArray(obj)) {
                for (const v of obj) {
                  const r = tryInferTime(v, depth + 1);
                  if (r) return r;
                }
                return null;
              }
              if (typeof obj === "object") {
                for (const k of Object.keys(obj)) {
                  if (/time|created|reported|timestamp|date/i.test(k)) {
                    const r = tryInferTime(obj[k], depth + 1);
                    if (r) return r;
                  }
                }
              }
              return null;
            };
            const inferred = tryInferTime(item);
            if (inferred) {
              const dt = toDateTime(inferred);
              if (date === "-" && dt.date !== "-") date = dt.date;
              if (time === "-" && dt.time !== "-") time = dt.time;
            }
          }

          const address =
            item?.address ??
            item?.addressDetail ??
            item?.location ??
            item?.place ??
            item?.site ??
            "주소 정보 없음";

          // 유형 추출 강화
          const primaryType =
            item?.type ??
            item?.mainSymptom ??
            (Array.isArray(item?.symptoms)
              ? item.symptoms.join(", ")
              : item?.category ?? item?.title ?? item?.name ?? null);

          const ensureString = (v) =>
            typeof v === "string" && v.trim().length ? v : null;
          let finalType = ensureString(primaryType);
          if (!finalType) {
            const tryInferType = (obj, depth = 0) => {
              if (!obj || depth > 3) return null;
              if (typeof obj === "string") return obj;
              if (Array.isArray(obj)) {
                const parts = obj
                  .map((v) => (typeof v === "string" ? v : null))
                  .filter(Boolean);
                return parts.length ? parts.join(", ") : null;
              }
              if (typeof obj === "object") {
                for (const k of Object.keys(obj)) {
                  if (/type|symptom|category|label|name|title/i.test(k)) {
                    const r = tryInferType(obj[k], depth + 1);
                    if (r) return r;
                  }
                }
              }
              return null;
            };
            finalType = tryInferType(item);
          }

          // '기타/모름' 제거
          const removeEtcUnknown = (value) => {
            if (Array.isArray(value)) {
              const filtered = value.filter(
                (s) => typeof s === "string" && !/^기타\/모름(?::|$)/.test(s)
              );
              return filtered.join(", ");
            }
            if (typeof value === "string") {
              const cleaned = value
                .split(/[,，]/)
                .map((v) => v.trim())
                .filter((v) => v && !/^기타\/모름(?::|$)/.test(v))
                .join(", ");
              return cleaned;
            }
            return "";
          };

          const typeDisplay = removeEtcUnknown(
            Array.isArray(item?.symptoms)
              ? item.symptoms
              : Array.isArray(item?.majorSymptoms)
              ? item.majorSymptoms
              : finalType
          );

          return {
            id,
            date,
            time,
            created,
            type: typeDisplay,
            address,
          };
        });

        setReports(mapped);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("데이터를 불러오는 중 오류가 발생했습니다.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchReports();
    return () => controller.abort();
  }, []);

  const handleReportClick = (id) => {
    setTimeout(() => {
      navigate(`/patient-info/${id}`);
    }, 200);
  };

  return (
    <div className="report-list-page">
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
          <img
            src="/icons/arrow-left.png"
            alt="뒤로가기"
            className="back-icon"
          />
        </button>
        <h1 className="page-title">신고 리스트</h1>
        <div className="header-spacer"></div>
      </header>

      {/* 신고 목록 */}
      <main className="report-list">
        {loading && <div className="loading">불러오는 중...</div>}
        {!loading && error && <div className="error">{error}</div>}
        {!loading &&
          !error &&
          reports.map((report) => (
            <div
              key={report.id}
              className="report-item"
              onClick={() => handleReportClick(report.id)}
            >
              <div className="report-content">
                <div className="report-header">
                  <span className="report-date">
                    {report.created.y}.{report.created.m}.{report.created.d}
                  </span>
                  <img
                    src="/icons/clock.svg"
                    alt="시계"
                    className="time-icon"
                  />
                  <span className="report-time">
                    {report.created.h}.{report.created.min}.{report.created.s}
                  </span>
                </div>
                <div className="report-type">{report.type}</div>
                <div className="report-address">{report.address}</div>
              </div>
            </div>
          ))}
      </main>

      {/* 홈 인디케이터 */}
      <div className="home-indicator" />
    </div>
  );
}
