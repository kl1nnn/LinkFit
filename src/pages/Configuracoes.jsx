import { useState } from "react";
import Avatar from "../components/Avatar";
import InfoBox from "../components/InfoBox";
import PageHeader from "../components/PageHeader";
import { COLORS } from "../constants/theme";
import { CURRENT_PERSONAL_PROFILE, STUDENTS } from "../data/mockData";
import usePersistedState from "../hooks/usePersistedState";
import readAvatarFile from "../utils/readAvatarFile";

const getInitials = (name) => {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return initials || "LF";
};

const asSpecialtyText = (profile) => Array.isArray(profile.specialty) ? profile.specialty.join(", ") : "";

const createDraft = (role, profile) => ({
  name: profile.name ?? "",
  email: profile.email ?? "",
  phone: profile.phone ?? "",
  photo: profile.photo ?? "",
  goal: profile.goal ?? "",
  location: profile.location ?? "",
  specialty: role === "personal" ? asSpecialtyText(profile) : "",
  price: profile.price ?? "",
  education: profile.education ?? "",
  experience: profile.experience ?? "",
  bio: profile.bio ?? "",
});

const preferenceCopy = {
  messages: ["Mensagens", "Receber aviso quando chegar uma nova conversa."],
  reminders: ["Lembretes de agenda", "Avisos antes dos treinos marcados."],
  weeklySummary: ["Resumo semanal", "Enviar um resumo do progresso e das sessões."],
  privacyMode: ["Privacidade reforçada", "Ocultar telefone em áreas públicas do sistema."],
};

