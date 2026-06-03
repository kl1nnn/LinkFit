export default function Avatar({ person, size = 42, fontSize = 14 }) {
  return (
    <div
      className="avatar"
      style={{
        background: person.color,
        fontSize,
        height: size,
        width: size,
      }}
    >
      {person.photo ? <img className="avatar-photo" src={person.photo} alt={person.name} /> : person.avatar}
    </div>
  );
}
