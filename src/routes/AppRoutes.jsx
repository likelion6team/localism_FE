// src/routes/AppRoutes.jsx
// 앱의 모든 페이지 라우팅을 정의하는 컴포넌트
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage";
import ReportFlowPage from "../features/report/presenter/ReportFlowPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* 홈페이지 - 메인 화면 */}
      <Route path="/" element={<HomePage />} />

      {/* 리포트 작성 플로우 - Step1~Step5 */}
      <Route path="/report" element={<ReportFlowPage />} />

      {/* 잘못된 경로로 접근 시 홈페이지로 리다이렉트 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