export default function Configuracoes({
  role,
  studentProfile = STUDENTS[0],
  setStudents = () => {},
  setBookings = () => {},
  setWorkouts = () => {},
  personalProfile = CURRENT_PERSONAL_PROFILE,
  setPersonalProfile = () => {},
}) {
  const profile = role === "aluno" ? studentProfile : personalProfile;
  const [showProfile, setShowProfile] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [notice, setNotice] = useState("");
  const [draft, setDraft] = useState(() => createDraft(role, profile));
  const [preferences, setPreferences] = usePersistedState(`linkfit-preferences-${role}`, {
    messages: true,
    reminders: true,
    weeklySummary: role === "personal",
    privacyMode: false,
  });

  const summaryItems = role === "aluno"
    ? [
        ["Nome", profile.name],
        ["E-mail", profile.email],
        ["Telefone", preferences.privacyMode ? "Oculto" : profile.phone],
        ["Objetivo", profile.goal],
        ["Sessões", `${profile.sessions} sessões`],
        ["Progresso", `${profile.progress}%`],
      ]
    : [
        ["Nome", profile.name],
        ["E-mail", profile.email],
        ["Telefone", preferences.privacyMode ? "Oculto" : profile.phone],
        ["Cidade", profile.location],
        ["Especialidades", profile.specialty?.join(", ")],
        ["Valor", `R$ ${profile.price} por sessão`],
        ["Formação", profile.education],
        ["Experiência", profile.experience],
      ];

  const updateDraft = (field, value) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const toggleEditing = () => {
    if (!isEditing) {
      setDraft(createDraft(role, profile));
    }

    setIsEditing((current) => !current);
  };

  const updatePhoto = async (event) => {
    const photo = event.target.files?.[0];
    if (!photo) return;

    try {
      const photoData = await readAvatarFile(photo);
      updateDraft("photo", photoData);
      setNotice("Foto carregada. Salve o perfil para aplicar.");
    } catch (error) {
      setNotice(error.message);
    }
  };

  const saveStudentProfile = (nextProfile, oldName) => {
    setStudents((current) => current.map((student, index) => (
      index === 0 || student.name === oldName ? nextProfile : student
    )));

    if (nextProfile.name !== oldName) {
      setBookings((current) => current.map((booking) => (
        booking.student === oldName ? { ...booking, student: nextProfile.name } : booking
      )));
      setWorkouts((current) => current.map((workout) => (
        workout.student === oldName ? { ...workout, student: nextProfile.name } : workout
      )));
    }
  };

  const saveProfile = (event) => {
    event.preventDefault();

    const name = draft.name.trim() || profile.name;
    const commonProfile = {
      ...profile,
      name,
      avatar: getInitials(name),
      email: draft.email.trim(),
      phone: draft.phone.trim(),
      photo: draft.photo,
    };

    if (role === "aluno") {
      saveStudentProfile({ ...commonProfile, goal: draft.goal.trim() || profile.goal }, profile.name);
    } else {
      const specialty = draft.specialty
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      setPersonalProfile({
        ...commonProfile,
        location: draft.location.trim(),
        specialty: specialty.length ? specialty : profile.specialty,
        price: Number(draft.price) || profile.price,
        education: draft.education.trim(),
        experience: draft.experience.trim(),
        bio: draft.bio.trim(),
      });
    }

    setIsEditing(false);
    setNotice("Perfil atualizado com sucesso.");
  };

  const togglePreference = (key) => {
    setPreferences((current) => ({ ...current, [key]: !current[key] }));
  };

  return (
    <div className="page fade-in">
      <PageHeader title="Configurações" subtitle="Gerencie perfil, preferências e acesso da conta." />

      <div className="settings-grid">
        <section className="card settings-main-card">
          <div className="settings-profile-top">
            <Avatar person={{ ...profile, photo: draft.photo || profile.photo }} size={76} fontSize={22} />
            <div style={{ flex: 1 }}>
              <div className="settings-profile-name">{profile.name}</div>
              <div className="muted" style={{ fontSize: 13 }}>
                {role === "aluno" ? `Aluno · ${profile.goal}` : `Personal trainer · ${profile.location}`}
              </div>
              {role === "personal" && profile.bio && <div className="settings-bio">{profile.bio}</div>}
            </div>
            <div className="settings-actions">
              <button className="btn-ghost" onClick={() => setShowProfile((current) => !current)}>
                {showProfile ? "Fechar perfil" : "Ver perfil"}
              </button>
              <button className="btn-accent pill-button" onClick={toggleEditing}>
                {isEditing ? "Cancelar edição" : "Editar perfil"}
              </button>
            </div>
          </div>

          {notice && <div className="settings-notice">{notice}</div>}

          {showProfile && (
            <div className="info-grid settings-info-grid">
              {summaryItems.map(([label, value]) => <InfoBox key={label} label={label} value={value || "Não informado"} />)}
            </div>
          )}

          {isEditing && (
            <form className="settings-form" onSubmit={saveProfile}>
              <div className="settings-form-grid">
                <input required placeholder="Nome" value={draft.name} onChange={(event) => updateDraft("name", event.target.value)} />
                <input required type="email" placeholder="E-mail" value={draft.email} onChange={(event) => updateDraft("email", event.target.value)} />
                <input required placeholder="Telefone" value={draft.phone} onChange={(event) => updateDraft("phone", event.target.value)} />
                {role === "aluno" ? (
                  <input required placeholder="Objetivo" value={draft.goal} onChange={(event) => updateDraft("goal", event.target.value)} />
                ) : (
                  <>
                    <input required placeholder="Cidade" value={draft.location} onChange={(event) => updateDraft("location", event.target.value)} />
                    <input required placeholder="Especialidades separadas por vírgula" value={draft.specialty} onChange={(event) => updateDraft("specialty", event.target.value)} />
                    <input required type="number" placeholder="Valor por sessão" value={draft.price} onChange={(event) => updateDraft("price", event.target.value)} />
                    <input required placeholder="Formação" value={draft.education} onChange={(event) => updateDraft("education", event.target.value)} />
                    <input required placeholder="Experiência" value={draft.experience} onChange={(event) => updateDraft("experience", event.target.value)} />
                    <textarea rows={3} placeholder="Resumo profissional" value={draft.bio} onChange={(event) => updateDraft("bio", event.target.value)} />
                  </>
                )}
              </div>
              <label className="settings-photo-input">
                Atualizar foto de perfil
                <input type="file" accept="image/*" onChange={updatePhoto} />
              </label>
              <div className="form-actions">
                <button type="button" className="btn-ghost" onClick={() => setIsEditing(false)} style={{ padding: "8px 14px" }}>Cancelar</button>
                <button type="submit" className="btn-accent" style={{ padding: "8px 14px" }}>Salvar perfil</button>
              </div>
            </form>
          )}
        </section>

        <aside className="card settings-side-card">
          <div className="section-title">Preferências</div>
          {Object.entries(preferenceCopy).map(([key, [title, description]]) => (
            <button key={key} className="settings-preference" onClick={() => togglePreference(key)}>
              <span>
                <strong>{title}</strong>
                <small>{description}</small>
              </span>
              <span className={`settings-toggle ${preferences[key] ? "active" : ""}`}>
                <span />
              </span>
            </button>
          ))}
        </aside>
      </div>

      <div className="card settings-account-card">
        <div>
          <div className="section-title" style={{ marginBottom: 4 }}>Conta e acesso</div>
          <p className="muted" style={{ fontSize: 13 }}>Dados usados apenas nesta demonstração. As alterações ficam salvas no navegador.</p>
        </div>
        <div className="button-row">
          <button className="btn-ghost" onClick={() => setNotice("A alteração de senha será conectada quando houver autenticação real.")}>Alterar senha</button>
          <button className="btn-ghost" onClick={() => setNotice("Conta mantida ativa nesta demonstração.")} style={{ color: COLORS.red, borderColor: "rgba(217,64,64,0.35)" }}>Desativar conta</button>
        </div>
      </div>
    </div>
  );
}
