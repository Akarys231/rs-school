import { vi } from 'vitest';
import type { ApiResponse, Character } from '../types';

export const fetchCharacters = vi.fn<[string?, number?], Promise<ApiResponse>>();
export const fetchCharacterById = vi.fn<[number], Promise<Character>>();
