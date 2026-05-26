import { useState, useCallback } from 'react';

function readStoredValue<T>(key: string, initialValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return initialValue;

    return JSON.parse(raw) as T;
  } catch {
    return initialValue;
  }
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() =>
    readStoredValue(key, initialValue)
  );

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((current) => {
        const nextValue =
          value instanceof Function ? value(current) : value;

        try {
          localStorage.setItem(key, JSON.stringify(nextValue));
        } catch {
        }

        return nextValue;
      });
    },
    [key]
  );

  return [storedValue, setValue];
}
