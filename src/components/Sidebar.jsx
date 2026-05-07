import Logo from "./Logo";
import { COLORS } from "../constants/theme";

const alunoItems = [
  { id: "dashboard", icon: "•", label: "Inicio" },
  { id: "buscar", icon: "⌕", label: "Buscar Personal" },
  { id: "agenda", icon: "□", label: "Minha Agenda" },
  { id: "evolucao", icon: "↗", label: "Minha Evolucao" },
  { id: "chat", icon: "○", label: "Mensagens" },
];

const personalItems = [
  { id: "dashboard", icon: "•", label: "Inicio" },
  { id: "alunos", icon: "●", label: "Meus Alunos" },
  { id: "agenda", icon: "□", label: "Agenda" },
  { id: "treinos", icon: "◆", label: "Treinos" },
  { id: "chat", icon: "○", label: "Mensagens" },
];

export default function Sidebar({ role, active, setActive }) {
  const items = role === "aluno" ? alunoItems : personalItems;

  return (
    <aside style={{
      width: 220, background: COLORS.card, borderRight: `1px solid ${COLORS.border}`,
      display: "flex", flexDirection: "column", padding: "24px 12px", flexShrink: 0,
    }}>
      <div style={{ padding: "0 8px", marginBottom: 32 }}>
        <Logo />
        <div style={{
          marginTop: 12, padding: "6px 10px", background: "rgba(224,112,64,0.08)",
          borderRadius: 6, fontSize: 12, color: COLORS.accent, display: "inline-block",
        }}>
          {role === "aluno" ? "Aluno" : "Personal"}
        </div>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
        {items.map((item) => (
          <button key={item.id} className={`nav-item ${active === item.id ? "active" : ""}`} onClick={() => setActive(item.id)}>
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

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
    </aside>
  );
}
