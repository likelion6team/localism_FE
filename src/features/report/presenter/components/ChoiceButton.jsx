// features/report/presenter/components/ChoiceButton.jsx
export default function ChoiceButton({
  label,
  selected = false,
  onClick,
  className = "",
}) {
  return (
    <button
      className={`${className} ${selected ? "selected" : ""}`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}
