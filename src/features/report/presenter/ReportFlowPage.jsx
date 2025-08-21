// src/features/report/presenter/ReportFlowPage.jsx
import { useState } from "react";
import { ReportProvider } from "../model/ReportContext";
import useReportFlow from "../controller/useReportFlow";
import PageHeader from "./components/PageHeader";
import StepIndicator from "./components/StepIndicator";
import Step1 from "./steps/Step1Consciousness";
import Step2 from "./steps/Step2AccidentType";
import Step3 from "./steps/Step3Symptoms";
import Step4 from "./steps/Step4Breathing";
import Step5 from "./steps/Step5Photo";

export default function ReportFlowPage() {
  return (
    <ReportProvider>
      <Inner />
    </ReportProvider>
  );
}

function Inner() {
  const [step, setStep] = useState(1);
  const { submit } = useReportFlow();

  const next = () => setStep((s) => Math.min(5, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const onSubmit = async () => {
    await submit();
    // 신고 완료 후 홈으로 이동
    window.location.href = "/";
  };

  return (
    <div>
      {step === 1 && <Step1 onNext={next} onBack={back} />}
      {step === 2 && <Step2 onNext={next} onBack={back} />}
      {step === 3 && <Step3 onNext={next} onBack={back} />}
      {step === 4 && <Step4 onNext={next} onBack={back} />}
      {step === 5 && <Step5 onSubmit={onSubmit} onBack={back} />}
    </div>
  );
}
