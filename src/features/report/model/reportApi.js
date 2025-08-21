// src/features/report/model/reportApi.js
// 신고 리포트 관련 API 함수들

const API_BASE_URL = import.meta.env.VITE_API_URL;
const TMAP_APP_KEY = import.meta.env.VITE_TMAP_APP_KEY;


// 환경 변수 확인용 로그
console.log("API_BASE_URL:", API_BASE_URL);
console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);

// 신고 리포트 작성 API
export async function sendReport(payload) {
  try {
    console.log("=== sendReport 시작 ===");
    console.log("전체 payload:", payload);
    console.log("consciousness:", payload.consciousness);
    console.log("accidentTypes:", payload.accidentTypes);
    console.log("symptoms:", payload.symptoms);
    console.log("breathing:", payload.breathing);
    console.log("location:", payload.location);
    console.log("photo:", payload.photo);

    const formData = new FormData();

    // 필드 구조 맞추기 위해서 객체 하나 만들고 값을 넣어줌.
    const payloadData = {
      consciousnessStatus: payload.consciousness,
      accidentType: payload.accidentTypes,
      mainSymptoms: payload.symptoms,
      breathingStatus: payload.breathing,
    };

    // 위치 정보가 있는 경우에만 추가
    if (payload.location) {
      payloadData.location = payload.location.address;
      payloadData.lat = payload.location.lat;
      payloadData.lng = payload.location.lng;
    }

    // 디버깅: 실제 전송되는 데이터 확인
    console.log("payloadData:", payloadData);

    // data와 image
    formData.append(
      "data",
      new Blob([JSON.stringify(payloadData)], { type: "application/json" })
    );

    // 사진 파일 추가 (있는 경우에만)
    if (payload.photo) {
      formData.append("image", payload.photo);
      console.log("사진 파일:", payload.photo);
    }

    // FormData 내용 확인
    for (let [key, value] of formData.entries()) {
      console.log(`FormData ${key}:`, value);
    }

    console.log("API 호출 시작:", `${API_BASE_URL}/api/reports`);
    console.log("FormData 내용:");
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value);
    }

        const response = await fetch(`${API_BASE_URL}/api/reports`, {
      method: "POST",
      body: formData,
    });

    console.log("API 응답 상태:", response.status);
    console.log("API 응답 헤더:", response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API 오류 응답:", errorText);
      throw new Error(`API 호출 실패: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    return { ok: true, data: result };
  } catch (error) {
    console.error("신고 리포트 전송 실패:", error);
    return { ok: false, error: error.message };
  }
}

// 현재 위치 정보 가져오기 API
export async function getCurrentLocation() {
  try {
    if (!navigator.geolocation) {
      throw new Error("지리 위치를 지원하지 않는 브라우저입니다.");
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ lat: latitude, lng: longitude });
        },
        (error) => {
          reject(new Error("위치 정보를 가져올 수 없습니다."));
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    });
  } catch (error) {
    console.error("위치 정보 가져오기 실패:", error);
    throw error;
  }
}

// 좌표를 주소로 변환하는 API (예시)
export async function getAddressFromCoordinates(lat, lng) {
  try {

    // ✅ 엔드포인트 경로 포함
    const url = new URL("https://apis.openapi.sk.com/tmap/geo/reversegeocoding");
    url.searchParams.set("version", "1");
    url.searchParams.set("format", "json");
    url.searchParams.set("coordType", "WGS84GEO");
    url.searchParams.set("addressType", "A10"); // 도로명 우선(문서 옵션)
    url.searchParams.set("lon", String(lng));
    url.searchParams.set("lat", String(lat));
    // (필요 시 JSONP 샘플처럼) url.searchParams.set("callback", "result");

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: { appKey: TMAP_APP_KEY }, // ✅ 헤더에 appKey
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`Tmap 요청 실패 (${res.status}) ${txt}`);
    }

    const data = await res.json();
    const info = data?.addressInfo;
    if (!info) throw new Error("Tmap 응답에 addressInfo가 없습니다.");

    // 새주소 조립
    const lastLegal = info.legalDong?.slice(-1) ?? "";
    let road = `${info.city_do ?? ""} ${info.gu_gun ?? ""} `;
    if ((info.eup_myun ?? "") === "" && (lastLegal === "읍" || lastLegal === "면")) {
      road += info.legalDong ?? "";
    } else {
      road += info.eup_myun ?? "";
    }
    road += ` ${info.roadName ?? ""} ${info.buildingIndex ?? ""}`.trim();

    if ((info.legalDong ?? "") && !(lastLegal === "읍" || lastLegal === "면")) {
      road += (info.buildingName ?? "")
        ? ` (${info.legalDong}, ${info.buildingName})`
        : ` (${info.legalDong})`;
    } else if (info.buildingName) {
      road += ` (${info.buildingName})`;
    }

    // 지번 주소도 필요하면 함께 반환
    const jibun = `${info.city_do ?? ""} ${info.gu_gun ?? ""} ${info.legalDong ?? ""} ${info.ri ?? ""} ${info.bunji ?? ""}`
      .replace(/\s+/g, " ")
      .trim();

    return road.replace(/\s+/g, " ").trim();
  } catch (e) {
    console.error("주소 변환 실패", e);
    // 실패 시 위경도만이라도 돌려주기
    return { roadAddress: null, jibunAddress: null, lat, lng };
  }
}

