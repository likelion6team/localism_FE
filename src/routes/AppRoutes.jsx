// src/routes/AppRoutes.jsx
// 앱의 모든 페이지 라우팅을 정의하는 컴포넌트
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage";
import ReportFlowPage from "../features/report/presenter/ReportFlowPage";
import EmergencyResponderPage from "../pages/EmergencyResponderPage";
import HospitalViewerPage from "../pages/HospitalViewerPage";
import ReportListPage from "../pages/ReportListPage";
import PatientInfoPage from "../pages/PatientInfoPage";
import PatientDetailPage from "../pages/PatientDetailPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* 홈페이지 - 메인 화면 */}
      <Route path="/" element={<HomePage />} />

      {/* 리포트 작성 플로우 - Step1~Step5 */}
      <Route path="/report" element={<ReportFlowPage />} />

      {/* 구급대원 페이지 */}
      <Route path="/emergency-responder" element={<EmergencyResponderPage />} />

      {/* 구급대원 신고 리스트 및 환자 정보 작성 */}
      <Route path="/report-list" element={<ReportListPage />} />
      <Route path="/patient-info" element={<PatientInfoPage />} />

      {/* 병원 페이지 */}
      <Route path="/hospital" element={<HospitalViewerPage />} />

      {/* 병원 환자 상세 페이지 */}
      <Route path="/patient-detail" element={<PatientDetailPage />} />

      {/* 잘못된 경로로 접근 시 홈페이지로 리다이렉트 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
