// src/App.jsx
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import "./styles/globals.css";

export default function App() {
  return (
    <BrowserRouter>
      <div className="mobile">
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}
