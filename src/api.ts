import type { ApiResponse, Character } from './types';

const BASE_URL = 'https://rickandmortyapi.com/api/character';

export async function fetchCharacters(
  searchTerm: string = '',
  page: number = 1
): Promise<ApiResponse> {
  const params = new URLSearchParams();
  params.set('page', String(page));

  if (searchTerm.trim()) {
    params.set('name', searchTerm.trim());
  }

  const url = `${BASE_URL}?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 404) {
      return {
        info: { count: 0, pages: 0, next: null, prev: null },
        results: [],
      };
    }
    throw new Error(
      `Server error: ${response.status} ${response.statusText}. Please try again later.`
    );
  }

  const data: ApiResponse = await response.json();
  return data;
}

export async function fetchCharacterById(id: number): Promise<Character> {
  const response = await fetch(`${BASE_URL}/${id}`);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch character: ${response.status} ${response.statusText}`
    );
  }

  const character: Character = await response.json();
  return character;
}
