// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage";
import ReportFlowPage from "../features/report/presenter/ReportFlowPage";
import CompletePage from "../pages/ReportComplete";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/report" element={<ReportFlowPage />} />
      <Route path="/complete" element={<CompletePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
