// src/features/report/model/reportApi.js
// 신고 리포트 관련 API 함수들

const API_BASE_URL = import.meta.env.VITE_API_URL;

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

// TMAP API 키 (실제 사용시 환경변수로 관리해야 함)
const TMAP_API_KEY =
  import.meta.env.VITE_TMAP_API_KEY ||
  "sVHWS8NG5uR7YE7Kdlou2tUK4HfK6OG6kq9Tnh53";

// 좌표를 주소로 변환하는 API (TMAP API 사용)
export async function getAddressFromCoordinates(lat, lng) {
  try {
    if (!TMAP_API_KEY || TMAP_API_KEY === "your-tmap-api-key-here") {
      console.warn(
        "TMAP API 키가 설정되지 않았습니다. 기본 주소 형식으로 반환합니다."
      );
      return `위도: ${lat}, 경도: ${lng}`;
    }

    const response = await fetch(
      `https://apis.openapi.sk.com/tmap/geo/reversegeocoding?version=1&format=json&callback=result&appKey=${TMAP_API_KEY}&lat=${lat}&lon=${lng}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`TMAP API 호출 실패: ${response.status}`);
    }

    const data = await response.json();

    if (data.status === "OK" && data.result && data.result.length > 0) {
      const addressInfo = data.result[0];
      return `${
        addressInfo.newAddressList.newAddressName[0].fullAddress ||
        addressInfo.newAddressList.newAddressName[0].sidoName +
          " " +
          addressInfo.newAddressList.newAddressName[0].sggName
      }`;
    } else {
      return `위도: ${lat}, 경도: ${lng}`;
    }
  } catch (error) {
    console.error("TMAP API 주소 변환 실패:", error);
    return `위도: ${lat}, 경도: ${lng}`;
  }
}
