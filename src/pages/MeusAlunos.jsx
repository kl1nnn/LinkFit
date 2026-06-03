import { useState } from "react";
import Avatar from "../components/Avatar";
import InfoBox from "../components/InfoBox";
import PageHeader from "../components/PageHeader";
import { COLORS } from "../constants/theme";
import { STUDENTS } from "../data/mockData";
import readAvatarFile from "../utils/readAvatarFile";

const darkControlStyle = {
  background: "#202020",
  border: "1px solid #353535",
  color: COLORS.text,
};

const studentColors = ["#7c3aed", "#0891b2", "#059669", "#f59e0b", "#dc2626", "#2563eb", "#db2777", "#4f46e5"];

const getInitials = (name) => name
  .trim()
  .split(/\s+/)
  .slice(0, 2)
  .map((part) => part[0])
  .join("")
  .toUpperCase();

export default function MeusAlunos({ students = STUDENTS, setStudents = () => {}, onViewWorkouts = () => {}, onViewEvolution = () => {} }) {
  const [isAdding, setIsAdding] = useState(false);
  const [profile, setProfile] = useState(null);
  const [draft, setDraft] = useState({ name: "", goal: "", email: "", phone: "", photo: "" });

  const cancelAdding = () => {
    setDraft({ name: "", goal: "", email: "", phone: "", photo: "" });
    setIsAdding(false);
  };

  const addStudent = (event) => {
    event.preventDefault();
    const student = {
      ...draft,
      name: draft.name.trim(),
      goal: draft.goal.trim(),
      avatar: getInitials(draft.name),
      color: studentColors[students.length % studentColors.length],
      sessions: 0,
      progress: 0,
      evolution: { weightHistory: [75, 74.8, 75.1, 74.7, 74.6], bmi: "A calcular", bodyFat: "A calcular" },
    };

    setStudents((current) => [...current, student]);
    setProfile(student);
    cancelAdding();
  };

  return (
    <div className="page fade-in">
      <PageHeader title="Meus Alunos" subtitle={`${students.length} alunos ativos`}>
        <button className="btn-accent pill-button" onClick={() => setIsAdding(true)}>+ Adicionar Aluno</button>
      </PageHeader>
      {isAdding && (
        <form className="card form-card" onSubmit={addStudent}>
          <div className="form-title">Novo aluno</div>
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 10 }}>
            <input required placeholder="Nome completo" value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} />
            <input required placeholder="Objetivo" value={draft.goal} onChange={(event) => setDraft((current) => ({ ...current, goal: event.target.value }))} />
            <input type="email" placeholder="E-mail" value={draft.email} onChange={(event) => setDraft((current) => ({ ...current, email: event.target.value }))} />
            <input placeholder="Telefone" value={draft.phone} onChange={(event) => setDraft((current) => ({ ...current, phone: event.target.value }))} />
            <input type="file" accept="image/*" onChange={async (event) => {
              const photo = event.target.files?.[0];
              if (photo) {
                const photoData = await readAvatarFile(photo);
                setDraft((current) => ({ ...current, photo: photoData }));
              }
            }} />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-ghost" onClick={cancelAdding} style={{ padding: "8px 14px" }}>Cancelar</button>
            <button type="submit" className="btn-accent" style={{ padding: "8px 14px" }}>Adicionar aluno</button>
          </div>
        </form>
      )}
      {profile && (
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Avatar person={profile} size={60} fontSize={19} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{profile.name}</div>
              <span className="tag" style={darkControlStyle}>{profile.goal}</span>
            </div>
            <button className="btn-ghost" onClick={() => setProfile(null)} style={{ padding: "8px 14px" }}>Fechar perfil</button>
          </div>
          <div className="info-grid">
            {[
              ["Sessões realizadas", profile.sessions],
              ["Progresso da meta", `${profile.progress}%`],
              ["E-mail", profile.email || "Não informado"],
              ["Telefone", profile.phone || "Não informado"],
            ].map(([label, value]) => (
              <InfoBox key={label} label={label} value={value} />
            ))}
          </div>
        </div>
      )}
      <div className="card-grid">
        {students.map((student) => (
          <div key={student.name} className="trainer-card" style={{ background: "#202020", borderColor: "#353535" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
              <Avatar person={student} size={52} fontSize={18} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 16 }}>{student.name}</div>
                <span className="tag" style={darkControlStyle}>{student.goal}</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 24, color: COLORS.accent }}>{student.sessions}</div>
                <div style={{ fontSize: 11, color: COLORS.muted }}>sessões</div>
              </div>
            </div>
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: COLORS.muted, marginBottom: 6 }}>
                <span>Progresso da meta</span><span style={{ color: COLORS.accent, fontWeight: 600 }}>{student.progress}%</span>
              </div>
              <div className="progress-bar"><div className="progress-fill" style={{ width: `${student.progress}%` }} /></div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn-ghost" onClick={() => setProfile(student)} style={{ flex: 1, padding: "8px" }}>Perfil</button>
              <button className="btn-ghost" onClick={() => onViewWorkouts(student)} style={{ flex: 1, padding: "8px" }}>Ver Treinos</button>
              <button className="btn-ghost" onClick={() => onViewEvolution(student)} style={{ flex: 1, padding: "8px" }}>Evolução</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
