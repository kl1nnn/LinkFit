import { useState } from "react";
import Sidebar from "./components/Sidebar";
import { COLORS } from "./constants/theme";
import AlunoAgenda from "./pages/AlunoAgenda";
import AlunoDashboard from "./pages/AlunoDashboard";
import AlunoEvolucao from "./pages/AlunoEvolucao";
import BuscarPersonal from "./pages/BuscarPersonal";
import ChatView from "./pages/ChatView";
import Landing from "./pages/Landing";
import MeusAlunos from "./pages/MeusAlunos";
import PersonalDashboard from "./pages/PersonalDashboard";
import Treinos from "./pages/Treinos";

const formatToday = () => {
  const formatted = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [role, setRole] = useState(null);
  const [view, setView] = useState("dashboard");
  const todayLabel = formatToday();

  const handleLogin = (selectedRole) => {
    setRole(selectedRole);
    setScreen("app");
    setView("dashboard");
  };

  const handleLogout = () => {
    setScreen("landing");
    setRole(null);
  };

  if (screen === "landing") {
    return <Landing onLogin={handleLogin} />;
  }

  const views = role === "aluno"
    ? {
        dashboard: <AlunoDashboard />,
        buscar: <BuscarPersonal />,
        agenda: <AlunoAgenda />,
        evolucao: <AlunoEvolucao />,
        chat: <ChatView role="aluno" />,
      }
    : {
        dashboard: <PersonalDashboard />,
        alunos: <MeusAlunos />,
        agenda: <AlunoAgenda />,
        treinos: <Treinos />,
        chat: <ChatView role="personal" />,
      };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar role={role} active={view} setActive={setView} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <header style={{
          padding: "0 32px", height: 60, display: "flex", alignItems: "center",
          justifyContent: "space-between", borderBottom: `1px solid ${COLORS.border}`,
          background: COLORS.card, flexShrink: 0,
        }}>
          <div style={{ color: COLORS.muted, fontSize: 14 }}>{todayLabel}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button title="Notificações" style={{ background: "none", border: `1px solid ${COLORS.border}`, color: COLORS.muted, cursor: "pointer", fontSize: 14, width: 34, height: 34, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              !
            </button>
            <button className="btn-ghost" style={{ fontSize: 13, padding: "6px 16px" }} onClick={handleLogout}>
              Sair
            </button>
          </div>
        </header>
        <main style={{ flex: 1, overflowY: "auto", padding: 32 }}>
          {views[view] ?? views.dashboard}
        </main>
      </div>
    </div>
  );
}
