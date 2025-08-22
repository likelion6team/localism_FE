const API_BASE_URL = import.meta.env.VITE_API_URL;


// 신고 리포트 상세 조회 API
export async function getDetailReport(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/reports/${id}`, {
      method: "GET",
    });

    // 응답 JSON 파싱
    const data = await response.json();
    console.log("상세 신고 리포트 조회 response:", data);

    // 성공 여부 확인
    if (response.ok) {
      return data;
    } else {
      throw new Error(data?.message || "상세 리포트 조회 실패");
    }
  } catch (error) {
    console.error("신고 리포트 상세 내용 가져오기 실패:", error);
    throw error;
  }
}


