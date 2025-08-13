export async function sendReport(payload) {
  // TODO: 실제 백엔드 연동. 해커톤용 mock:
  console.log("병원 전송 payload:", payload);
  await new Promise((r) => setTimeout(r, 600));
  return { ok: true, id: Math.floor(Math.random() * 1e6) };
}
