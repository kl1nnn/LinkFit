import { COLORS } from "../constants/theme";
import LogoMark from "./LogoMark";

export default function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <LogoMark size={24} />
      <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 22, letterSpacing: 2, color: COLORS.text }}>
        LinkFit
      </span>
    </div>
  );
}
