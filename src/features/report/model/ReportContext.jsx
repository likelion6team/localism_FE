import { createContext, useContext, useState } from "react";
const Ctx = createContext(null);
export function ReportProvider({ children }) {
  const [consciousness, setConsciousness] = useState(null);
  const [accidentTypes, setAccidentTypes] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [breathing, setBreathing] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [location, setLocation] = useState(null);
  const value = {
    consciousness,
    setConsciousness,
    accidentTypes,
    setAccidentTypes,
    symptoms,
    setSymptoms,
    breathing,
    setBreathing,
    photos,
    setPhotos,
    location,
    setLocation,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export const useReport = () => useContext(Ctx);
