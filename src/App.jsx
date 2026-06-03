import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import { COLORS } from "./constants/theme";
import { BOOKINGS, CURRENT_PERSONAL_PROFILE, HIRE_REQUESTS, STUDENTS, WORKOUTS } from "./data/mockData";
import usePersistedState from "./hooks/usePersistedState";
import AlunoAgenda from "./pages/AlunoAgenda";
import AlunoDashboard from "./pages/AlunoDashboard";
import AlunoEvolucao from "./pages/AlunoEvolucao";
import BuscarPersonal from "./pages/BuscarPersonal";
import ChatView from "./pages/ChatView";
import Configuracoes from "./pages/Configuracoes";
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

const storedRole = localStorage.getItem("linkfit-role");
const storedView = localStorage.getItem("linkfit-view");
const storedStudent = localStorage.getItem("linkfit-selected-student");

export default function App() {
  const [screen, setScreen] = useState(storedRole ? "app" : "landing");
  const [role, setRole] = useState(storedRole);
  const [view, setView] = useState(storedView ?? "dashboard");
  const [students, setStudents] = usePersistedState("linkfit-students", STUDENTS);
  const [workouts, setWorkouts] = usePersistedState("linkfit-workouts", WORKOUTS);
  const [bookings, setBookings] = usePersistedState("linkfit-bookings", BOOKINGS);
  const [hiredTrainerIds, setHiredTrainerIds] = usePersistedState("linkfit-hired-trainers", []);
  const [hireRequests, setHireRequests] = usePersistedState("linkfit-hire-requests-v3", HIRE_REQUESTS);
  const [personalProfile, setPersonalProfile] = usePersistedState("linkfit-personal-profile-v2", CURRENT_PERSONAL_PROFILE);
  const [selectedStudentName, setSelectedStudentName] = useState(storedStudent);
  const todayLabel = formatToday();
  const studentProfile = students[0] ?? STUDENTS[0];
  const selectedStudent = students.find((student) => student.name === selectedStudentName);

  useEffect(() => {
    if (role) localStorage.setItem("linkfit-role", role);
  }, [role]);

  useEffect(() => {
    if (screen === "app") localStorage.setItem("linkfit-view", view);
  }, [screen, view]);

  useEffect(() => {
    if (selectedStudentName) {
      localStorage.setItem("linkfit-selected-student", selectedStudentName);
    } else {
      localStorage.removeItem("linkfit-selected-student");
    }
  }, [selectedStudentName]);

  const handleLogin = (selectedRole) => {
    setRole(selectedRole);
    setScreen("app");
    setView("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("linkfit-role");
    localStorage.removeItem("linkfit-view");
    localStorage.removeItem("linkfit-selected-student");
    setScreen("landing");
    setRole(null);
    setView("dashboard");
    setSelectedStudentName(null);
  };

  const openStudentView = (student, nextView) => {
    setSelectedStudentName(student.name);
    setView(nextView);
  };

  const handleSidebarView = (nextView) => {
    setSelectedStudentName(null);
    setView(nextView);
  };

  if (screen === "landing") {
    return <Landing onLogin={handleLogin} />;
  }

  const views = role === "aluno"
    ? {
        dashboard: <AlunoDashboard student={studentProfile} bookings={bookings} />,
        buscar: <BuscarPersonal studentProfile={studentProfile} hiredTrainerIds={hiredTrainerIds} hireRequests={hireRequests} setHireRequests={setHireRequests} />,
        agenda: <AlunoAgenda role="aluno" bookings={bookings} currentStudentName={studentProfile.name} />,
        evolucao: <AlunoEvolucao />,
        chat: <ChatView role="aluno" students={students} />,
        configuracoes: <Configuracoes role="aluno" studentProfile={studentProfile} setStudents={setStudents} setBookings={setBookings} setWorkouts={setWorkouts} />,
      }
    : {
        dashboard: <PersonalDashboard students={students} bookings={bookings} personalProfile={personalProfile} hireRequests={hireRequests} setHireRequests={setHireRequests} setHiredTrainerIds={setHiredTrainerIds} />,
        alunos: <MeusAlunos students={students} setStudents={setStudents} onViewWorkouts={(student) => openStudentView(student, "treinos")} onViewEvolution={(student) => openStudentView(student, "aluno-evolucao")} />,
        agenda: <AlunoAgenda role="personal" students={students} bookings={bookings} setBookings={setBookings} />,
        treinos: <Treinos students={students} workouts={workouts} setWorkouts={setWorkouts} selectedStudentName={selectedStudentName} />,
        "aluno-evolucao": <AlunoEvolucao student={selectedStudent} onBack={() => setView("alunos")} />,
        chat: <ChatView role="personal" students={students} />,
        configuracoes: <Configuracoes role="personal" personalProfile={personalProfile} setPersonalProfile={setPersonalProfile} />,
      };

  return (
    <div className="app-shell">
      <Sidebar role={role} active={view === "aluno-evolucao" ? "alunos" : view} setActive={handleSidebarView} userProfile={role === "aluno" ? studentProfile : personalProfile} />
      <div className="app-content">
        <header className="app-header">
          <div style={{ color: COLORS.muted, fontSize: 14 }}>{todayLabel}</div>
          <div className="app-header-actions">
            <button className="notification-button" title="Notificações">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 4a5 5 0 0 0-5 5v4.5l-1.7 2.7A1 1 0 0 0 6.2 18h11.6a1 1 0 0 0 .9-1.5L17 13.5V9a5 5 0 0 0-5-5Z" />
                <path d="M10 20h4" />
                <path d="M9.5 3.5A2.5 2.5 0 0 1 12 2a2.5 2.5 0 0 1 2.5 1.5" />
                <path d="M4.5 7.5c-1 1.6-1.3 3.2-1.1 5" />
                <path d="M19.5 7.5c1 1.6 1.3 3.2 1.1 5" />
              </svg>
            </button>
            <button className="btn-ghost" style={{ fontSize: 13, padding: "6px 16px" }} onClick={handleLogout}>
              Sair
            </button>
          </div>
        </header>
        <main className="app-main">
          {views[view] ?? views.dashboard}
        </main>
      </div>
    </div>
  );
}
