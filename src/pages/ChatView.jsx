import { useState } from "react";
import { COLORS } from "../constants/theme";
import { MESSAGES, STUDENTS, TRAINERS } from "../data/mockData";

export default function ChatView({ role }) {
  const [msg, setMsg] = useState("");
  const [msgs, setMsgs] = useState(MESSAGES);

  const send = () => {
    if (!msg.trim()) return;
    setMsgs((prev) => [...prev, { from: "me", text: msg, time: "agora" }]);
    setMsg("");
  };

  return (
    <div className="fade-in" style={{ display: "flex", gap: 16, height: "calc(100vh - 160px)" }}>
      <div className="card" style={{ width: 220, display: "flex", flexDirection: "column", gap: 4, padding: 12, overflowY: "auto" }}>
        <div style={{ fontWeight: 600, padding: "4px 8px", marginBottom: 8 }}>Conversas</div>
        {(role === "aluno" ? TRAINERS.slice(0, 3) : STUDENTS).map((person, index) => (
          <div key={person.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 8px", background: index === 0 ? "#161616" : "transparent", borderRadius: 8, cursor: "pointer" }}>
            <div className="avatar" style={{ background: person.color, fontSize: 13, width: 36, height: 36 }}>{person.avatar}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{person.name}</div>
              <div style={{ fontSize: 11, color: COLORS.muted }}>Ativo hoje</div>
            </div>
            {index === 0 && <div className="badge">2</div>}
          </div>
        ))}
      </div>

      <div className="card" style={{ flex: 1, display: "flex", flexDirection: "column", padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", gap: 12 }}>
          <div className="avatar" style={{ background: "#7c3aed", fontSize: 14 }}>CM</div>
          <div>
            <div style={{ fontWeight: 600 }}>Carlos Mendes</div>
            <div style={{ fontSize: 12, color: COLORS.accent }}><span className="pulse">●</span> Online</div>
          </div>
        </div>
        <div style={{ flex: 1, padding: 20, display: "flex", flexDirection: "column", gap: 12, overflowY: "auto" }}>
          {msgs.map((message, index) => {
            const isMe = role === "personal" ? message.from === "trainer" : message.from === "me";

            return (
              <div key={`${message.time}-${index}`} style={{ display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start" }}>
                <div className={isMe ? "chat-bubble-me" : "chat-bubble-other"}>{message.text}</div>
                <span style={{ fontSize: 11, color: COLORS.muted, marginTop: 4 }}>{message.time}</span>
              </div>
            );
          })}
        </div>
        <div style={{ padding: "14px 20px", borderTop: `1px solid ${COLORS.border}`, display: "flex", gap: 10 }}>
          <input placeholder="Digite uma mensagem..." value={msg} onChange={(event) => setMsg(event.target.value)} onKeyDown={(event) => event.key === "Enter" && send()} />
          <button className="btn-accent" onClick={send} style={{ padding: "10px 20px", flexShrink: 0 }}>Enviar</button>
        </div>
      </div>
    </div>
  );
}
