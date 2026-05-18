import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns the initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('theme', 'light'));

    expect(result.current[0]).toBe('light');
  });

  it('reads an existing value from localStorage', () => {
    localStorage.setItem('lang', JSON.stringify('ru'));

    const { result } = renderHook(() => useLocalStorage('lang', 'en'));

    expect(result.current[0]).toBe('ru');
  });

  it('writes a new value to both state and localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('count', 0));

    act(() => {
      result.current[1](42);
    });

    expect(result.current[0]).toBe(42);
    expect(JSON.parse(localStorage.getItem('count')!)).toBe(42);
  });

  it('supports updater-function signature like useState', () => {
    const { result } = renderHook(() =>
      useLocalStorage<string[]>('tags', ['react'])
    );

    act(() => {
      result.current[1]((prev) => [...prev, 'router']);
    });

    expect(result.current[0]).toEqual(['react', 'router']);
    expect(JSON.parse(localStorage.getItem('tags')!)).toEqual([
      'react',
      'router',
    ]);
  });

  it('falls back to initial value when stored JSON is invalid', () => {
    localStorage.setItem('broken', '{not valid json!!!');

    const { result } = renderHook(() => useLocalStorage('broken', 'fallback'));

    expect(result.current[0]).toBe('fallback');
  });

  it('still updates state if localStorage.setItem throws', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('QuotaExceededError');
    });

    const { result } = renderHook(() => useLocalStorage('key', 'initial'));

    act(() => {
      result.current[1]('updated');
    });

    // State updates even though persistence failed
    expect(result.current[0]).toBe('updated');

    spy.mockRestore();
  });

  it('works with complex object types', () => {
    interface UserPrefs {
      darkMode: boolean;
      fontSize: number;
    }

    const defaultPrefs: UserPrefs = { darkMode: false, fontSize: 14 };

    const { result } = renderHook(() =>
      useLocalStorage<UserPrefs>('prefs', defaultPrefs)
    );

    act(() => {
      result.current[1]({ darkMode: true, fontSize: 18 });
    });

    expect(result.current[0]).toEqual({ darkMode: true, fontSize: 18 });
    expect(JSON.parse(localStorage.getItem('prefs')!)).toEqual({
      darkMode: true,
      fontSize: 18,
    });
  });
});
