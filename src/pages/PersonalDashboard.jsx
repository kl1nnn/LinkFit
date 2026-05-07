import { COLORS } from "../constants/theme";
import { STUDENTS } from "../data/mockData";

const todaysSessions = [
  { time: "07:00", student: "Gabriel Rocha", type: "Hipertrofia", status: "done" },
  { time: "09:00", student: "Pedro Avila", type: "Cardio", status: "now" },
  { time: "17:00", student: "Henry Bertolatti", type: "Forca", status: "upcoming" },
];

export default function PersonalDashboard() {
  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h2 style={{ fontSize: 26, fontWeight: 700, fontFamily: "'Archivo Black', sans-serif" }}>Ola, Carlos.</h2>
        <p style={{ color: COLORS.muted, marginTop: 4 }}>Voce tem 3 sessoes marcadas para hoje.</p>
      </div>
      <div style={{ display: "flex", gap: 16 }}>
        {[
          { label: "Alunos ativos", value: "24", delta: "+2 este mes" },
          { label: "Sessoes na semana", value: "18", delta: "Seg-Sex" },
          { label: "Avaliacao media", value: "4.8", delta: "32 avaliacoes" },
          { label: "Receita prevista", value: "R$4.320", delta: "+12% vs ultimo mes" },
        ].map((stat) => (
          <div key={stat.label} className="stat-card">
            <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Archivo Black', sans-serif" }}>{stat.value}</div>
            <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 4 }}>{stat.label}</div>
            <div style={{ color: "#22c55e", fontSize: 12, marginTop: 6 }}>{stat.delta}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div className="card">
          <div style={{ fontWeight: 700, fontFamily: "'Archivo Black', sans-serif", marginBottom: 16 }}>Sessoes de hoje</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {todaysSessions.map((session) => (
              <div key={`${session.time}-${session.student}`} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", background: "#161616", borderRadius: 8 }}>
                <div style={{ color: COLORS.muted, fontSize: 13, width: 44, flexShrink: 0 }}>{session.time}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{session.student}</div>
                  <div style={{ color: COLORS.muted, fontSize: 12 }}>{session.type}</div>
                </div>
                <span className="tag" style={
                  session.status === "done" ? { background: "rgba(34,197,94,0.1)", color: "#22c55e", borderColor: "rgba(34,197,94,0.2)" } :
                  session.status === "now" ? { background: "rgba(224,112,64,0.15)", color: COLORS.accent } :
                  { background: "rgba(68,136,255,0.1)", color: COLORS.blue, borderColor: "rgba(68,136,255,0.2)" }
                }>
                  {session.status === "done" ? "Concluido" : session.status === "now" ? "Em andamento" : "Proximo"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div style={{ fontWeight: 700, fontFamily: "'Archivo Black', sans-serif", marginBottom: 16 }}>Progresso dos alunos</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {STUDENTS.map((student) => (
              <div key={student.name}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div className="avatar" style={{ background: student.color, width: 28, height: 28, fontSize: 11 }}>{student.avatar}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{student.name}</div>
                      <div style={{ fontSize: 11, color: COLORS.muted }}>{student.goal}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.accent }}>{student.progress}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${student.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
