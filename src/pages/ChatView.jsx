import { useRef, useState } from "react";
import Avatar from "../components/Avatar";
import { COLORS } from "../constants/theme";
import { MESSAGES, STUDENTS, TRAINERS } from "../data/mockData";
import usePersistedState from "../hooks/usePersistedState";

const readFile = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onerror = () => reject(new Error("Não foi possível ler o arquivo."));
  reader.onload = () => resolve(reader.result);
  reader.readAsDataURL(file);
});

export default function ChatView({ role, students = STUDENTS }) {
  const [msg, setMsg] = useState("");
  const [selectedChat, setSelectedChat] = useState(0);
  const [chats, setChats] = usePersistedState(`linkfit-chats-${role}`, { 0: MESSAGES });
  const [isRecording, setIsRecording] = useState(false);
  const imageInputRef = useRef(null);
  const recorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const people = role === "aluno" ? TRAINERS.slice(0, 3) : students;
  const selectedPerson = people[selectedChat];
  const msgs = chats[selectedChat] ?? [];
  const sender = role === "personal" ? "trainer" : "me";

  const addMessage = (message) => {
    setChats((prev) => ({ ...prev, [selectedChat]: [...(prev[selectedChat] ?? []), message] }));
  };

  const send = () => {
    if (!msg.trim()) return;
    addMessage({ from: sender, text: msg, time: "agora" });
    setMsg("");
  };

  const sendImage = async (event) => {
    const image = event.target.files?.[0];
    if (!image) return;

    addMessage({ from: sender, image: await readFile(image), time: "agora" });
    event.target.value = "";
  };

  const toggleRecording = async () => {
    if (isRecording) {
      recorderRef.current?.stop();
      setIsRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      recorderRef.current = recorder;

      recorder.ondataavailable = (event) => audioChunksRef.current.push(event.data);
      recorder.onstop = async () => {
        const audio = await readFile(new Blob(audioChunksRef.current, { type: recorder.mimeType }));
        addMessage({ from: sender, audio, time: "agora" });
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setIsRecording(true);
    } catch {
      setIsRecording(false);
    }
  };

  return (
    <div className="fade-in" style={{ display: "flex", gap: 16, height: "calc(100vh - 160px)" }}>
      <div className="card" style={{ width: 220, display: "flex", flexDirection: "column", gap: 4, padding: 12, overflowY: "auto" }}>
        <div style={{ fontWeight: 600, padding: "4px 8px", marginBottom: 8 }}>Conversas</div>
        {people.map((person, index) => (
          <div key={person.name} onClick={() => setSelectedChat(index)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 8px", background: index === selectedChat ? "#161616" : "transparent", borderRadius: 8, cursor: "pointer" }}>
            <Avatar person={person} size={36} fontSize={13} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{person.name}</div>
              <div style={{ fontSize: 11, color: COLORS.muted }}>Ativo hoje</div>
            </div>
            {index === 0 && <div className="badge" style={{ background: "#22c55e" }}>2</div>}
          </div>
        ))}
      </div>

      <div className="card" style={{ flex: 1, display: "flex", flexDirection: "column", padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar person={selectedPerson} size={42} fontSize={14} />
          <div>
            <div style={{ fontWeight: 600 }}>{selectedPerson.name}</div>
            <div style={{ fontSize: 12, color: "#22c55e" }}><span className="pulse">●</span> Online</div>
          </div>
        </div>
        <div style={{ flex: 1, padding: 20, display: "flex", flexDirection: "column", gap: 12, overflowY: "auto" }}>
          {msgs.map((message, index) => {
            const isMe = role === "personal" ? message.from === "trainer" : message.from === "me";

            return (
              <div key={`${message.time}-${index}`} style={{ display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start" }}>
                <div className={isMe ? "chat-bubble-me" : "chat-bubble-other"}>
                  {message.text}
                  {message.image && <img src={message.image} alt="Imagem enviada" style={{ display: "block", maxWidth: 240, borderRadius: 10 }} />}
                  {message.audio && <audio controls src={message.audio} style={{ display: "block", maxWidth: 260 }} />}
                </div>
                <span style={{ fontSize: 11, color: COLORS.muted, marginTop: 4 }}>{message.time}</span>
              </div>
            );
          })}
        </div>
        <div style={{ padding: "6px 10px", borderTop: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: COLORS.text, fontSize: 22, lineHeight: 1 }}>☺</span>
          <input
            placeholder="Mensagem..."
            value={msg}
            onChange={(event) => setMsg(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && send()}
            style={{ background: "transparent", border: "none", padding: "8px 0" }}
          />
          <button className={`chat-action${isRecording ? " recording" : ""}`} onClick={toggleRecording} aria-label={isRecording ? "Parar gravação" : "Gravar áudio"} title={isRecording ? "Parar gravação" : "Gravar áudio"}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3Zm-7-3a7 7 0 0 0 14 0m-7 7v3m-4 0h8" /></svg>
          </button>
          <button className="chat-action" onClick={() => imageInputRef.current?.click()} aria-label="Enviar imagem" title="Enviar imagem">
            <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>
          </button>
          <input ref={imageInputRef} type="file" accept="image/*" onChange={sendImage} style={{ display: "none" }} />
        </div>
      </div>
    </div>
  );
}
