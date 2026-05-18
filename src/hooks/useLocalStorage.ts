import { useState, useCallback } from 'react';

/**
 * Reads a value from localStorage and parses it as JSON.
 * Returns the initialValue if the key is missing or the stored JSON is invalid.
 */
function readStoredValue<T>(key: string, initialValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return initialValue;

    return JSON.parse(raw) as T;
  } catch {
    // Invalid JSON or localStorage access denied — fall back silently
    return initialValue;
  }
}

/**
 * Generic hook for persisting state in localStorage.
 * Behaves like useState but syncs the value to localStorage on every update.
 *
 * Supports both direct value and updater-function signatures:
 *   setValue('hello')
 *   setValue(prev => [...prev, 'hello'])
 */
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
          // Quota exceeded or localStorage blocked — state still updates in memory
        }

        return nextValue;
      });
    },
    [key]
  );

  return [storedValue, setValue];
}
