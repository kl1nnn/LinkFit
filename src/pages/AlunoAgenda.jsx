import { COLORS } from "../constants/theme";

const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"];
const hours = ["06:00", "07:00", "08:00", "09:00", "10:00", "11:00"];
const booked = { "Seg-07:00": "Hipertrofia", "Qua-07:00": "Hipertrofia", "Sex-08:00": "Força" };

export default function AlunoAgenda() {
  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 700, fontFamily: "'Archivo Black', sans-serif" }}>Minha Agenda</h2>
          <p style={{ color: COLORS.muted, marginTop: 4 }}>Semana de 28 abr. a 4 mai. de 2026</p>
        </div>
        <button className="btn-accent">+ Agendar Treino</button>
      </div>
      <div className="card" style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ padding: "10px 12px", textAlign: "left", color: COLORS.muted, fontSize: 13, fontWeight: 500, width: 70 }}>Horário</th>
              {days.map((day) => (
                <th key={day} style={{ padding: "10px 12px", textAlign: "center", color: COLORS.muted, fontSize: 13, fontWeight: 500 }}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hours.map((hour) => (
              <tr key={hour} style={{ borderTop: `1px solid ${COLORS.border}` }}>
                <td style={{ padding: "10px 12px", color: COLORS.muted, fontSize: 13 }}>{hour}</td>
                {days.map((day) => {
                  const event = booked[`${day}-${hour}`];
                  return (
                    <td key={day} style={{ padding: "6px 8px", textAlign: "center" }}>
                      {event ? (
                        <div style={{ background: "rgba(224,112,64,0.12)", border: "1px solid rgba(224,112,64,0.3)", color: COLORS.accent, borderRadius: 6, padding: "6px 4px", fontSize: 12, fontWeight: 600 }}>
                          {event}
                        </div>
                      ) : (
                        <div style={{ height: 32 }} />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
