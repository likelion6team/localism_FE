export default function ChipToggle({ label, active, onToggle }) {
  return (
    <button
      onClick={onToggle}
      style={{
        padding: "10px 14px",
        margin: "6px",
        borderRadius: 12,
        border: active ? "2px solid var(--accent)" : "1px solid var(--line)",
        background: "#fff",
      }}
    >
      {label}
    </button>
  );
}
