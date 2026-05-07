import { useState } from "react";
import { COLORS } from "../constants/theme";
import { WORKOUTS } from "../data/mockData";

export default function Treinos() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 700, fontFamily: "'Archivo Black', sans-serif" }}>Treinos</h2>
          <p style={{ color: COLORS.muted, marginTop: 4 }}>Gerencie os treinos dos seus alunos.</p>
        </div>
        <button className="btn-accent">+ Criar Treino</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {WORKOUTS.map((workout, index) => (
          <div key={workout.name} className="card" style={{ cursor: "pointer" }} onClick={() => setSelected(selected === index ? null : index)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 600 }}>{workout.name}</div>
                <div style={{ color: COLORS.muted, fontSize: 13, marginTop: 4 }}>Aluno: {workout.student}</div>
              </div>
              <span style={{ color: COLORS.accent }}>{selected === index ? "▲" : "▼"}</span>
            </div>
            {selected === index && (
              <div style={{ marginTop: 16, borderTop: `1px solid ${COLORS.border}`, paddingTop: 16 }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      {["Exercicio", "Series", "Reps", "Carga"].map((heading) => (
                        <th key={heading} style={{ textAlign: "left", padding: "6px 12px", color: COLORS.muted, fontSize: 12, fontWeight: 500 }}>{heading}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {workout.exercises.map((exercise) => (
                      <tr key={exercise.name} style={{ borderTop: `1px solid ${COLORS.border}` }}>
                        <td style={{ padding: "10px 12px", fontWeight: 500 }}>{exercise.name}</td>
                        <td style={{ padding: "10px 12px", color: COLORS.muted }}>{exercise.sets}</td>
                        <td style={{ padding: "10px 12px", color: COLORS.muted }}>{exercise.reps}</td>
                        <td style={{ padding: "10px 12px" }}><span className="tag">{exercise.load}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
