import Logo from "./Logo";
import Avatar from "./Avatar";
import { COLORS } from "../constants/theme";
import { STUDENTS, TRAINERS } from "../data/mockData";

const alunoItems = [
  { id: "dashboard", label: "Início" },
  { id: "buscar", label: "Buscar Personal" },
  { id: "agenda", label: "Minha Agenda" },
  { id: "evolucao", label: "Minha Evolução" },
  { id: "chat", label: "Mensagens" },
  { id: "configuracoes", label: "Configurações" },
];

const personalItems = [
  { id: "dashboard", label: "Início" },
  { id: "alunos", label: "Meus Alunos" },
  { id: "agenda", label: "Agenda" },
  { id: "treinos", label: "Treinos" },
  { id: "chat", label: "Mensagens" },
  { id: "configuracoes", label: "Configurações" },
];

export default function Sidebar({ role, active, setActive, userProfile }) {
  const items = role === "aluno" ? alunoItems : personalItems;
  const user = userProfile ?? (role === "aluno" ? STUDENTS[0] : TRAINERS[0]);

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <Logo />
        <div className="sidebar-role">
          {role === "aluno" ? "Aluno" : "Personal"}
        </div>
      </div>

      <nav className="sidebar-nav">
        {items.map((item) => (
          <button key={item.id} className={`nav-item ${active === item.id ? "active" : ""}`} onClick={() => setActive(item.id)}>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-user">
        <div className="sidebar-user-row">
          <Avatar person={user} size={42} fontSize={14} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{user.name}</div>
            <div style={{ fontSize: 11, color: COLORS.muted }}>{role === "aluno" ? "Aluno" : "Personal Trainer"}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
