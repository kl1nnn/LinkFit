import Logo from "../components/Logo";
import { COLORS } from "../constants/theme";

const quickStats = [
  ["42", "Alunos cadastrados"],
  ["8", "Personals parceiros"],
  ["4.7", "Media de avaliacao"],
];

const features = [
  { title: "Agenda", desc: "Treinos da semana em um lugar" },
  { title: "Evolucao", desc: "Peso, medidas e progresso" },
  { title: "Chat", desc: "Contato direto com o personal" },
  { title: "Pagamentos", desc: "Registro simples das sessoes" },
];

export default function Landing({ onLogin }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <nav style={{ padding: "20px 60px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${COLORS.border}` }}>
        <Logo />
        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn-ghost" onClick={() => onLogin("aluno")}>Entrar como Aluno</button>
          <button className="btn-accent" onClick={() => onLogin("personal")}>Sou Personal</button>
        </div>
      </nav>

      <main style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, padding: "80px 60px", alignItems: "center" }}>
        <section>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ width: 3, height: 18, background: COLORS.accent, borderRadius: 2, animation: "cursorBlink 1s step-end infinite" }} />
            <span style={{ fontSize: 13, color: COLORS.muted, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Projeto academico UMC
            </span>
          </div>
          <h1 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 76, lineHeight: 0.95, letterSpacing: 1, marginBottom: 24 }}>
            LinkFit
            <br />
            <span style={{ color: COLORS.accent }}>treinos mais proximos</span>
          </h1>
          <p style={{ color: COLORS.muted, fontSize: 18, lineHeight: 1.7, marginBottom: 40, maxWidth: 470 }}>
            Um prototipo para aproximar alunos e personal trainers da regiao, com agenda, acompanhamento fisico e mensagens no mesmo painel.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button className="btn-accent" style={{ fontSize: 16, padding: "14px 36px" }} onClick={() => onLogin("aluno")}>
              Acessar como aluno
            </button>
            <button className="btn-ghost" style={{ fontSize: 16 }} onClick={() => onLogin("personal")}>
              Acessar como personal
            </button>
          </div>
          <div style={{ display: "flex", gap: 32, marginTop: 48 }}>
            {quickStats.map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 32, color: COLORS.accent }}>{n}</div>
                <div style={{ color: COLORS.muted, fontSize: 13 }}>{l}</div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ position: "relative" }}>
          <div style={{ position: "absolute", inset: -20, background: `radial-gradient(ellipse at center, ${COLORS.accent}22 0%, transparent 70%)`, borderRadius: 24, zIndex: 0 }} />
          <div style={{ position: "relative", zIndex: 1, background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, overflow: "hidden", boxShadow: `0 32px 80px -20px rgba(0,0,0,0.8), 0 0 0 1px ${COLORS.border}` }}>
            <div style={{ padding: "10px 16px", background: "#161616", display: "flex", alignItems: "center", gap: 6, borderBottom: `1px solid ${COLORS.border}` }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
              <div style={{ flex: 1, marginLeft: 8, background: "#1e1e1e", borderRadius: 4, padding: "3px 10px", fontSize: 11, color: COLORS.muted }}>
                linkfit.local/dashboard
              </div>
            </div>
            <div style={{ display: "flex", height: 340 }}>
              <div style={{ width: 120, background: "#161616", borderRight: `1px solid ${COLORS.border}`, padding: "14px 10px", display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 8px", marginBottom: 8 }}>
                  <span style={{ color: COLORS.accent, fontSize: 14 }}>*</span>
                  <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 11, letterSpacing: 1 }}>LinkFit</span>
                </div>
                {["Inicio", "Buscar", "Agenda", "Evolucao", "Chat"].map((item, i) => (
                  <div key={item} style={{ padding: "5px 8px", borderRadius: 5, fontSize: 10, background: i === 0 ? `rgba(224,112,64,0.1)` : "transparent", color: i === 0 ? COLORS.accent : COLORS.muted }}>
                    {item}
                  </div>
                ))}
              </div>
              <div style={{ flex: 1, padding: 14, display: "flex", flexDirection: "column", gap: 10, overflowY: "hidden" }}>
                <div style={{ fontSize: 13, fontFamily: "'Archivo Black', sans-serif" }}>Bom dia, Gabriel.</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
                  {[["12", "Treinos"], ["18h", "Horas"], ["80%", "Meta"]].map(([v, l]) => (
                    <div key={l} style={{ background: "#161616", borderRadius: 6, padding: "8px 10px", border: `1px solid ${COLORS.border}` }}>
                      <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Archivo Black', sans-serif" }}>{v}</div>
                      <div style={{ fontSize: 9, color: COLORS.muted }}>{l}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background: "#161616", borderRadius: 8, padding: "10px 12px", border: `1px solid ${COLORS.border}` }}>
                  <div style={{ fontSize: 10, fontWeight: 700, marginBottom: 8, fontFamily: "'Archivo Black', sans-serif" }}>Proximos treinos</div>
                  {[["Seg 07:00", "Hipertrofia", true], ["Qua 07:00", "Hipertrofia", true], ["Sex 08:00", "Forca", false]].map(([day, type, confirmed]) => (
                    <div key={day} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                      <span style={{ fontSize: 9, color: COLORS.muted }}>{day}</span>
                      <span style={{ fontSize: 9, fontWeight: 600 }}>{type}</span>
                      <span style={{ fontSize: 8, color: confirmed ? "#22c55e" : "#f59e0b", fontWeight: 700 }}>{confirmed ? "Confirmado" : "Pendente"}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: "#161616", borderRadius: 8, padding: "10px 12px", border: `1px solid ${COLORS.border}` }}>
                  <div style={{ fontSize: 10, fontWeight: 700, marginBottom: 8, fontFamily: "'Archivo Black', sans-serif" }}>Evolucao fisica</div>
                  {[["Peso", 60], ["Gordura", 40], ["Musculo", 72]].map(([l, p]) => (
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
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 20 }}>
            {features.map((feature) => (
              <div key={feature.title} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.accent, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{feature.title}</div>
                  <div style={{ fontSize: 11, color: COLORS.muted }}>{feature.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
