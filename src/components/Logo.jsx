import { COLORS } from "../constants/theme";

export default function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 22, color: COLORS.accent }}>*</span>
      <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 22, letterSpacing: 2, color: COLORS.text }}>
        LinkFit
      </span>
    </div>
  );
}
