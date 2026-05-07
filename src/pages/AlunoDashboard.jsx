import { COLORS } from "../constants/theme";
import { SCHEDULE } from "../data/mockData";

export default function AlunoDashboard() {
  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h2 style={{ fontSize: 26, fontWeight: 700, fontFamily: "'Archivo Black', sans-serif" }}>Bom dia, Gabriel.</h2>
        <p style={{ color: COLORS.muted, marginTop: 4 }}>Voce tem 2 treinos confirmados esta semana.</p>
      </div>
      <div style={{ display: "flex", gap: 16 }}>
        {[
          { label: "Treinos no mes", value: "12", delta: "+3", color: "#22c55e" },
          { label: "Horas treinadas", value: "18h", delta: "+2h", color: "#22c55e" },
          { label: "Meta semanal", value: "80%", delta: "4/5 dias", color: "#f59e0b" },
          { label: "Personal", value: "Carlos M.", delta: "Ativo", color: "#22c55e" },
        ].map((stat) => (
          <div key={stat.label} className="stat-card">
            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Archivo Black', sans-serif", letterSpacing: 1 }}>{stat.value}</div>
            <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 4 }}>{stat.label}</div>
            <div style={{ color: stat.color, fontSize: 12, marginTop: 6, fontWeight: 500 }}>{stat.delta}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div className="card">
          <div style={{ fontWeight: 700, fontFamily: "'Archivo Black', sans-serif", marginBottom: 16 }}>Proximos treinos</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {SCHEDULE.map((session) => (
              <div key={`${session.day}-${session.time}`} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", background: "#161616", borderRadius: 8 }}>
                <div style={{ width: 40, height: 40, background: "rgba(224,112,64,0.1)", borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: COLORS.accent, fontSize: 11, fontWeight: 700 }}>{session.day}</span>
                  <span style={{ color: COLORS.muted, fontSize: 10 }}>{session.time}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{session.type}</div>
                  <div style={{ color: COLORS.muted, fontSize: 12 }}>com {session.trainer}</div>
                </div>
                <span className="tag" style={session.status === "pending" ? { background: "rgba(245,158,11,0.1)", color: "#f59e0b", borderColor: "rgba(245,158,11,0.2)" } : { background: "rgba(34,197,94,0.1)", color: "#22c55e", borderColor: "rgba(34,197,94,0.2)" }}>
                  {session.status === "confirmed" ? "Confirmado" : "Pendente"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div style={{ fontWeight: 700, fontFamily: "'Archivo Black', sans-serif", marginBottom: 16 }}>Evolucao fisica</div>
          {[
            { label: "Peso", current: "78kg", goal: "72kg", progress: 60 },
            { label: "Gordura corporal", current: "18%", goal: "12%", progress: 40 },
            { label: "Massa muscular", current: "34kg", goal: "38kg", progress: 72 },
          ].map((metric) => (
            <div key={metric.label} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                <span style={{ color: COLORS.muted }}>{metric.label}</span>
                <span style={{ fontWeight: 600 }}>{metric.current} <span style={{ color: COLORS.muted, fontWeight: 400 }}>→ {metric.goal}</span></span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${metric.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
