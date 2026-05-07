import { COLORS } from "../constants/theme";

const weeks = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"];
const pesoData = [82, 81, 80.5, 79.5, 79, 78.5, 78, 78];
const maxPeso = 84;

export default function AlunoEvolucao() {
  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 26, fontWeight: 700, fontFamily: "'Archivo Black', sans-serif" }}>Minha Evolucao</h2>
        <p style={{ color: COLORS.muted, marginTop: 4 }}>Resumo das ultimas oito semanas.</p>
      </div>
      <div style={{ display: "flex", gap: 16 }}>
        {[
          { label: "Peso atual", value: "78 kg", delta: "-4kg desde o inicio", good: true },
          { label: "IMC", value: "24.2", delta: "Normal", good: true },
          { label: "Gordura", value: "18%", delta: "-2% este mes", good: true },
          { label: "Treinos", value: "12", delta: "este mes", good: null },
        ].map((stat) => (
          <div key={stat.label} className="stat-card">
            <div style={{ color: COLORS.muted, fontSize: 12, marginBottom: 8 }}>{stat.label}</div>
            <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 28, letterSpacing: 1 }}>{stat.value}</div>
            <div style={{ fontSize: 12, marginTop: 4, color: stat.good === true ? "#22c55e" : stat.good === false ? "#ef4444" : COLORS.muted }}>{stat.delta}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <div style={{ fontWeight: 700, fontFamily: "'Archivo Black', sans-serif", marginBottom: 20 }}>Peso corporal (kg) - ultimas 8 semanas</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 160 }}>
          {pesoData.map((value, index) => (
            <div key={weeks[index]} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 11, color: COLORS.muted }}>{value}</span>
              <div style={{ width: "100%", height: `${((value - 76) / (maxPeso - 76)) * 120}px`, background: index === pesoData.length - 1 ? COLORS.accent : "rgba(224,112,64,0.25)", borderRadius: "4px 4px 0 0", transition: "height 0.4s" }} />
              <span style={{ fontSize: 11, color: COLORS.muted }}>{weeks[index]}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <div style={{ fontWeight: 700, fontFamily: "'Archivo Black', sans-serif", marginBottom: 16 }}>Medidas corporais</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {[
            ["Peito", "98cm", "+2cm", false],
            ["Braco", "35cm", "+1.5cm", false],
            ["Cintura", "82cm", "-3cm", true],
            ["Quadril", "94cm", "-1cm", true],
            ["Coxa", "56cm", "+2cm", false],
            ["Panturrilha", "37cm", "+0.5cm", false],
          ].map(([label, value, delta, goodIfNegative]) => {
            const isPositive = delta.startsWith("+");
            const isGood = goodIfNegative ? !isPositive : isPositive;

            return (
              <div key={label} style={{ background: "#161616", borderRadius: 8, padding: "12px 14px" }}>
                <div style={{ color: COLORS.muted, fontSize: 12 }}>{label}</div>
                <div style={{ fontWeight: 700, fontSize: 18, marginTop: 2 }}>{value}</div>
                <div style={{ fontSize: 12, color: isGood ? "#22c55e" : "#ef4444", marginTop: 2 }}>{delta}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
