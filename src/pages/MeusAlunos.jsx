import { COLORS } from "../constants/theme";
import { STUDENTS } from "../data/mockData";

export default function MeusAlunos() {
  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 700, fontFamily: "'Archivo Black', sans-serif" }}>Meus Alunos</h2>
          <p style={{ color: COLORS.muted, marginTop: 4 }}>{STUDENTS.length} alunos ativos</p>
        </div>
        <button className="btn-accent">+ Adicionar Aluno</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        {STUDENTS.map((student) => (
          <div key={student.name} className="trainer-card">
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
              <div className="avatar" style={{ background: student.color, width: 52, height: 52, fontSize: 18 }}>{student.avatar}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 16 }}>{student.name}</div>
                <span className="tag">{student.goal}</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 24, color: COLORS.accent }}>{student.sessions}</div>
                <div style={{ fontSize: 11, color: COLORS.muted }}>sessoes</div>
              </div>
            </div>
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: COLORS.muted, marginBottom: 6 }}>
                <span>Progresso da meta</span><span style={{ color: COLORS.accent, fontWeight: 600 }}>{student.progress}%</span>
              </div>
              <div className="progress-bar"><div className="progress-fill" style={{ width: `${student.progress}%` }} /></div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn-ghost" style={{ flex: 1, padding: "8px" }}>Ver Treinos</button>
              <button className="btn-accent" style={{ flex: 1, padding: "8px" }}>Evolucao</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
