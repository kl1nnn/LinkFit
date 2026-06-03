import { useEffect, useState } from "react";

export default function usePersistedState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // The app still works in memory when local storage is unavailable or full.
    }
  }, [key, value]);

  return [value, setValue];
}
