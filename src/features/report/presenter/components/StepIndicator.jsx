export default function StepIndicator({ current, total }) {
  return (
    <div style={{ opacity: 0.6, margin: "8px 0" }}>
      {current}/{total}
    </div>
  );
}
