import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  useEffect(() => {
    if (typeof window === "undefined") {
      throw new Error("useLocalStorage can only be used in the browser");
    }
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const stored = JSON.parse(item);
        if (stored) {
          setStoredValue(stored);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };
  return [storedValue, setValue] as const;
}
