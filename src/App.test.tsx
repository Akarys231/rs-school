import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import { fetchCharacters, fetchCharacterById } from './api';
import type { ApiResponse } from './types';

// Мокаем API
vi.mock('./api', () => ({
  fetchCharacters: vi.fn(),
  fetchCharacterById: vi.fn(),
}));

const mockFetch = vi.mocked(fetchCharacters);

const mockApiResponse: ApiResponse = {
  info: { count: 2, pages: 2, next: 'url', prev: null },
  results: [
    {
      id: 1,
      name: 'Rick Sanchez',
      status: 'Alive',
      species: 'Human',
      type: '',
      gender: 'Male',
      origin: { name: 'Earth', url: '' },
      location: { name: 'Earth', url: '' },
      image: 'img.jpg',
      episode: [],
      url: '',
      created: '',
    },
  ],
};

// Helper component to observe location
let locationState: Record<string, unknown> | ReturnType<typeof useLocation> = {};
function LocationObserver() {
  const location = useLocation();
  locationState = location;
  return null;
}

function renderWithRouter(initialEntry = '/') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <LocationObserver />
      <Routes>
        <Route path="/" element={<App />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('App Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    mockFetch.mockReset();
    window.scrollTo = vi.fn();
    locationState = {};
  });

  it('вызывает API с пустым значением по умолчанию и рендерит данные', async () => {
    mockFetch.mockResolvedValueOnce(mockApiResponse);

    renderWithRouter();

    // Во время загрузки показывается спиннер
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Ждем окончания загрузки
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledWith('', 1);
    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    
    // Пагинация должна отрендериться, так как pages: 2
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
  });

  it('использует значение search из URL при монтировании', async () => {
    mockFetch.mockResolvedValueOnce(mockApiResponse);

    renderWithRouter('/?search=Morty&page=2');

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('Morty', 2);
    });
  });

  it('показывает сообщение об ошибке при сбое API', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Request Failed')).toBeInTheDocument();
    });
    expect(screen.getByText('Network error')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('показывает сообщение "No characters found" при пустом ответе', async () => {
    mockFetch.mockResolvedValueOnce({
      info: { count: 0, pages: 0, next: null, prev: null },
      results: [],
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('No characters found')).toBeInTheDocument();
    });
  });

  it('обновляет URL при поиске и сбрасывает страницу на 1', async () => {
    mockFetch.mockResolvedValue(mockApiResponse); 
    const user = userEvent.setup();

    renderWithRouter('/?page=2');

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    const input = screen.getByRole('textbox');
    const searchButton = screen.getByRole('button', { name: /search/i });

    await user.type(input, '  Summer  ');
    await user.click(searchButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('Summer', 1);
    });
    
    expect(locationState.search).toContain('search=Summer');
    expect(locationState.search).toContain('page=1');
    expect(localStorage.getItem('rick-morty-search-term')).toBe('"Summer"');
  });

  it('обновляет URL при переключении страницы', async () => {
    mockFetch.mockResolvedValue(mockApiResponse);
    const user = userEvent.setup();

    renderWithRouter();

    let nextButton!: HTMLElement;
    await waitFor(() => {
      nextButton = screen.getByRole('button', { name: 'Next' });
      expect(nextButton).toBeInTheDocument();
    });

    await user.click(nextButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('', 2);
    });
    
    expect(locationState.search).toContain('page=2');
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' }); 
  });

  it('открывает панель деталей при клике на карточку, добавляя details в URL', async () => {
    mockFetch.mockResolvedValueOnce(mockApiResponse);
    vi.mocked(fetchCharacterById).mockResolvedValueOnce(mockApiResponse.results[0]);
    const user = userEvent.setup();

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    });

    const card = screen.getByRole('button', { name: `View details for Rick Sanchez` });
    await user.click(card);

    expect(locationState.search).toContain('details=1');
  });
});
