import { useState } from "react";
import Stars from "../components/Stars";
import { COLORS } from "../constants/theme";
import { TRAINERS } from "../data/mockData";

export default function BuscarPersonal() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("todos");
  const normalizedSearch = search.toLowerCase();

  const filtered = TRAINERS.filter((trainer) => {
    const matchesSearch = trainer.name.toLowerCase().includes(normalizedSearch) ||
      trainer.specialty.some((specialty) => specialty.toLowerCase().includes(normalizedSearch));
    const matchesFilter = filter === "todos" || trainer.specialty.some((specialty) => specialty.toLowerCase() === filter);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 26, fontWeight: 700, fontFamily: "'Archivo Black', sans-serif" }}>Buscar Personal</h2>
        <p style={{ color: COLORS.muted, marginTop: 4 }}>Filtre profissionais por objetivo, localidade e disponibilidade.</p>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <input placeholder="Buscar por nome ou especialidade" value={search} onChange={(event) => setSearch(event.target.value)} style={{ flex: 1 }} />
        <select style={{ width: 180 }} value={filter} onChange={(event) => setFilter(event.target.value)}>
          <option value="todos">Todos</option>
          <option value="hipertrofia">Hipertrofia</option>
          <option value="emagrecimento">Emagrecimento</option>
          <option value="funcional">Funcional</option>
        </select>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {filtered.map((trainer) => (
          <div key={trainer.id} className="trainer-card">
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 14 }}>
              <div className="avatar" style={{ background: trainer.color, width: 52, height: 52, fontSize: 18 }}>{trainer.avatar}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 16 }}>{trainer.name}</div>
                <div style={{ color: COLORS.muted, fontSize: 13, marginTop: 2 }}>{trainer.location}</div>
                <Stars rating={trainer.rating} />
                <span style={{ color: COLORS.muted, fontSize: 12 }}> ({trainer.reviews} avaliacoes)</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 22, color: "#22c55e" }}>R${trainer.price}</div>
                <div style={{ color: COLORS.muted, fontSize: 11 }}>/sessao</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
              {trainer.specialty.map((specialty) => <span key={specialty} className="tag">{specialty}</span>)}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-accent" style={{ flex: 1, padding: "10px" }}>Contratar</button>
              <button className="btn-ghost" style={{ flex: 1, padding: "10px" }}>Ver Perfil</button>
            </div>
            {!trainer.available && (
              <div style={{ marginTop: 10, fontSize: 12, color: COLORS.red, textAlign: "center" }}>Sem vagas no momento</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
