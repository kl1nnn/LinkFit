import { useState } from "react";
import Avatar from "../components/Avatar";
import InfoBox from "../components/InfoBox";
import PageHeader from "../components/PageHeader";
import Stars from "../components/Stars";
import { COLORS } from "../constants/theme";
import { STUDENTS, TRAINER_PROFILES, TRAINERS } from "../data/mockData";

const formatSessionPrice = (price) => `R$ ${price}`;

const getProfileExtra = (trainer) => TRAINER_PROFILES[trainer.name] ?? {
  bio: `${trainer.name} atende alunos em ${trainer.location} com foco em ${trainer.specialty.join(", ").toLowerCase()}. O plano é montado de acordo com rotina, nível atual e objetivo do aluno.`,
  approach: ["Avaliação inicial antes do primeiro plano", "Ajustes conforme frequência e feedback", "Contato direto para dúvidas sobre treino"],
  availability: ["Horários flexíveis durante a semana", "Atendimento presencial ou online", "Retorno em até 24 horas"],
  review: "Perfil bem avaliado pelos alunos da plataforma.",
};

export default function BuscarPersonal({ studentProfile = STUDENTS[0], hiredTrainerIds = [], hireRequests = [], setHireRequests = () => {} }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("todos");
  const [profile, setProfile] = useState(null);
  const [hiring, setHiring] = useState(null);
  const normalizedSearch = search.toLowerCase();

  const filtered = TRAINERS.filter((trainer) => {
    const matchesSearch = trainer.name.toLowerCase().includes(normalizedSearch) ||
      trainer.specialty.some((specialty) => specialty.toLowerCase().includes(normalizedSearch));
    const matchesFilter = filter === "todos" || trainer.specialty.some((specialty) => specialty.toLowerCase() === filter);

    return matchesSearch && matchesFilter;
  });

  const getStudentRequest = (trainerId, status) => hireRequests.find((request) => (
    request.trainerId === trainerId &&
    request.studentName === studentProfile.name &&
    (!status || request.status === status)
  ));

  const getButtonLabel = (trainer) => {
    if (!trainer.available) return "Sem vagas";
    if (hiredTrainerIds.includes(trainer.id)) return "Contratado";
    if (getStudentRequest(trainer.id, "pending")) return "Solicitação enviada";
    if (getStudentRequest(trainer.id, "declined")) return "Solicitar novamente";
    return "Contratar";
  };

  const isHireDisabled = (trainer) => !trainer.available || hiredTrainerIds.includes(trainer.id) || Boolean(getStudentRequest(trainer.id, "pending"));

  const requestTrainer = () => {
    if (!hiring) return;

    setHireRequests((current) => {
      const hasPendingRequest = current.some((request) => (
        request.trainerId === hiring.id &&
        request.studentName === studentProfile.name &&
        request.status === "pending"
      ));

      if (hasPendingRequest) return current;

      return [
        ...current,
        {
          id: Date.now(),
          trainerId: hiring.id,
          trainerName: hiring.name,
          studentName: studentProfile.name,
          studentGoal: studentProfile.goal,
          studentPhoto: studentProfile.photo,
          studentAvatar: studentProfile.avatar,
          studentColor: studentProfile.color,
          price: hiring.price,
          specialties: hiring.specialty,
          status: "pending",
          createdAt: new Date().toISOString(),
        },
      ];
    });
    setHiring(null);
  };

  return (
    <div className="page fade-in">
      <PageHeader title="Buscar Personal" subtitle="Filtre profissionais por objetivo, localidade e disponibilidade." />
      <div style={{ display: "flex", gap: 12 }}>
        <input placeholder="Buscar por nome ou especialidade" value={search} onChange={(event) => setSearch(event.target.value)} style={{ flex: 1 }} />
        <select style={{ width: 180 }} value={filter} onChange={(event) => setFilter(event.target.value)}>
          <option value="todos">Todos</option>
          <option value="hipertrofia">Hipertrofia</option>
          <option value="emagrecimento">Emagrecimento</option>
          <option value="funcional">Funcional</option>
          <option value="força">Força</option>
          <option value="corrida">Corrida</option>
          <option value="mobilidade">Mobilidade</option>
          <option value="yoga">Yoga</option>
        </select>
      </div>
      {profile && (
        <div className="card trainer-profile-card">
          <div className="trainer-profile-hero">
            <Avatar person={profile} size={92} fontSize={24} />
            <div className="trainer-profile-heading">
              <div className="trainer-profile-name">{profile.name}</div>
              <div className="muted" style={{ fontSize: 13 }}>{profile.location} · {profile.experience}</div>
              <div style={{ marginTop: 6 }}>
                <Stars rating={profile.rating} />
                <span style={{ color: COLORS.muted, fontSize: 12 }}> {profile.rating} ({profile.reviews} avaliações)</span>
              </div>
              <div className="trainer-profile-tags">
                {profile.specialty.map((specialty) => <span key={specialty} className="tag">{specialty}</span>)}
              </div>
            </div>
            <div className="trainer-profile-side">
              <div className="trainer-price">{formatSessionPrice(profile.price)}</div>
              <div className="trainer-price-period">por sessão</div>
              <button className="btn-ghost" onClick={() => setProfile(null)} style={{ padding: "8px 14px", marginTop: 12 }}>Fechar perfil</button>
            </div>
          </div>

          <p className="trainer-profile-bio">{getProfileExtra(profile).bio}</p>

          <div className="info-grid settings-info-grid">
            <InfoBox label="Formação" value={profile.education} />
            <InfoBox label="Experiência" value={profile.experience} />
            <InfoBox label="Localidade" value={profile.location} />
            <InfoBox label="Valor" value={`${formatSessionPrice(profile.price)} por sessão`} />
          </div>

          <div className="trainer-profile-columns">
            <div>
              <div className="section-title">Como trabalha</div>
              <ul className="trainer-profile-list">
                {getProfileExtra(profile).approach.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <div>
              <div className="section-title">Disponibilidade</div>
              <ul className="trainer-profile-list">
                {getProfileExtra(profile).availability.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </div>

          <div className="trainer-profile-columns">
            <div>
              <div className="section-title">Cursos e especializações</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {profile.courses.map((course) => <span key={course} className="tag">{course}</span>)}
              </div>
            </div>
            <div className="trainer-review-card">
              <div style={{ color: COLORS.muted, fontSize: 12, marginBottom: 6 }}>Comentário de aluno</div>
              <div>{getProfileExtra(profile).review}</div>
            </div>
          </div>

          <div className="trainer-profile-actions">
            <button className="btn-accent" disabled={isHireDisabled(profile)} onClick={() => setHiring(profile)}>
              {getButtonLabel(profile)}
            </button>
            <span className="muted" style={{ fontSize: 12 }}>A contratação só é confirmada depois que o personal aceitar a solicitação.</span>
          </div>
        </div>
      )}
      {hiring && (
        <div className="card" style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Avatar person={hiring} size={54} fontSize={16} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700 }}>Enviar solicitação para {hiring.name}?</div>
            <div style={{ color: COLORS.muted, fontSize: 13, marginTop: 3 }}>O personal precisa aceitar o pedido. Valor previsto: {formatSessionPrice(hiring.price)} por sessão.</div>
          </div>
          <button className="btn-ghost" onClick={() => setHiring(null)} style={{ padding: "8px 14px" }}>Cancelar</button>
          <button className="btn-accent" onClick={requestTrainer} style={{ padding: "8px 14px" }}>Enviar solicitação</button>
        </div>
      )}
      <div className="card-grid">
        {filtered.map((trainer) => (
          <div key={trainer.id} className="trainer-card">
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 14 }}>
              <Avatar person={trainer} size={52} fontSize={18} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 16 }}>{trainer.name}</div>
                <div style={{ color: COLORS.muted, fontSize: 13, marginTop: 2 }}>{trainer.location}</div>
                <Stars rating={trainer.rating} />
                <span style={{ color: COLORS.muted, fontSize: 12 }}> ({trainer.reviews} avaliações)</span>
              </div>
              <div className="trainer-price-block">
                <div className="trainer-price">{formatSessionPrice(trainer.price)}</div>
                <div className="trainer-price-period">/sessão</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
              {trainer.specialty.map((specialty) => <span key={specialty} className="tag">{specialty}</span>)}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-accent" disabled={isHireDisabled(trainer)} onClick={() => setHiring(trainer)} style={{ flex: 1, padding: "10px", opacity: isHireDisabled(trainer) ? 0.6 : 1 }}>
                {getButtonLabel(trainer)}
              </button>
              <button className="btn-ghost" onClick={() => setProfile(trainer)} style={{ flex: 1, padding: "10px" }}>Ver Perfil</button>
            </div>
            {!trainer.available && (
              <div style={{ marginTop: 10, fontSize: 12, color: COLORS.red, textAlign: "center" }}>Sem vagas no momento</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
