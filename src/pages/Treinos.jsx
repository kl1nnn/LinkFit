import { useEffect, useRef, useState } from "react";
import PageHeader from "../components/PageHeader";
import { COLORS } from "../constants/theme";
import { STUDENTS, WORKOUTS } from "../data/mockData";

const emptyExercise = () => ({ name: "", sets: "", reps: "", load: "" });

export default function Treinos({ students = STUDENTS, workouts = WORKOUTS, setWorkouts = () => {}, selectedStudentName }) {
  const initialSelected = selectedStudentName ? workouts.findIndex((workout) => workout.student === selectedStudentName) : -1;
  const [selected, setSelected] = useState(initialSelected >= 0 ? initialSelected : null);
  const [isCreating, setIsCreating] = useState(false);
  const [isManaging, setIsManaging] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [draft, setDraft] = useState({ name: "", student: students[0].name, exercises: [emptyExercise()] });
  const workoutRefs = useRef([]);

  useEffect(() => {
    if (!selectedStudentName || selected === null) return;

    const frame = requestAnimationFrame(() => workoutRefs.current[selected]?.scrollIntoView({ behavior: "smooth", block: "center" }));
    return () => cancelAnimationFrame(frame);
  }, [selectedStudentName, selected]);

  const updateExercise = (index, field, value) => {
    setDraft((current) => ({
      ...current,
      exercises: current.exercises.map((exercise, exerciseIndex) => exerciseIndex === index ? { ...exercise, [field]: value } : exercise),
    }));
  };

  const addExercise = () => {
    setDraft((current) => ({ ...current, exercises: [...current.exercises, emptyExercise()] }));
  };

  const removeExercise = (index) => {
    setDraft((current) => ({ ...current, exercises: current.exercises.filter((_, exerciseIndex) => exerciseIndex !== index) }));
  };

  const cancelCreation = () => {
    setDraft({ name: "", student: students[0].name, exercises: [emptyExercise()] });
    setIsCreating(false);
    setEditingIndex(null);
  };

  const saveWorkout = (event) => {
    event.preventDefault();
    const exercises = draft.exercises.filter((exercise) => exercise.name.trim());
    if (!draft.name.trim() || exercises.length === 0) return;

    const workout = { ...draft, name: draft.name.trim(), exercises };
    if (editingIndex === null) {
      setWorkouts((current) => [...current, workout]);
      setSelected(workouts.length);
    } else {
      setWorkouts((current) => current.map((currentWorkout, index) => index === editingIndex ? workout : currentWorkout));
      setSelected(editingIndex);
    }
    cancelCreation();
  };

  const startCreation = () => {
    cancelCreation();
    setIsCreating(true);
  };

  const startEditing = (index) => {
    const workout = workouts[index];
    setDraft({ ...workout, exercises: workout.exercises.map((exercise) => ({ ...exercise })) });
    setEditingIndex(index);
    setIsCreating(true);
  };

  const deleteWorkout = (index) => {
    if (!window.confirm("Excluir este treino?")) return;

    setWorkouts((current) => current.filter((_, workoutIndex) => workoutIndex !== index));
    setSelected((current) => current === index ? null : current > index ? current - 1 : current);
    if (editingIndex === index) cancelCreation();
  };

  return (
    <div className="page fade-in">
      <PageHeader title="Treinos" subtitle="Gerencie os treinos dos seus alunos.">
        <div className="button-row">
          <button
            className={`btn-accent pill-button${isManaging ? " active" : ""}`}
            onClick={() => setIsManaging((current) => !current)}
          >
            {isManaging ? "Concluir" : "Editar Treinos"}
          </button>
          <button
            className="btn-accent pill-button"
            onClick={startCreation}
          >
            + Criar Treino
          </button>
        </div>
      </PageHeader>
      {isCreating && (
        <form className="card form-card" onSubmit={saveWorkout}>
          <div className="form-title">{editingIndex === null ? "Novo treino" : "Editar treino"}</div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
            <input required placeholder="Nome do treino" value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} />
            <select value={draft.student} onChange={(event) => setDraft((current) => ({ ...current, student: event.target.value }))}>
              {students.map((student) => <option key={student.name}>{student.name}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {draft.exercises.map((exercise, index) => (
              <div key={index} style={{ display: "grid", gridTemplateColumns: "2fr 0.6fr 0.8fr 1fr auto", gap: 8 }}>
                <input required placeholder="Exercício" value={exercise.name} onChange={(event) => updateExercise(index, "name", event.target.value)} />
                <input placeholder="Séries" value={exercise.sets} onChange={(event) => updateExercise(index, "sets", event.target.value)} />
                <input placeholder="Reps" value={exercise.reps} onChange={(event) => updateExercise(index, "reps", event.target.value)} />
                <input placeholder="Carga" value={exercise.load} onChange={(event) => updateExercise(index, "load", event.target.value)} />
                <button type="button" className="btn-ghost" onClick={() => removeExercise(index)} disabled={draft.exercises.length === 1} style={{ padding: "8px 12px" }}>Remover</button>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
            <button type="button" className="btn-ghost" onClick={addExercise} style={{ padding: "8px 14px" }}>+ Exercício</button>
            <div className="button-row">
              <button type="button" className="btn-ghost" onClick={cancelCreation} style={{ padding: "8px 14px" }}>Cancelar</button>
              <button type="submit" className="btn-accent" style={{ padding: "8px 14px" }}>{editingIndex === null ? "Criar treino" : "Salvar alterações"}</button>
            </div>
          </div>
        </form>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {workouts.map((workout, index) => (
          <div ref={(element) => { workoutRefs.current[index] = element; }} key={workout.name} className="card" style={{ cursor: "pointer" }} onClick={() => setSelected(selected === index ? null : index)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 600 }}>{workout.name}</div>
                <div style={{ color: COLORS.muted, fontSize: 13, marginTop: 4 }}>Aluno: {workout.student}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {isManaging && (
                  <>
                    <button type="button" className="btn-ghost" onClick={(event) => { event.stopPropagation(); startEditing(index); }} style={{ padding: "6px 12px" }}>Editar</button>
                    <button type="button" className="btn-ghost" onClick={(event) => { event.stopPropagation(); deleteWorkout(index); }} style={{ padding: "6px 12px" }}>Excluir</button>
                  </>
                )}
                <span style={{ color: COLORS.accent }}>{selected === index ? "▲" : "▼"}</span>
              </div>
            </div>
            {selected === index && (
              <div style={{ marginTop: 16, borderTop: `1px solid ${COLORS.border}`, paddingTop: 16 }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      {["Exercício", "Séries", "Reps", "Carga"].map((heading) => (
                        <th key={heading} style={{ textAlign: "left", padding: "6px 12px", color: COLORS.muted, fontSize: 12, fontWeight: 500 }}>{heading}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {workout.exercises.map((exercise) => (
                      <tr key={exercise.name} style={{ borderTop: `1px solid ${COLORS.border}` }}>
                        <td style={{ padding: "10px 12px", fontWeight: 500 }}>{exercise.name}</td>
                        <td style={{ padding: "10px 12px", color: COLORS.muted }}>{exercise.sets}</td>
                        <td style={{ padding: "10px 12px", color: COLORS.muted }}>{exercise.reps}</td>
                        <td style={{ padding: "10px 12px" }}>
                          <span className="tag" style={{ background: "#202020", borderColor: "#353535", color: COLORS.text }}>{exercise.load}</span>
                        </td>
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
