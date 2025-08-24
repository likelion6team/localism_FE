
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "./PatientDetailPage.css";
import VitalTrendGraph from "../components/VitalTrendGraph";
import axios from "axios";
import { toKoreaDateObject } from "../features/report/model/date.js";

export default function PatientDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // /patient-detail/:id
  const [isPrinting, setIsPrinting] = useState(false);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  const goBack = () => navigate("/hospital");
  const handleComplete = async () => {
    try {
      // ✅ PATCH 요청으로 변경
      const res = await axios.patch(
        `https://api.localism0825.store/api/rescueReports/${id}/complete`
      );
      console.log("📌 완료 API 응답:", res);

      // ✅ 프론트 상태 초기화 (선택)
      setPatient(null);

      // ✅ 병원 목록 페이지로 이동
      navigate("/hospital");
    } catch (err) {
      console.error("🚨 완료 처리 실패:", err);
      alert("완료 처리에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => setIsPrinting(false), 10000);
  };

  // ✅ 환자 상세 API 호출
  const fetchPatient = async (id) => {
    try {
      const res = await axios.get(
        `https://api.localism0825.store/api/rescueReports/${id}`
      );
      console.log("📌 API 응답:", res);

      const d = res.data.data; // ✅ API 구조에 맞게 꺼냄

      const formatted = {
        id: d.reportId, // ✅ reportId를 id로 매핑
        created: toKoreaDateObject(d.created),
        mainSymptom: (d.majorSymptoms ?? []).join(", "),
        consciousness: d.consciousnessStatus ?? "정보 없음",
        findings: d.details ?? "정보 없음",
        eta: d.eta
          ? `${Math.floor(d.eta / 60)
              .toString()
              .padStart(2, "0")}:${(d.eta % 60).toString().padStart(2, "0")}`
          : "정보 없음",
      };

      setPatient(formatted);
    } catch (err) {
      console.error("🚨 환자 상세 조회 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPatient(id);
    }
  }, [id]);

  // ✅ 로딩 중
  if (loading) {
    return <p className="loading-text">⏳ 환자 정보를 불러오는 중...</p>;
  }

  // ✅ 실패했거나 데이터 없음
  if (!patient) {
    return <p className="error-text">❌ 환자 정보를 불러올 수 없습니다.</p>;
  }

  return (
    <div className="patient-detail-page">
      {/* 헤더 */}
      <header className="page-header">
        <button className="back-button" onClick={goBack}>
          <img
            src="/icons/arrow-left.png"
            alt="뒤로가기"
            className="back-icon"
          />
        </button>
        <h1 className="page-title">환자 상세 정보</h1>
        <div className="header-spacer"></div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="main-content">
        {/* 환자 상세 정보 카드 */}
        <section className="patient-info-section">
          <h2 className="section-title">환자 상세 정보</h2>
          <div className="patient-info-card">
            <div className="patient-info-content">
              <div className="info-item">
                <span className="info-value id-value">
                  {`SX-${patient.created.y}-${patient.created.m}-${patient.created.d}-${patient.id}`}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">주증상</span>
                <span className="info-value">{patient.mainSymptom}</span>
              </div>
              <div className="info-item">
                <span className="info-label">의식</span>
                <span className="info-value">{patient.consciousness}</span>
              </div>
              <div className="info-item emt-label-item">
                <span className="info-label emt-label">
                  {"<"}EMT 소견{">"}
                </span>
              </div>
              <div className="info-item">
                <span className="info-value emt-findings">
                  {patient.findings}
                </span>
              </div>
            </div>
            <div className="eta-bar">
              <span className="eta-label">ETA</span>
              <span className="eta-time">{patient.eta}</span>
            </div>
          </div>
        </section>

        {/* 활력징후 트렌드 섹션 */}
        <section className="vital-trend-section">
          <h2 className="section-title">활력징후 트렌드</h2>
          {/* ✅ patient null 방어 */}
          {id ? <VitalTrendGraph reportId={id} /> : <p>데이터 없음</p>}
        </section>

        {/* 라벨 섹션 */}
        <section className="label-section">
          <div className="label-header">
            <h2 className="section-title">라벨</h2>
            <button className="print-button" onClick={handlePrint}>
              클릭하여 인쇄하기
            </button>
          </div>
          {isPrinting && (
            <div className="printing-status">
              <span className="printing-text">인쇄중입니다</span>
              <span className="printing-dots">...</span>
            </div>
          )}
          <div className="label-card">
            <div className="label-content">
              <div className="label-item">
                <span className="label-id">
                  {`SX-${patient.created.y}-${patient.created.m}-${patient.created.d}-${patient.id}`}
                </span>
                <span className="label-emergency">응급환자</span>
              </div>
              <div className="label-item">
                <span className="label-time-symptoms">시간</span>
                <span className="label-datetime-content">
                  {`${patient.created.y}.${patient.created.m}.${patient.created.d} ${patient.created.h < 12 ? "AM" : "PM"} ${patient.created.h < 12 ? patient.created.h : patient.created.h-12}:${patient.created.min}`}
                </span>
              </div>
              <div className="label-item">
                <span className="label-time-symptoms">증상</span>
                <span className="label-datetime-content">
                  {patient.mainSymptom}
                </span>
              </div>
            </div>
            <div className="barcode-bar">
              <img
                src="/icons/barcode.svg"
                alt="바코드"
                className="barcode-image"
              />
            </div>
          </div>
        </section>
      </main>

      {/* 완료 버튼 */}
      <footer className="page-footer">
        <button className="complete-button" onClick={handleComplete}>
          완료
        </button>
      </footer>

      {/* 홈 인디케이터 */}
      <div className="home-indicator" />
    </div>
  );
}
