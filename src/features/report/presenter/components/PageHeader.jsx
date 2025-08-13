export default function PageHeader({ title, onBack }) {
  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}
    >
      <button onClick={onBack} style={ico} aria-label="back">
        ←
      </button>
      <div style={{ fontWeight: 700 }}>{title}</div>
    </div>
  );
}
const ico = {
  border: "none",
  background: "transparent",
  fontSize: 18,
  padding: 4,
  cursor: "pointer",
};
