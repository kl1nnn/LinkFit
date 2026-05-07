import { COLORS } from "../constants/theme";

export default function Stars({ rating }) {
  return (
    <span className="star">
      {"★".repeat(Math.floor(rating))}
      {rating % 1 ? "½" : ""}
      <span style={{ color: COLORS.muted, marginLeft: 4, fontSize: 13 }}>{rating}</span>
    </span>
  );
}
