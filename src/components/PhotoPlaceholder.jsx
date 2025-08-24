import React, { useEffect, useState } from "react";
const API_BASE_URL = import.meta.env.VITE_API_URL;
import "./PhotoPlaceholder.css";

export default function PhotoPlaceholder({ reportId }) {
  const [imageUrl, setImageUrl] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let tempUrl = "";
    async function fetchImage() {
      try {
        if (!reportId) {
          setLoaded(true);
          return;
        }
        const res = await fetch(
          `${API_BASE_URL}/api/reports/${reportId}/image`,
          { headers: { accept: "*/*" } }
        );
        if (!res.ok) {
          setLoaded(true);
          return;
        }
        const blob = await res.blob();
        if (!blob || !blob.size || !(blob.type || "").startsWith("image")) {
          setLoaded(true);
          return;
        }
        tempUrl = URL.createObjectURL(blob);
        setImageUrl(tempUrl);
      } catch {
        // ignore
      } finally {
        setLoaded(true);
      }
    }
    fetchImage();
    return () => {
      if (tempUrl) URL.revokeObjectURL(tempUrl);
    };
  }, [reportId]);

  if (!loaded || !imageUrl) return null; // 이미지 없으면 컴포넌트 미표시

  return (
    <div className="photo-placeholder">
      <img
        src={imageUrl}
        alt="현장 사진"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: 22,
        }}
      />
    </div>
  );
}
