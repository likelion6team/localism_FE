// import { useNavigate } from "react-router-dom";
// import { useState } from "react";
// import "./ReportConfirm.css";

// export default function ReportConfirm() {
//   const navigate = useNavigate();
//   const [open, setOpen] = useState(false);

//   const showConfirmation = () => setOpen(true);
//   const handleNo = () => {
//     setOpen(false);
//     // 역할 선택(홈)으로 이동
//     navigate("/"); // HomePage 경로에 맞게 조정
//   };
//   const handleYes = () => {
//     setOpen(false);
//     // Step1(의식상태)로 이동 — 앱의 라우팅에 맞게 변경
//     // 예) '/report'가 1단계부터 시작이면 '/report'
//     navigate("/report/step1");
//   };
//   const goBack = () => navigate("/");

//   return (
//     <div className="reportconfirm-page">
//       {/* Header */}
//       <header className="rc-header">
//         <button className="rc-back" onClick={goBack} aria-label="뒤로가기">
//           ←
//         </button>
//         <div className="rc-title">사고 리포트</div>
//         {/* 오른쪽 홈 링크가 필요하다면 여기에 배치해도 됨 */}
//         <a
//           className="rc-home-link"
//           href="/"
//           onClick={(e) => {
//             e.preventDefault();
//             navigate("/");
//           }}
//         >
//           ← 홈으로
//         </a>
//       </header>

//       {/* Main */}
//       <main className="rc-main">
//         <button className="rc-report-btn" onClick={showConfirmation}>
//           <span className="rc-report-text">119 신고하기</span>
//         </button>
//       </main>

//       {/* Home indicator (mock) */}
//       <div className="rc-home-indicator" />

//       {/* Alert Dialog */}
//       {open && (
//         <div className="rc-alert-overlay" role="dialog" aria-modal="true">
//           <div className="rc-alert">
//             <div className="rc-alert-title">신고 하시겠습니까?</div>
//             <div className="rc-alert-desc">
//               공공기관에 대한 장난전화는 60만원 이하의 벌금, 구류 또는 과료로
//               처벌될 수 있습니다.
//             </div>
//             <div className="rc-alert-actions">
//               <button className="rc-alert-btn outline" onClick={handleNo}>
//                 아니요
//               </button>
//               <button className="rc-alert-btn primary" onClick={handleYes}>
//                 예
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
