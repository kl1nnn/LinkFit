import Avatar from "../components/Avatar";
import PageHeader from "../components/PageHeader";
import { COLORS } from "../constants/theme";

const weeks = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"];
const defaultMeasurements = [
  { label: "Peito", value: "98cm", delta: "+2cm" },
  { label: "Braço", value: "35cm", delta: "+1,5cm" },
  { label: "Cintura", value: "82cm", delta: "-3cm", goodIfNegative: true },
  { label: "Quadril", value: "94cm", delta: "-1cm", goodIfNegative: true },
  { label: "Coxa", value: "56cm", delta: "+2cm" },
  { label: "Panturrilha", value: "37cm", delta: "+0,5cm" },
];
const defaultEvolution = { weightHistory: [82, 81, 80.5, 79.5, 79, 78.5, 78, 78], bmi: "24.2", bodyFat: "18%", measurements: defaultMeasurements };

const formatWeight = (weight) => weight.toLocaleString("pt-BR", { maximumFractionDigits: 1 });

export default function AlunoEvolucao({ student, onBack }) {
  const evolution = student?.evolution ?? defaultEvolution;
  const pesoData = evolution.weightHistory;
  const measurements = evolution.measurements ?? defaultMeasurements;
  const currentWeight = pesoData.at(-1);
  const weightDelta = currentWeight - pesoData[0];
  const minPeso = Math.min(...pesoData) - 1;
  const maxPeso = Math.max(...pesoData) + 1;

  return (
    <div className="page fade-in">
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {student && <Avatar person={student} size={56} fontSize={18} />}
        <PageHeader
          title={student ? `Evolução de ${student.name}` : "Minha Evolução"}
          subtitle={student ? `Acompanhamento individual - ${student.goal}` : "Resumo das últimas oito semanas."}
        >
          {onBack && <button className="btn-ghost" onClick={onBack} style={{ padding: "8px 14px" }}>Voltar para alunos</button>}
        </PageHeader>
      </div>
      <div style={{ display: "flex", gap: 16 }}>
        {[
          { label: "Peso atual", value: `${formatWeight(currentWeight)} kg`, delta: `${weightDelta > 0 ? "+" : ""}${formatWeight(weightDelta)} kg desde o início`, good: weightDelta <= 0 },
          { label: "IMC", value: evolution.bmi, delta: "Acompanhado", good: true },
          { label: "Gordura", value: evolution.bodyFat, delta: "Composição corporal", good: true },
          student ? { label: "Progresso da meta", value: `${student.progress}%`, delta: `${student.sessions} sessões registradas`, good: null } : { label: "Treinos", value: "11", delta: "este mês", good: null },
        ].map((stat) => (
          <div key={stat.label} className="stat-card">
            <div style={{ color: COLORS.muted, fontSize: 12, marginBottom: 8 }}>{stat.label}</div>
            <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 28, letterSpacing: 1 }}>{stat.value}</div>
            <div style={{ fontSize: 12, marginTop: 4, color: stat.good === true ? "#22c55e" : stat.good === false ? "#ef4444" : COLORS.muted }}>{stat.delta}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="section-title" style={{ marginBottom: 20 }}>Peso corporal (kg) - últimas 8 semanas</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 160 }}>
          {pesoData.map((value, index) => (
            <div key={weeks[index]} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 11, color: COLORS.muted }}>{value}</span>
              <div style={{ width: "100%", height: `${20 + ((value - minPeso) / (maxPeso - minPeso)) * 100}px`, background: index === pesoData.length - 1 ? COLORS.accent : "rgba(224,112,64,0.25)", borderRadius: "4px 4px 0 0", transition: "height 0.4s" }} />
              <span style={{ fontSize: 11, color: COLORS.muted }}>{weeks[index]}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <div className="section-title">Medidas corporais</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {measurements.map(({ label, value, delta, goodIfNegative = false }) => {
            const isPositive = delta.startsWith("+");
            const isNeutral = delta.startsWith("0");
            const isGood = isNeutral ? null : goodIfNegative ? !isPositive : isPositive;
            const deltaColor = isGood === null ? COLORS.muted : isGood ? "#22c55e" : "#ef4444";

            return (
              <div key={label} style={{ background: "#161616", borderRadius: 8, padding: "12px 14px" }}>
                <div style={{ color: COLORS.muted, fontSize: 12 }}>{label}</div>
                <div style={{ fontWeight: 700, fontSize: 18, marginTop: 2 }}>{value}</div>
                <div style={{ fontSize: 12, color: deltaColor, marginTop: 2 }}>{delta}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
