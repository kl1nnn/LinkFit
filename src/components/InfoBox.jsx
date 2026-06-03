export default function InfoBox({ label, value }) {
  return (
    <div className="info-box">
      <div className="info-label">{label}</div>
      <div className="info-value">{value}</div>
    </div>
  );
}
