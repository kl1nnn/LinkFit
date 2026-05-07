export const TRAINERS = [
  { id: 1, name: "Carlos Mendes", specialty: ["Hipertrofia", "Forca"], price: 110, rating: 4.7, reviews: 18, location: "Mogi das Cruzes", avatar: "CM", color: "#7c3aed", available: true },
  { id: 2, name: "Ana Ferreira", specialty: ["Emagrecimento", "Funcional"], price: 95, rating: 4.8, reviews: 22, location: "Suzano", avatar: "AF", color: "#0891b2", available: true },
  { id: 3, name: "Ricardo Lima", specialty: ["Natacao", "Resistencia"], price: 120, rating: 4.6, reviews: 11, location: "Mogi das Cruzes", avatar: "RL", color: "#059669", available: false },
  { id: 4, name: "Juliana Costa", specialty: ["Pilates", "Reabilitacao"], price: 100, rating: 4.9, reviews: 15, location: "Itaquaquecetuba", avatar: "JC", color: "#dc2626", available: true },
];

export const SCHEDULE = [
  { day: "Seg", time: "07:00", trainer: "Carlos Mendes", type: "Hipertrofia", status: "confirmed" },
  { day: "Qua", time: "07:00", trainer: "Carlos Mendes", type: "Hipertrofia", status: "confirmed" },
  { day: "Sex", time: "08:00", trainer: "Carlos Mendes", type: "Forca", status: "pending" },
];

export const STUDENTS = [
  { name: "Gabriel Rocha", goal: "Hipertrofia", sessions: 12, progress: 68, avatar: "GR", color: "#7c3aed" },
  { name: "Pedro Avila", goal: "Emagrecimento", sessions: 8, progress: 45, avatar: "PA", color: "#0891b2" },
  { name: "Henry Bertolatti", goal: "Forca", sessions: 20, progress: 82, avatar: "HB", color: "#059669" },
  { name: "Jose Miguel", goal: "Resistencia", sessions: 5, progress: 30, avatar: "JM", color: "#f59e0b" },
];

export const MESSAGES = [
  { from: "trainer", text: "Boa semana! Voce mandou bem no treino de segunda.", time: "10:32" },
  { from: "me", text: "Valeu, professor. Ja senti diferenca nos treinos.", time: "10:35" },
  { from: "trainer", text: "Otimo. Preparei um treino novo para sexta, com foco em ombros.", time: "10:36" },
  { from: "me", text: "Fechado, vou estar la.", time: "10:40" },
];

export const WORKOUTS = [
  {
    name: "Hipertrofia A - Peito/Triceps",
    student: "Gabriel Rocha",
    exercises: [
      { name: "Supino Reto", sets: 4, reps: "8-10", load: "60kg" },
      { name: "Crucifixo", sets: 3, reps: "12", load: "14kg" },
      { name: "Triceps Pulley", sets: 4, reps: "12-15", load: "25kg" },
      { name: "Mergulho", sets: 3, reps: "10", load: "Peso corporal" },
    ],
  },
  {
    name: "Funcional - Emagrecimento",
    student: "Pedro Avila",
    exercises: [
      { name: "Agachamento Livre", sets: 3, reps: "20", load: "30kg" },
      { name: "Burpee", sets: 4, reps: "15", load: "-" },
      { name: "Kettlebell Swing", sets: 3, reps: "20", load: "16kg" },
    ],
  },
];
