import { useNavigate } from "react-router-dom";
import { useReport } from "../model/ReportContext";
import { sendReport } from "../model/reportApi";

export default function useReportFlow() {
  const nav = useNavigate();
  const s = useReport();

  const canNext = (step) => {
    if (step === 1) return !!s.consciousness;
    if (step === 2) return s.accidentTypes.length > 0;
    if (step === 3) return s.symptoms.length > 0;
    if (step === 4) return !!s.breathing;
    return true; // 5는 선택
  };

  const submit = async () => {
    const payload = {
      consciousness: s.consciousness,
      accidentTypes: s.accidentTypes,
      symptoms: s.symptoms,
      breathing: s.breathing,
      photosCount: s.photos.length,
    };
    const res = await sendReport(payload);
    if (res.ok) nav("/complete", { state: { id: res.id } });
  };

  return { state: s, canNext, submit };
}
