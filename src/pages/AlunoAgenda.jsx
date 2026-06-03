import { useState } from "react";
import PageHeader from "../components/PageHeader";
import { COLORS } from "../constants/theme";
import { BOOKINGS, STUDENTS } from "../data/mockData";

const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"];
const hours = Array.from({ length: 15 }, (_, index) => `${String(index + 6).padStart(2, "0")}:00`);
const months = ["jan.", "fev.", "mar.", "abr.", "mai.", "jun.", "jul.", "ago.", "set.", "out.", "nov.", "dez."];

const formatWeek = () => {
  const today = new Date();
  const monday = new Date(today);
  const weekday = today.getDay();
  monday.setDate(today.getDate() + (weekday === 0 ? -6 : 1 - weekday));

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const formatDate = (date) => `${date.getDate()} ${months[date.getMonth()]}`;
  if (monday.getFullYear() === sunday.getFullYear()) {
    return `Semana de ${formatDate(monday)} a ${formatDate(sunday)} de ${sunday.getFullYear()}`;
  }

  return `Semana de ${formatDate(monday)} de ${monday.getFullYear()} a ${formatDate(sunday)} de ${sunday.getFullYear()}`;
};

export default function AlunoAgenda({ role = "aluno", students = STUDENTS, bookings = BOOKINGS, setBookings = () => {}, currentStudentName = STUDENTS[0].name }) {
  const isPersonal = role === "personal";
  const defaultStudentName = students[0]?.name ?? currentStudentName;
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleError, setScheduleError] = useState("");
  const [draft, setDraft] = useState({ type: "", student: defaultStudentName, day: days[0], time: hours[0] });
  const visibleBookings = isPersonal ? bookings : bookings.filter((booking) => booking.student === currentStudentName);

  const cancelScheduling = () => {
    setDraft({ type: "", student: defaultStudentName, day: days[0], time: hours[0] });
    setScheduleError("");
    setIsScheduling(false);
  };

  const scheduleWorkout = (event) => {
    event.preventDefault();
    const isOccupied = bookings.some((booking) => booking.day === draft.day && booking.time === draft.time);
    if (isOccupied) {
      setScheduleError("Esse horário já possui um treino agendado.");
      return;
    }

    setBookings((current) => [...current, { id: Date.now(), ...draft, type: draft.type.trim() }]);
    cancelScheduling();
  };

  return (
    <div className="page fade-in">
      <PageHeader title={isPersonal ? "Agenda de Treinos" : "Minha Agenda"} subtitle={formatWeek()}>
        {isPersonal && (
          <button
            className="btn-accent pill-button"
            onClick={() => setIsScheduling(true)}
          >
            + Agendar Treino
          </button>
        )}
      </PageHeader>
      {isScheduling && (
        <form className="card form-card" onSubmit={scheduleWorkout}>
          <div className="form-title">Agendar treino</div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1.4fr 1fr 1fr", gap: 10 }}>
            <input required placeholder="Tipo de treino" value={draft.type} onChange={(event) => setDraft((current) => ({ ...current, type: event.target.value }))} />
            <select value={draft.student} onChange={(event) => setDraft((current) => ({ ...current, student: event.target.value }))}>
              {students.map((student) => <option key={student.name}>{student.name}</option>)}
            </select>
            <select value={draft.day} onChange={(event) => setDraft((current) => ({ ...current, day: event.target.value }))}>
              {days.map((day) => <option key={day}>{day}</option>)}
            </select>
            <select value={draft.time} onChange={(event) => setDraft((current) => ({ ...current, time: event.target.value }))}>
              {hours.map((hour) => <option key={hour}>{hour}</option>)}
            </select>
          </div>
          {scheduleError && <div style={{ color: COLORS.red, fontSize: 13 }}>{scheduleError}</div>}
          <div className="form-actions">
            <button type="button" className="btn-ghost" onClick={cancelScheduling} style={{ padding: "8px 14px" }}>Cancelar</button>
            <button type="submit" className="btn-accent" style={{ padding: "8px 14px" }}>Agendar treino</button>
          </div>
        </form>
      )}
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
                  const booking = visibleBookings.find((item) => item.day === day && item.time === hour);
                  return (
                    <td key={day} style={{ padding: "6px 8px", textAlign: "center" }}>
                      {booking ? (
                        <div title={booking.student} style={{ background: "#202020", border: "1px solid #353535", color: COLORS.text, borderRadius: 6, padding: "6px 4px", fontSize: 12, fontWeight: 600 }}>
                          {booking.type}
                          {isPersonal && <div style={{ color: COLORS.muted, fontSize: 10, fontWeight: 400, marginTop: 2 }}>{booking.student}</div>}
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
