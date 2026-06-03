export const trainerPhoto = (filename) => `${import.meta.env.BASE_URL}trainer-photos/${filename}.png`;
export const studentPhoto = (filename) => `${import.meta.env.BASE_URL}student-photos/${filename}.png`;

export const medidas = (...items) =>
  items.map(([label, value, delta, goodIfNegative = false]) => ({ label, value, delta, goodIfNegative }));
