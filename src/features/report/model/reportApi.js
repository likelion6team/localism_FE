// src/features/report/model/reportApi.js
// 신고 리포트 관련 API 함수들

const API_BASE_URL = "https://api.localism0825.store";

// 신고 리포트 작성 API
export async function sendReport(payload) {
  try {
    const formData = new FormData();

    // 기본 데이터 추가
    formData.append("consciousness", payload.consciousness);
    formData.append("accidentTypes", JSON.stringify(payload.accidentTypes));
    formData.append("symptoms", JSON.stringify(payload.symptoms));
    formData.append("breathing", payload.breathing);

    // 위치 정보 추가
    if (payload.location) {
      formData.append("latitude", payload.location.lat);
      formData.append("longitude", payload.location.lng);
      formData.append("address", payload.location.address);
    }

    // 사진 파일 추가 (있는 경우에만)
    if (payload.photo) {
      formData.append("photo", payload.photo);
    }

    const response = await fetch(`${API_BASE_URL}/api/reports`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`);
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
