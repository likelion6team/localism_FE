export default function NextButton({ label = "다음", onClick, disabled }) {
  return (
    <button
      type="button"
      className={`next-btn ${disabled ? "is-disabled" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
