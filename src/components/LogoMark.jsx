import { COLORS } from "../constants/theme";

export default function LogoMark({ size = 24 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label="LinkFit"
      style={{ display: "block", flexShrink: 0 }}
    >
      <defs>
        <linearGradient id="linkfit-mark-gradient" x1="15" y1="52" x2="53" y2="16" gradientUnits="userSpaceOnUse">
          <stop stopColor={COLORS.accent} />
          <stop offset="1" stopColor={COLORS.accentDim} />
        </linearGradient>
      </defs>
      <text
        x="7"
        y="45"
        fill="url(#linkfit-mark-gradient)"
        fontFamily="Arial Black, Impact, sans-serif"
        fontSize="34"
        fontStyle="italic"
        fontWeight="900"
      >
        LF
      </text>
    </svg>
  );
}
