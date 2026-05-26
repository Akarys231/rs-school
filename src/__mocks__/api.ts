import { vi } from 'vitest';
import type { ApiResponse, Character } from '../types';

export const fetchCharacters = vi.fn<(searchTerm?: string, page?: number) => Promise<ApiResponse>>();
export const fetchCharacterById = vi.fn<(id: number) => Promise<Character>>();
