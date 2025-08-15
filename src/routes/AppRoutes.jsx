// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage";
import ReportFlowPage from "../features/report/presenter/ReportFlowPage";
import CompletePage from "../pages/ReportComplete";
import ReportListPage from "../pages/ReportListPage";
import PatientInfoPage from "../pages/PatientInfoPage";
import EmergencyResponderPage from "../pages/EmergencyResponderPage";
import HospitalViewerPage from "../pages/HospitalViewerPage";
import PatientDetailPage from "../pages/PatientDetailPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/report" element={<ReportFlowPage />} />
      <Route path="/complete" element={<CompletePage />} />
      <Route path="/report-list" element={<ReportListPage />} />
      <Route path="/patient-info" element={<PatientInfoPage />} />
      <Route path="/emergency-responder" element={<EmergencyResponderPage />} />
      <Route path="/hospital-viewer" element={<HospitalViewerPage />} />
      <Route path="/patient-detail" element={<PatientDetailPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
