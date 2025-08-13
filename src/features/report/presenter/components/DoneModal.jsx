export default function DoneModal({ title = "신고 접수 완료", onConfirm }) {
  return (
    <div style={dim}>
      <div style={modal}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>{title}</div>
        <div
          style={{
            height: 160,
            background: "#555",
            borderRadius: 8,
            marginBottom: 12,
          }}
        />
        <div style={{ textAlign: "center" }}>
          <button onClick={onConfirm} style={ok}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
const dim = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 16,
};
const modal = {
  width: "100%",
  maxWidth: 360,
  background: "#3A3A3A",
  color: "#fff",
  borderRadius: 12,
  padding: 16,
};
const ok = {
  padding: "10px 16px",
  borderRadius: 8,
  background: "#6AA9FF",
  border: "none",
  color: "#fff",
  cursor: "pointer",
};
