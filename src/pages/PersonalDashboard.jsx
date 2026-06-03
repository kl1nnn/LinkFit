import Avatar from "../components/Avatar";
import PageHeader from "../components/PageHeader";
import { COLORS } from "../constants/theme";
import { BOOKINGS, CURRENT_PERSONAL_PROFILE, HIRE_REQUESTS, STUDENTS } from "../data/mockData";

const todaysSessions = [
  { time: "07:00", student: "Gabriel Rocha", type: "Hipertrofia", status: "done" },
  { time: "09:00", student: "Pedro Avila", type: "Cardio", status: "now" },
  { time: "17:00", student: "Henry Bertolatti", type: "Força", status: "upcoming" },
];

export default function PersonalDashboard({
  students = STUDENTS,
  bookings = BOOKINGS,
  personalProfile = CURRENT_PERSONAL_PROFILE,
  hireRequests = [],
  setHireRequests = () => {},
  setHiredTrainerIds = () => {},
}) {
  const expectedRevenue = bookings.length * 110;
  const firstName = personalProfile.name.split(" ")[0];
  const trainerId = personalProfile.id ?? CURRENT_PERSONAL_PROFILE.id;
  const requestsWithFallback = [
    ...hireRequests,
    ...HIRE_REQUESTS.filter((demoRequest) => (
      demoRequest.trainerId === trainerId &&
      !hireRequests.some((request) => request.id === demoRequest.id || (
        request.trainerId === demoRequest.trainerId &&
        request.studentName === demoRequest.studentName
      ))
    )),
  ];
  const pendingRequests = requestsWithFallback.filter((request) => request.trainerId === trainerId && request.status === "pending");

  const getRequestStudent = (request) => students.find((student) => student.name === request.studentName) ?? {
    name: request.studentName,
    goal: request.studentGoal,
    avatar: request.studentAvatar,
    color: request.studentColor,
    photo: request.studentPhoto,
  };

  const answerHireRequest = (requestId, status) => {
    const request = requestsWithFallback.find((item) => item.id === requestId);
    if (!request) return;

    setHireRequests((current) => {
      const answeredRequest = { ...request, status, answeredAt: new Date().toISOString() };
      const alreadySaved = current.some((item) => item.id === requestId);

      return alreadySaved
        ? current.map((item) => (item.id === requestId ? answeredRequest : item))
        : [...current, answeredRequest];
    });

    if (status === "accepted" && request) {
      setHiredTrainerIds((current) => current.includes(request.trainerId) ? current : [...current, request.trainerId]);
    }
  };

  return (
    <div className="page fade-in" style={{ gap: 24 }}>
      <PageHeader title={`Olá, ${firstName}.`} subtitle={`${todaysSessions.length} sessões marcadas para hoje.`} />
      <div style={{ display: "flex", gap: 16 }}>
        {[
          { label: "Alunos ativos", value: students.length, delta: "cadastros atuais" },
          { label: "Sessões na semana", value: bookings.length, delta: "agenda completa" },
          { label: "Avaliação média", value: "4,8", delta: "32 avaliações" },
          { label: "Receita prevista", value: `R$${expectedRevenue.toLocaleString("pt-BR")}`, delta: "estimativa semanal" },
        ].map((stat) => (
          <div key={stat.label} className="stat-card">
            <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Archivo Black', sans-serif" }}>{stat.value}</div>
            <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 4 }}>{stat.label}</div>
            <div style={{ color: "#22c55e", fontSize: 12, marginTop: 6 }}>{stat.delta}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="section-title">Solicitações de contratação</div>
        {pendingRequests.length > 0 ? (
          <div className="hire-request-list">
            {pendingRequests.map((request) => {
              const requestStudent = getRequestStudent(request);

              return (
                <div key={request.id} className="hire-request-card">
                  <Avatar person={requestStudent} size={46} fontSize={15} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700 }}>{request.studentName}</div>
                    <div className="muted" style={{ fontSize: 12 }}>
                      Objetivo: {request.studentGoal} · Interesse em {request.specialties.join(", ")}
                    </div>
                    <div style={{ color: COLORS.accent, fontSize: 12, marginTop: 4, fontWeight: 600 }}>
                      Proposta: R$ {request.price} por sessão
                    </div>
                  </div>
                  <span className="request-status-pill">Pendente</span>
                  <button className="btn-ghost" onClick={() => answerHireRequest(request.id, "declined")} style={{ padding: "8px 14px" }}>Recusar</button>
                  <button className="btn-accent" onClick={() => answerHireRequest(request.id, "accepted")} style={{ padding: "8px 14px" }}>Aceitar</button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="muted" style={{ fontSize: 13 }}>Nenhuma solicitação pendente no momento.</div>
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div className="card">
          <div className="section-title">Sessões de hoje</div>
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
                  {session.status === "done" ? "Concluído" : session.status === "now" ? "Em andamento" : "Próximo"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="section-title">Progresso dos alunos</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {students.map((student) => (
              <div key={student.name}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Avatar person={student} size={28} fontSize={11} />
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
