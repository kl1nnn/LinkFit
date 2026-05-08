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
      <path
        fill="url(#linkfit-mark-gradient)"
        d="M17.1 51.5c-1.4 0-2.1-1.1-1.7-2.4l10.7-35c.4-1.3 1.5-2.1 2.9-2.1h12.4L31.1 45.4h11.2L32 55.4c-.8.8-1.8 1.2-3 1.2H17.1z"
      />
      <path
        fill="url(#linkfit-mark-gradient)"
        d="M33.9 37.3c1.2-4.1 3.1-7.1 5.8-9.1 2.4-1.7 5.6-2.6 9.5-2.6h10.3c1.4 0 2 .8 1.4 1.8l-5.3 6.1c-.7.9-1.8 1.3-3.3 1.3h-9.1c-1.7 0-2.8.8-3.3 2.3l-.7 2.1c3.4-1.4 7.7-2.1 12.8-2.1h4.6c1.4 0 2 .8 1.4 1.8l-5.3 6.1c-.7.9-1.8 1.3-3.3 1.3h-9.1c-1.7 0-2.8.8-3.3 2.3l-1.4 4.7c-.4 1.4-1.5 2.1-2.9 2.1H21.4l7.6-24.7 4.7 5.2c.3.3.3.8.2 1.4z"
      />
      <path
        fill={COLORS.bg}
        d="M31 41.4c6.4-3.3 13.4-5 21-5h4.5c.9 0 1.4.4 1.5 1.1l-.4.5h-4.5c-8.2 0-15.4 1.8-21.5 5.5l-2.4 1.5 1.2-2.8c.1-.3.3-.6.6-.8z"
        opacity="0.92"
      />
    </svg>
  );
}
