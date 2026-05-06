import { useState } from "react";
const COLORS = {
  bg: "#121212",
  card: "#1a1a1a",
  border: "#2e2e2e",
  accent: "#e07040",
  accentDim: "#e8894e",
  text: "#f5f0eb",
  muted: "#a8a09a",
  red: "#d94040",
  blue: "#4488ff",
  secondary: "#262626",
};
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@300;400;500;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: ${COLORS.bg}; color: ${COLORS.text}; font-family: 'Inter', sans-serif; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: ${COLORS.bg}; }
  ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 2px; }
  @keyframes cursorBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
  .fade-in { animation: fadeIn 0.4s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  .pulse { animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
  .btn-accent {
    background: ${COLORS.accent};
    color: #000;
    border: none;
    padding: 12px 28px;
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 14px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.02em;
  }
  .btn-accent:hover { background: ${COLORS.accentDim}; transform: translateY(-1px); }
  .btn-ghost {
    background: transparent;
    color: ${COLORS.text};
    border: 1px solid ${COLORS.border};
    padding: 10px 24px;
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    font-size: 14px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-ghost:hover { border-color: ${COLORS.accent}; color: ${COLORS.accent}; }
  .card {
    background: ${COLORS.card};
    border: 1px solid ${COLORS.border};
    border-radius: 12px;
    padding: 20px;
  }
  .tag {
    display: inline-block;
    background: rgba(200,255,0,0.1);
    color: ${COLORS.accent};
    border: 1px solid rgba(200,255,0,0.2);
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
  }
  .tag-blue {
    background: rgba(68,136,255,0.1);
    color: ${COLORS.blue};
    border-color: rgba(68,136,255,0.2);
  }
  .star { color: #22c55e; }
  input, select, textarea {
    background: #161616;
    border: 1px solid ${COLORS.border};
    color: ${COLORS.text};
    padding: 10px 14px;
    border-radius: 8px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    width: 100%;
    outline: none;
    transition: border-color 0.2s;
  }
  input:focus, select:focus, textarea:focus { border-color: ${COLORS.accent}; }
  input::placeholder { color: ${COLORS.muted}; }
  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 14px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    color: ${COLORS.muted};
    transition: all 0.15s;
    border: none;
    background: transparent;
    width: 100%;
    text-align: left;
  }
  .nav-item:hover { background: #161616; color: ${COLORS.text}; }
  .nav-item.active { background: rgba(200,255,0,0.08); color: ${COLORS.accent}; }
  .stat-card {
    background: ${COLORS.card};
    border: 1px solid ${COLORS.border};
    border-radius: 10px;
    padding: 18px;
    flex: 1;
  }
  .progress-bar {
    height: 6px;
    background: #1e1e1e;
    border-radius: 3px;
    overflow: hidden;
  }
  .progress-fill {
    height: 100%;
    background: ${COLORS.accent};
    border-radius: 3px;
    transition: width 0.6s ease;
  }
  .avatar {
    width: 42px; height: 42px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-weight: 700;
    font-size: 16px;
    flex-shrink: 0;
  }
  .badge {
    background: ${COLORS.accent};
    color: #000;
    border-radius: 20px;
    padding: 2px 8px;
    font-size: 11px;
    font-weight: 700;
  }
  .chat-bubble-me {
    background: ${COLORS.accent};
    color: #000;
    border-radius: 16px 16px 4px 16px;
    padding: 10px 14px;
    font-size: 14px;
    max-width: 70%;
    margin-left: auto;
  }
  .chat-bubble-other {
    background: #1e1e1e;
    color: ${COLORS.text};
    border-radius: 16px 16px 16px 4px;
    padding: 10px 14px;
    font-size: 14px;
    max-width: 70%;
  }
  .trainer-card {
    background: ${COLORS.card};
    border: 1px solid ${COLORS.border};
    border-radius: 12px;
    padding: 20px;
    transition: all 0.2s;
    cursor: pointer;
  }
  .trainer-card:hover { border-color: ${COLORS.accent}; transform: translateY(-2px); }
`;
const TRAINERS = [
  { id: 1, name: "Carlos Mendes", specialty: ["Hipertrofia", "Força"], price: 180, rating: 4.9, reviews: 87, location: "Mogi das Cruzes", avatar: "CM", color: "#7c3aed", available: true },
  { id: 2, name: "Ana Ferreira", specialty: ["Emagrecimento", "Funcional"], price: 150, rating: 4.8, reviews: 64, location: "Suzano", avatar: "AF", color: "#0891b2", available: true },
  { id: 3, name: "Ricardo Lima", specialty: ["Natação", "Resistência"], price: 200, rating: 4.7, reviews: 42, location: "Mogi das Cruzes", avatar: "RL", color: "#059669", available: false },
  { id: 4, name: "Juliana Costa", specialty: ["Pilates", "Reabilitação"], price: 165, rating: 5.0, reviews: 31, location: "Itaquaquecetuba", avatar: "JC", color: "#dc2626", available: true },
];
const SCHEDULE = [
  { day: "Seg", time: "07:00", trainer: "Carlos Mendes", type: "Hipertrofia", status: "confirmed" },
  { day: "Qua", time: "07:00", trainer: "Carlos Mendes", type: "Hipertrofia", status: "confirmed" },
  { day: "Sex", time: "08:00", trainer: "Carlos Mendes", type: "Força", status: "pending" },
];
const STUDENTS = [
  { name: "Gabriel Rocha", goal: "Hipertrofia", sessions: 12, progress: 68, avatar: "GR", color: "#7c3aed" },
  { name: "Pedro Ávila", goal: "Emagrecimento", sessions: 8, progress: 45, avatar: "PA", color: "#0891b2" },
  { name: "Henry Bertolatti", goal: "Força", sessions: 20, progress: 82, avatar: "HB", color: "#059669" },
  { name: "José Miguel", goal: "Resistência", sessions: 5, progress: 30, avatar: "JM", color: "#f59e0b" },
];
const MESSAGES = [
  { from: "trainer", text: "Boa semana! Você mandou bem no treino de segunda.", time: "10:32" },
  { from: "me", text: "Valeu professor! Tô sentindo bastante diferença já.", time: "10:35" },
  { from: "trainer", text: "Ótimo! Preparei um treino novo pra sexta, foco em ombros.", time: "10:36" },
  { from: "me", text: "Perfeito! Vou estar lá!", time: "10:40" },
];
function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 22, color: COLORS.accent }}>⚡</span>
      <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 22, letterSpacing: 2, color: COLORS.text }}>
        LinkFit
      </span>
    </div>
  );
}
function Stars({ rating }) {
  return (
    <span className="star">
      {"★".repeat(Math.floor(rating))}
      {rating % 1 ? "½" : ""}
      <span style={{ color: COLORS.muted, marginLeft: 4, fontSize: 13 }}>{rating}</span>
    </span>
  );
}
function Landing({ onLogin }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Nav */}
      <nav style={{ padding: "20px 60px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${COLORS.border}` }}>
        <Logo />
        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn-ghost" onClick={() => onLogin("aluno")}>Entrar como Aluno</button>
          <button className="btn-accent" onClick={() => onLogin("personal")}>Sou Personal</button>
        </div>
      </nav>
      {/* Hero */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, padding: "80px 60px", alignItems: "center" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{
              width: 3, height: 18, background: COLORS.accent, borderRadius: 2,
              animation: "cursorBlink 1s step-end infinite"
            }} />
            <span style={{ fontSize: 13, color: COLORS.muted, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Para alunos e personal trainers
            </span>
          </div>
          <h1 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 80, lineHeight: 0.95, letterSpacing: 2, marginBottom: 24 }}>
            SEU PERSONAL
            <span style={{ color: COLORS.accent }}> IDEAL</span>
            <br />EM UM TOQUE
          </h1>
          <p style={{ color: COLORS.muted, fontSize: 18, lineHeight: 1.7, marginBottom: 40, maxWidth: 440 }}>
            Encontre o personal certo, agende sessões e acompanhe sua evolução — tudo num só lugar, sem complicação.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button className="btn-accent" style={{ fontSize: 16, padding: "14px 36px" }} onClick={() => onLogin("aluno")}>
              Começar Agora →
            </button>
            <button className="btn-ghost" style={{ fontSize: 16 }} onClick={() => onLogin("personal")}>
              Sou Personal Trainer
            </button>
          </div>
          <div style={{ display: "flex", gap: 32, marginTop: 48 }}>
            {[["+2.3k", "Alunos cadastrados"], ["347", "Personals ativos"], ["4.8", "Nota média na plataforma"]].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 32, color: COLORS.accent }}>{n}</div>
                <div style={{ color: COLORS.muted, fontSize: 13 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Dashboard Mockup */}
        <div style={{ position: "relative" }}>
          {/* Glow */}
          <div style={{
            position: "absolute", inset: -20,
            background: `radial-gradient(ellipse at center, ${COLORS.accent}22 0%, transparent 70%)`,
            borderRadius: 24, zIndex: 0,
          }} />
          {/* Mockup window */}
          <div style={{
            position: "relative", zIndex: 1,
            background: COLORS.card,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: `0 32px 80px -20px rgba(0,0,0,0.8), 0 0 0 1px ${COLORS.border}`,
          }}>
            {/* Window bar */}
            <div style={{ padding: "10px 16px", background: "#161616", display: "flex", alignItems: "center", gap: 6, borderBottom: `1px solid ${COLORS.border}` }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
              <div style={{ flex: 1, marginLeft: 8, background: "#1e1e1e", borderRadius: 4, padding: "3px 10px", fontSize: 11, color: COLORS.muted }}>
                app.linkfit.com.br/dashboard
              </div>
            </div>
            {/* Mini dashboard */}
            <div style={{ display: "flex", height: 340 }}>
              {/* Mini sidebar */}
              <div style={{ width: 120, background: "#161616", borderRight: `1px solid ${COLORS.border}`, padding: "14px 10px", display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 8px", marginBottom: 8 }}>
                  <span style={{ color: COLORS.accent, fontSize: 14 }}>⚡</span>
                  <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 11, letterSpacing: 1 }}>LinkFit</span>
                </div>
                {["▪ Início", "◎ Buscar", "▦ Agenda", "↗ Evolução", "◌ Chat"].map((item, i) => (
                  <div key={item} style={{
                    padding: "5px 8px", borderRadius: 5, fontSize: 10,
                    background: i === 0 ? `rgba(224,112,64,0.1)` : "transparent",
                    color: i === 0 ? COLORS.accent : COLORS.muted,
                  }}>{item}</div>
                ))}
              </div>
              {/* Mini content */}
              <div style={{ flex: 1, padding: 14, display: "flex", flexDirection: "column", gap: 10, overflowY: "hidden" }}>
                <div style={{ fontSize: 13, fontFamily: "'Archivo Black', sans-serif" }}>Bom dia, Gabriel.</div>
                {/* Mini stat cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
                  {[["12", "Treinos"], ["18h", "Horas"], ["80%", "Meta"]].map(([v, l]) => (
                    <div key={l} style={{ background: "#161616", borderRadius: 6, padding: "8px 10px", border: `1px solid ${COLORS.border}` }}>
                      <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Archivo Black', sans-serif" }}>{v}</div>
                      <div style={{ fontSize: 9, color: COLORS.muted }}>{l}</div>
                    </div>
                  ))}
                </div>
                {/* Mini schedule */}
                <div style={{ background: "#161616", borderRadius: 8, padding: "10px 12px", border: `1px solid ${COLORS.border}` }}>
                  <div style={{ fontSize: 10, fontWeight: 700, marginBottom: 8, fontFamily: "'Archivo Black', sans-serif" }}>Próximos Treinos</div>
                  {[["Seg 07:00", "Hipertrofia", true], ["Qua 07:00", "Hipertrofia", true], ["Sex 08:00", "Força", false]].map(([day, type, confirmed]) => (
                    <div key={day} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                      <span style={{ fontSize: 9, color: COLORS.muted }}>{day}</span>
                      <span style={{ fontSize: 9, fontWeight: 600 }}>{type}</span>
                      <span style={{ fontSize: 8, color: confirmed ? "#22c55e" : "#f59e0b", fontWeight: 700 }}>
                        {confirmed ? "✓ Confirmado" : "Pendente"}
                      </span>
                    </div>
                  ))}
                </div>
                {/* Mini progress */}
                <div style={{ background: "#161616", borderRadius: 8, padding: "10px 12px", border: `1px solid ${COLORS.border}` }}>
                  <div style={{ fontSize: 10, fontWeight: 700, marginBottom: 8, fontFamily: "'Archivo Black', sans-serif" }}>Evolução Física</div>
                  {[["Peso", 60], ["Gordura", 40], ["Músculo", 72]].map(([l, p]) => (
                    <div key={l} style={{ marginBottom: 5 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: COLORS.muted, marginBottom: 2 }}>
                        <span>{l}</span><span style={{ color: COLORS.accent }}>{p}%</span>
                      </div>
                      <div style={{ height: 3, background: "#2e2e2e", borderRadius: 2 }}>
                        <div style={{ width: `${p}%`, height: "100%", background: COLORS.accent, borderRadius: 2 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Features list below mockup */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 20 }}>
            {[
              { title: "Agendamento", desc: "Treinos sempre organizados" },
              { title: "Evolução", desc: "Métricas e gráficos detalhados" },
              { title: "Chat Direto", desc: "Comunicação em tempo real" },
              { title: "Pagamentos", desc: "Transações seguras integradas" },
            ].map((f) => (
              <div key={f.title} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.accent, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{f.title}</div>
                  <div style={{ fontSize: 11, color: COLORS.muted }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
function Sidebar({ role, active, setActive }) {
  const alunoItems = [
    { id: "dashboard", icon: "▪", label: "Início" },
    { id: "buscar", icon: "◎", label: "Buscar Personal" },
    { id: "agenda", icon: "▦", label: "Minha Agenda" },
    { id: "evolucao", icon: "↗", label: "Minha Evolução" },
    { id: "chat", icon: "◌", label: "Mensagens" },
  ];
  const personalItems = [
    { id: "dashboard", icon: "▪", label: "Início" },
    { id: "alunos", icon: "◈", label: "Meus Alunos" },
    { id: "agenda", icon: "▦", label: "Agenda" },
    { id: "treinos", icon: "◆", label: "Treinos" },
    { id: "chat", icon: "◌", label: "Mensagens" },
  ];
  const items = role === "aluno" ? alunoItems : personalItems;
  return (
    <div style={{
      width: 220, background: COLORS.card, borderRight: `1px solid ${COLORS.border}`,
      display: "flex", flexDirection: "column", padding: "24px 12px", flexShrink: 0
    }}>
      <div style={{ padding: "0 8px", marginBottom: 32 }}>
        <Logo />
        <div style={{
          marginTop: 12, padding: "6px 10px", background: "rgba(200,255,0,0.06)",
          borderRadius: 6, fontSize: 12, color: COLORS.accent, display: "inline-block"
        }}>
          {role === "aluno" ? "Aluno" : "Personal"}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
        {items.map((item) => (
          <button key={item.id} className={`nav-item ${active === item.id ? "active" : ""}`} onClick={() => setActive(item.id)}>
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
      <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 6px" }}>
          <div className="avatar" style={{ background: "#7c3aed", fontSize: 14 }}>
            {role === "aluno" ? "GR" : "CM"}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{role === "aluno" ? "Gabriel Rocha" : "Carlos Mendes"}</div>
            <div style={{ fontSize: 11, color: COLORS.muted }}>{role === "aluno" ? "Aluno" : "Personal Trainer"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
function AlunoDashboard() {
  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h2 style={{ fontSize: 26, fontWeight: 700, fontFamily: "'Archivo Black', sans-serif" }}>Bom dia, Gabriel.</h2>
        <p style={{ color: COLORS.muted, marginTop: 4 }}>Você tem 2 treinos essa semana.</p>
      </div>
      {/* Stats */}
      <div style={{ display: "flex", gap: 16 }}>
        {[
          { label: "Treinos no mês", value: "12", delta: "+3", color: "#22c55e" },
          { label: "Horas treinadas", value: "18h", delta: "+2h", color: "#22c55e" },
          { label: "Meta semanal", value: "80%", delta: "4/5 dias", color: "#f59e0b" },
          { label: "Personal", value: "Carlos M.", delta: "Ativo", color: "#22c55e" },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Archivo Black', sans-serif", letterSpacing: 1 }}>{s.value}</div>
            <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 4 }}>{s.label}</div>
            <div style={{ color: s.color, fontSize: 12, marginTop: 6, fontWeight: 500 }}>{s.delta}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Próximos treinos */}
        <div className="card">
          <div style={{ fontWeight: 700, fontFamily: "'Archivo Black', sans-serif", marginBottom: 16 }}>Próximos Treinos</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {SCHEDULE.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", background: "#161616", borderRadius: 8 }}>
                <div style={{
                  width: 40, height: 40, background: "rgba(200,255,0,0.1)", borderRadius: 8,
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
                }}>
                  <span style={{ color: COLORS.accent, fontSize: 11, fontWeight: 700 }}>{s.day}</span>
                  <span style={{ color: COLORS.muted, fontSize: 10 }}>{s.time}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{s.type}</div>
                  <div style={{ color: COLORS.muted, fontSize: 12 }}>com {s.trainer}</div>
                </div>
                <span className="tag" style={s.status === "pending" ? { background: "rgba(245,158,11,0.1)", color: "#f59e0b", borderColor: "rgba(245,158,11,0.2)" } : { background: "rgba(34,197,94,0.1)", color: "#22c55e", borderColor: "rgba(34,197,94,0.2)" }}>
                  {s.status === "confirmed" ? "✓ Confirmado" : "Pendente"}
                </span>
              </div>
            ))}
          </div>
        </div>
        {/* Evolução rápida */}
        <div className="card">
          <div style={{ fontWeight: 700, fontFamily: "'Archivo Black', sans-serif", marginBottom: 16 }}>Evolução Física</div>
          {[
            { label: "Peso", current: "78kg", goal: "72kg", progress: 60 },
            { label: "Gordura Corporal", current: "18%", goal: "12%", progress: 40 },
            { label: "Massa Muscular", current: "34kg", goal: "38kg", progress: 72 },
          ].map((m) => (
            <div key={m.label} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                <span style={{ color: COLORS.muted }}>{m.label}</span>
                <span style={{ fontWeight: 600 }}>{m.current} <span style={{ color: COLORS.muted, fontWeight: 400 }}>→ {m.goal}</span></span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${m.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function BuscarPersonal() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("todos");
  const filtered = TRAINERS.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.specialty.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 26, fontWeight: 700, fontFamily: "'Archivo Black', sans-serif" }}>Buscar Personal</h2>
        <p style={{ color: COLORS.muted, marginTop: 4 }}>Encontre o profissional ideal para seus objetivos</p>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <input placeholder="🔍  Buscar por nome, especialidade..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1 }} />
        <select style={{ width: 180 }} value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="todos">Todos</option>
          <option value="hipertrofia">Hipertrofia</option>
          <option value="emagrecimento">Emagrecimento</option>
          <option value="funcional">Funcional</option>
        </select>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {filtered.map((t) => (
          <div key={t.id} className="trainer-card">
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 14 }}>
              <div className="avatar" style={{ background: t.color, width: 52, height: 52, fontSize: 18 }}>{t.avatar}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 16 }}>{t.name}</div>
                <div style={{ color: COLORS.muted, fontSize: 13, marginTop: 2 }}>📍 {t.location}</div>
                <Stars rating={t.rating} />
                <span style={{ color: COLORS.muted, fontSize: 12 }}> ({t.reviews} avaliações)</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 22, color: "#22c55e" }}>R${t.price}</div>
                <div style={{ color: COLORS.muted, fontSize: 11 }}>/sessão</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
              {t.specialty.map(s => <span key={s} className="tag">{s}</span>)}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-accent" style={{ flex: 1, padding: "10px" }}>Contratar</button>
              <button className="btn-ghost" style={{ flex: 1, padding: "10px" }}>Ver Perfil</button>
            </div>
            {!t.available && (
              <div style={{ marginTop: 10, fontSize: 12, color: COLORS.red, textAlign: "center" }}>● Sem vagas no momento</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
function AlunoAgenda() {
  const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  const hours = ["06:00", "07:00", "08:00", "09:00", "10:00", "11:00"];
  const booked = { "Seg-07:00": "Hipertrofia", "Qua-07:00": "Hipertrofia", "Sex-08:00": "Força" };
  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 700, fontFamily: "'Archivo Black', sans-serif" }}>Minha Agenda</h2>
          <p style={{ color: COLORS.muted, marginTop: 4 }}>Semana de 28 Abr – 4 Mai 2026</p>
        </div>
        <button className="btn-accent">+ Agendar Treino</button>
      </div>
      <div className="card" style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ padding: "10px 12px", textAlign: "left", color: COLORS.muted, fontSize: 13, fontWeight: 500, width: 70 }}>Horário</th>
              {days.map(d => (
                <th key={d} style={{ padding: "10px 12px", textAlign: "center", color: COLORS.muted, fontSize: 13, fontWeight: 500 }}>{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hours.map(h => (
              <tr key={h} style={{ borderTop: `1px solid ${COLORS.border}` }}>
                <td style={{ padding: "10px 12px", color: COLORS.muted, fontSize: 13 }}>{h}</td>
                {days.map(d => {
                  const key = `${d}-${h}`;
                  const ev = booked[key];
                  return (
                    <td key={d} style={{ padding: "6px 8px", textAlign: "center" }}>
                      {ev ? (
                        <div style={{
                          background: "rgba(200,255,0,0.12)",
                          border: `1px solid rgba(200,255,0,0.3)`,
                          color: COLORS.accent,
                          borderRadius: 6,
                          padding: "6px 4px",
                          fontSize: 12,
                          fontWeight: 600,
                        }}>{ev}</div>
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
function AlunoEvolucao() {
  const weeks = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"];
  const pesoData = [82, 81, 80.5, 79.5, 79, 78.5, 78, 78];
  const maxPeso = 84;
  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 26, fontWeight: 700, fontFamily: "'Archivo Black', sans-serif" }}>Minha Evolução</h2>
        <p style={{ color: COLORS.muted, marginTop: 4 }}>Acompanhe seu progresso ao longo do tempo</p>
      </div>
      <div style={{ display: "flex", gap: 16 }}>
        {[
          { label: "Peso Atual", value: "78 kg", delta: "▼ 4kg desde o início", good: true },
          { label: "IMC", value: "24.2", delta: "Normal", good: true },
          { label: "Gordura", value: "18%", delta: "▼ 2% este mês", good: true },
          { label: "Treinos", value: "12", delta: "este mês", good: null },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div style={{ color: COLORS.muted, fontSize: 12, marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 28, letterSpacing: 1 }}>{s.value}</div>
            <div style={{ fontSize: 12, marginTop: 4, color: s.good === true ? "#22c55e" : s.good === false ? "#ef4444" : COLORS.muted }}>{s.delta}</div>
          </div>
        ))}
      </div>
      {/* Chart */}
      <div className="card">
        <div style={{ fontWeight: 700, fontFamily: "'Archivo Black', sans-serif", marginBottom: 20 }}>Peso Corporal (kg) — últimas 8 semanas</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 160 }}>
          {pesoData.map((v, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 11, color: COLORS.muted }}>{v}</span>
              <div style={{
                width: "100%",
                height: `${((v - 76) / (maxPeso - 76)) * 120}px`,
                background: i === pesoData.length - 1 ? COLORS.accent : "rgba(200,255,0,0.25)",
                borderRadius: "4px 4px 0 0",
                transition: "height 0.4s",
              }} />
              <span style={{ fontSize: 11, color: COLORS.muted }}>{weeks[i]}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Medidas */}
      <div className="card">
        <div style={{ fontWeight: 700, fontFamily: "'Archivo Black', sans-serif", marginBottom: 16 }}>Medidas Corporais</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {[
            ["Peito", "98cm", "+2cm", false],
            ["Braço", "35cm", "+1.5cm", false],
            ["Cintura", "82cm", "-3cm", true],
            ["Quadril", "94cm", "-1cm", true],
            ["Coxa", "56cm", "+2cm", false],
            ["Panturrilha", "37cm", "+0.5cm", false],
          ].map(([label, val, delta, goodIfNegative]) => {
            const isPositive = delta.startsWith("+");
            const isGood = goodIfNegative ? !isPositive : isPositive;
            return (
            <div key={label} style={{ background: "#161616", borderRadius: 8, padding: "12px 14px" }}>
              <div style={{ color: COLORS.muted, fontSize: 12 }}>{label}</div>
              <div style={{ fontWeight: 700, fontSize: 18, marginTop: 2 }}>{val}</div>
              <div style={{ fontSize: 12, color: isGood ? "#22c55e" : "#ef4444", marginTop: 2 }}>{delta}</div>
            </div>
          )})}
        </div>
      </div>
    </div>
  );
}
function ChatView({ role }) {
  const [msg, setMsg] = useState("");
  const [msgs, setMsgs] = useState(MESSAGES);
  const send = () => {
    if (!msg.trim()) return;
    setMsgs(prev => [...prev, { from: "me", text: msg, time: "agora" }]);
    setMsg("");
  };
  return (
    <div className="fade-in" style={{ display: "flex", gap: 16, height: "calc(100vh - 160px)" }}>
      {/* Conversations list */}
      <div className="card" style={{ width: 220, display: "flex", flexDirection: "column", gap: 4, padding: 12, overflowY: "auto" }}>
        <div style={{ fontWeight: 600, padding: "4px 8px", marginBottom: 8 }}>Conversas</div>
        {(role === "aluno" ? TRAINERS.slice(0, 3) : STUDENTS).map((p, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "10px 8px",
            background: i === 0 ? "#161616" : "transparent",
            borderRadius: 8, cursor: "pointer",
          }}>
            <div className="avatar" style={{ background: p.color, fontSize: 13, width: 36, height: 36 }}>{p.avatar}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{p.name}</div>
              <div style={{ fontSize: 11, color: COLORS.muted }}>Ativo hoje</div>
            </div>
            {i === 0 && <div className="badge">2</div>}
          </div>
        ))}
      </div>
      {/* Chat window */}
      <div className="card" style={{ flex: 1, display: "flex", flexDirection: "column", padding: 0, overflow: "hidden" }}>
        {/* Header */}
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", gap: 12 }}>
          <div className="avatar" style={{ background: "#7c3aed", fontSize: 14 }}>CM</div>
          <div>
            <div style={{ fontWeight: 600 }}>Carlos Mendes</div>
            <div style={{ fontSize: 12, color: COLORS.accent }}><span className="pulse">●</span> Online</div>
          </div>
        </div>
        {/* Messages */}
        <div style={{ flex: 1, padding: 20, display: "flex", flexDirection: "column", gap: 12, overflowY: "auto" }}>
          {msgs.map((m, i) => {
            const isMe = role === "personal" ? m.from === "trainer" : m.from === "me";
            return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start" }}>
              <div className={isMe ? "chat-bubble-me" : "chat-bubble-other"}>{m.text}</div>
              <span style={{ fontSize: 11, color: COLORS.muted, marginTop: 4 }}>{m.time}</span>
            </div>
          )})}
        </div>
        {/* Input */}
        <div style={{ padding: "14px 20px", borderTop: `1px solid ${COLORS.border}`, display: "flex", gap: 10 }}>
          <input placeholder="Digite uma mensagem..." value={msg} onChange={e => setMsg(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()} />
          <button className="btn-accent" onClick={send} style={{ padding: "10px 20px", flexShrink: 0 }}>Enviar</button>
        </div>
      </div>
    </div>
  );
}
function PersonalDashboard() {
  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h2 style={{ fontSize: 26, fontWeight: 700, fontFamily: "'Archivo Black', sans-serif" }}>Olá, Carlos.</h2>
        <p style={{ color: COLORS.muted, marginTop: 4 }}>Você tem 3 sessões hoje.</p>
      </div>
      <div style={{ display: "flex", gap: 16 }}>
        {[
          { label: "Alunos Ativos", value: "24", delta: "+2 este mês" },
          { label: "Sessões esta semana", value: "18", delta: "Seg–Sex" },
          { label: "Avaliação Média", value: "4.8", delta: "312 avaliações" },
          { label: "Faturamento Mês", value: "R$4.320", delta: "+12% vs último" },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Archivo Black', sans-serif" }}>{s.value}</div>
            <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 4 }}>{s.label}</div>
            <div style={{ color: "#22c55e", fontSize: 12, marginTop: 6 }}>{s.delta}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Agenda hoje */}
        <div className="card">
          <div style={{ fontWeight: 700, fontFamily: "'Archivo Black', sans-serif", marginBottom: 16 }}>Sessões de Hoje</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { time: "07:00", student: "Gabriel Rocha", type: "Hipertrofia", status: "done" },
              { time: "09:00", student: "Pedro Ávila", type: "Cardio", status: "now" },
              { time: "17:00", student: "Henry Bertolatti", type: "Força", status: "upcoming" },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", background: "#161616", borderRadius: 8 }}>
                <div style={{ color: COLORS.muted, fontSize: 13, width: 44, flexShrink: 0 }}>{s.time}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{s.student}</div>
                  <div style={{ color: COLORS.muted, fontSize: 12 }}>{s.type}</div>
                </div>
                <span className="tag" style={
                  s.status === "done" ? { background: "rgba(34,197,94,0.1)", color: "#22c55e", borderColor: "rgba(34,197,94,0.2)" } :
                  s.status === "now" ? { background: "rgba(200,255,0,0.15)", color: COLORS.accent } :
                  { background: "rgba(68,136,255,0.1)", color: COLORS.blue, borderColor: "rgba(68,136,255,0.2)" }
                }>
                  {s.status === "done" ? "Concluído" : s.status === "now" ? "Em andamento" : "Próximo"}
                </span>
              </div>
            ))}
          </div>
        </div>
        {/* Alunos recentes */}
        <div className="card">
          <div style={{ fontWeight: 700, fontFamily: "'Archivo Black', sans-serif", marginBottom: 16 }}>Progresso dos Alunos</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {STUDENTS.map((s) => (
              <div key={s.name}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div className="avatar" style={{ background: s.color, width: 28, height: 28, fontSize: 11 }}>{s.avatar}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{s.name}</div>
                      <div style={{ fontSize: 11, color: COLORS.muted }}>{s.goal}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.accent }}>{s.progress}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${s.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
function MeusAlunos() {
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
        {STUDENTS.map((s) => (
          <div key={s.name} className="trainer-card">
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
              <div className="avatar" style={{ background: s.color, width: 52, height: 52, fontSize: 18 }}>{s.avatar}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 16 }}>{s.name}</div>
                <span className="tag">{s.goal}</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 24, color: COLORS.accent }}>{s.sessions}</div>
                <div style={{ fontSize: 11, color: COLORS.muted }}>sessões</div>
              </div>
            </div>
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: COLORS.muted, marginBottom: 6 }}>
                <span>Progresso da meta</span><span style={{ color: COLORS.accent, fontWeight: 600 }}>{s.progress}%</span>
              </div>
              <div className="progress-bar"><div className="progress-fill" style={{ width: `${s.progress}%` }} /></div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn-ghost" style={{ flex: 1, padding: "8px" }}>Ver Treinos</button>
              <button className="btn-accent" style={{ flex: 1, padding: "8px" }}>Evolução</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
function Treinos() {
  const [selected, setSelected] = useState(null);
  const treinos = [
    {
      name: "Hipertrofia A – Peito/Tríceps",
      student: "Gabriel Rocha",
      exercises: [
        { name: "Supino Reto", sets: 4, reps: "8-10", load: "60kg" },
        { name: "Crucifixo", sets: 3, reps: "12", load: "14kg" },
        { name: "Tríceps Pulley", sets: 4, reps: "12-15", load: "25kg" },
        { name: "Mergulho", sets: 3, reps: "10", load: "Peso corporal" },
      ]
    },
    {
      name: "Funcional – Emagrecimento",
      student: "Pedro Ávila",
      exercises: [
        { name: "Agachamento Livre", sets: 3, reps: "20", load: "30kg" },
        { name: "Burpee", sets: 4, reps: "15", load: "—" },
        { name: "Kettlebell Swing", sets: 3, reps: "20", load: "16kg" },
      ]
    },
  ];
  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 700, fontFamily: "'Archivo Black', sans-serif" }}>Treinos</h2>
          <p style={{ color: COLORS.muted, marginTop: 4 }}>Gerencie os treinos dos seus alunos</p>
        </div>
        <button className="btn-accent">+ Criar Treino</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {treinos.map((t, i) => (
          <div key={i} className="card" style={{ cursor: "pointer" }} onClick={() => setSelected(selected === i ? null : i)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 600 }}>{t.name}</div>
                <div style={{ color: COLORS.muted, fontSize: 13, marginTop: 4 }}>Aluno: {t.student}</div>
              </div>
              <span style={{ color: COLORS.accent }}>{selected === i ? "▲" : "▼"}</span>
            </div>
            {selected === i && (
              <div style={{ marginTop: 16, borderTop: `1px solid ${COLORS.border}`, paddingTop: 16 }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      {["Exercício", "Séries", "Reps", "Carga"].map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "6px 12px", color: COLORS.muted, fontSize: 12, fontWeight: 500 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {t.exercises.map((e, j) => (
                      <tr key={j} style={{ borderTop: `1px solid ${COLORS.border}` }}>
                        <td style={{ padding: "10px 12px", fontWeight: 500 }}>{e.name}</td>
                        <td style={{ padding: "10px 12px", color: COLORS.muted }}>{e.sets}</td>
                        <td style={{ padding: "10px 12px", color: COLORS.muted }}>{e.reps}</td>
                        <td style={{ padding: "10px 12px" }}><span className="tag">{e.load}</span></td>
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
export default function App() {
  const [screen, setScreen] = useState("landing");
  const [role, setRole] = useState(null);
  const [view, setView] = useState("dashboard");
  const handleLogin = (r) => { setRole(r); setScreen("app"); setView("dashboard"); };
  if (screen === "landing") return (
    <>
      <style>{styles}</style>
      <Landing onLogin={handleLogin} />
    </>
  );
  const renderView = () => {
    if (role === "aluno") {
      if (view === "dashboard") return <AlunoDashboard />;
      if (view === "buscar") return <BuscarPersonal />;
      if (view === "agenda") return <AlunoAgenda />;
      if (view === "evolucao") return <AlunoEvolucao />;
      if (view === "chat") return <ChatView role="aluno" />;
    } else {
      if (view === "dashboard") return <PersonalDashboard />;
      if (view === "alunos") return <MeusAlunos />;
      if (view === "agenda") return <AlunoAgenda />;
      if (view === "treinos") return <Treinos />;
      if (view === "chat") return <ChatView role="personal" />;
    }
  };
  return (
    <>
      <style>{styles}</style>
      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        <Sidebar role={role} active={view} setActive={setView} />
        {/* Top bar */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{
            padding: "0 32px", height: 60, display: "flex", alignItems: "center",
            justifyContent: "space-between", borderBottom: `1px solid ${COLORS.border}`,
            background: COLORS.card, flexShrink: 0
          }}>
            <div style={{ color: COLORS.muted, fontSize: 14 }}>
              Segunda-feira, 4 de Maio de 2026
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <button style={{ background: "none", border: `1px solid ${COLORS.border}`, color: COLORS.muted, cursor: "pointer", fontSize: 14, width: 34, height: 34, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>○</button>
              <button className="btn-ghost" style={{ fontSize: 13, padding: "6px 16px" }}
                onClick={() => { setScreen("landing"); setRole(null); }}>
                Sair
              </button>
            </div>
          </div>
          {/* Content */}
          <div style={{ flex: 1, overflowY: "auto", padding: 32 }}>
            {renderView()}
          </div>
        </div>
      </div>
    </>
  );
}
