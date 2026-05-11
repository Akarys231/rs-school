import { vi } from 'vitest';
import type { ApiResponse } from '../types';

export const fetchCharacters = vi.fn<[string?, number?], Promise<ApiResponse>>();
