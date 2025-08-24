import React, { useEffect, useState } from "react";
import "./VitalTrendGraph.css";

export default function VitalTrendGraph({
  reportId,
  heartRateData: heartRateDataProp,
  bloodPressureData: bloodPressureDataProp,
  timeLabels: timeLabelsProp,
}) {
  // 그래프 데이터 상태 (초기값은 전달된 prop 또는 더미)
  const [heartRateData, setHeartRateData] = useState(
    heartRateDataProp ?? [125.8, 124.5, 127.2, 123.9, 126.5, 124.0, 127.8]
  );
  const [bloodPressureData, setBloodPressureData] = useState(
    bloodPressureDataProp ?? [90.8, 89.5, 90.2, 88.8, 89.8, 88.5, 89.2]
  );
  const timeLabels = timeLabelsProp ?? [
    "10분전",
    "8분전",
    "6분전",
    "4분전",
    "2분전",
    "1분전",
    "현재",
  ];

  // reportId가 있으면 API로 실제 데이터 로드 (축 기준값은 고정 유지)
  useEffect(() => {
    const controller = new AbortController();
    async function fetchTrend() {
      if (!reportId) return;
      try {
        const res = await fetch(
          `https://api.localism0825.store/api/rescueReports/${reportId}?t=${Date.now()}`,
          { headers: { accept: "*/*" }, signal: controller.signal }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const d = json?.data ?? {};
        const pulses = Array.isArray(d.pulses) ? d.pulses : [];
        const systolics = Array.isArray(d.systolics) ? d.systolics : [];
        // 원본 값을 고정 축 범위로 정규화
        const normalize = (arr, outMin, outMax) => {
          if (!arr.length) return arr;
          const inMin = Math.min(...arr);
          const inMax = Math.max(...arr);
          if (inMin === inMax) {
            const mid = outMin + (outMax - outMin) / 2;
            return Array(arr.length).fill(mid);
          }
          const scale = (outMax - outMin) / (inMax - inMin);
          return arr.map((v) => outMin + (v - inMin) * scale);
        };

        if (pulses.length) setHeartRateData(normalize(pulses, 123, 128));
        if (systolics.length)
          setBloodPressureData(normalize(systolics, 88.0, 91.5));
      } catch (e) {
        console.debug("vital trend fetch failed", e);
      }
    }
    fetchTrend();
    return () => controller.abort();
  }, [reportId]);

  // SVG 경로 생성 함수
  const createPath = (data, maxValue, minValue, height) => {
    const safeRange = Math.max(0.0001, maxValue - minValue);
    const points = data.map((value, index) => {
      const v = Math.max(minValue, Math.min(maxValue, value));
      const x = (index / (data.length - 1)) * 280; // 그래프 영역 조정
      const y = height - ((v - minValue) / safeRange) * height;

      return `${x},${y}`;
    });
    return points.join(" ");
  };

  const heartRatePath = createPath(heartRateData, 128, 123, 100);
  const bloodPressurePath = createPath(bloodPressureData, 91.5, 88.0, 100);

  return (
    <div className="trend-graph-container">
      <div className="graph-area">
        <div className="graph-placeholder">
          {/* 왼쪽 Y축 - 심박수 */}
          <div className="y-axis left">
            <div className="y-axis-label">심박수 (bpm)</div>
            <div className="y-axis-values">
              <span>128</span>
              <span>127</span>
              <span>126</span>
              <span>125</span>
              <span>124</span>
              <span>123</span>
            </div>
          </div>
          
          <div className="graph-content">
            <div className="graph-lines">
              {/* 심박수 라인 (빨간색) */}
              <svg className="heart-rate-line" viewBox="0 0 280 100">
                <polyline
                  points={heartRatePath}
                  fill="none"
                  stroke="#ff4444"
                  strokeWidth="2"
                />
              </svg>
              {/* 수축기압 라인 (파란색) */}
              <svg className="systolic-line" viewBox="0 0 280 100">
                <polyline
                  points={bloodPressurePath}
                  fill="none"
                  stroke="#007aff"
                  strokeWidth="2"
                />
              </svg>
            </div>

            {/* X축 시간 라벨 */}
            <div className="x-axis">
              {timeLabels.map((label, index) => (
                <span key={index}>{label}</span>
              ))}
            </div>
          </div>

          {/* 오른쪽 Y축 - 혈압 */}
          <div className="y-axis right">
            <div className="y-axis-label">혈압 (mmHg)</div>
            <div className="y-axis-values">
              <span>91.5</span>
              <span>91.0</span>
              <span>90.5</span>
              <span>90.0</span>
              <span>89.5</span>
              <span>89.0</span>
              <span>88.5</span>
              <span>88.0</span>
            </div>
          </div>
        </div>

        {/* 범례 */}
        <div className="graph-legend">
          <div className="legend-item">
            <div className="legend-color red-color"></div>
            <span>심박수(bpm)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color blue-color"></div>
            <span>수축기압(mmHg)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
