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

// 좌표를 주소로 변환하는 API (예시)
export async function getAddressFromCoordinates(lat, lng) {
  try {
    // 실제 구현에서는 지도 API 서비스 사용 (Google Maps, Kakao Maps 등)
    // 현재는 기본 주소 형식으로 반환
    return `위도: ${lat}, 경도: ${lng}`;
  } catch {
    console.error("주소 변환 실패");
    return `위도: ${lat}, 경도: ${lng}`;
  }
}
