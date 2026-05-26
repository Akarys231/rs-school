import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import { fetchCharacters, fetchCharacterById } from './api';
import { useSelectedItemsStore } from './store/selectedItemsStore';
import type { ApiResponse } from './types';

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
    useSelectedItemsStore.setState({ selectedItems: {} });
  });

  it('fetches characters with default query and renders results', async () => {
    mockFetch.mockResolvedValueOnce(mockApiResponse);

    renderWithRouter();

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledWith('', 1);
    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
  });

  it('uses search and page from URL parameters on initialization', async () => {
    mockFetch.mockResolvedValueOnce(mockApiResponse);

    renderWithRouter('/?search=Morty&page=2');

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('Morty', 2);
    });
  });

  it('displays error message when API call fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockFetch.mockTarget = mockFetch.mockRejectedValueOnce(new Error('Network error'));

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Request Failed')).toBeInTheDocument();
    });
    expect(screen.getByText('Network error')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('shows no characters message when result list is empty', async () => {
    mockFetch.mockResolvedValueOnce({
      info: { count: 0, pages: 0, next: null, prev: null },
      results: [],
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('No characters found')).toBeInTheDocument();
    });
  });

  it('updates URL and local storage when performing a search', async () => {
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

  it('updates URL when changing page', async () => {
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

  it('opens details panel and updates URL when clicking card', async () => {
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

  it('toggles selection and persists state across search and navigation actions', async () => {
    mockFetch.mockResolvedValue(mockApiResponse);
    const user = userEvent.setup();

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    });

    const checkbox = screen.getByRole('checkbox', { name: 'Select Rick Sanchez' });
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    const input = screen.getByRole('textbox');
    const searchButton = screen.getByRole('button', { name: /search/i });

    await user.type(input, 'Morty');
    await user.click(searchButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('Morty', 1);
    });

    const state = useSelectedItemsStore.getState();
    expect(state.selectedItems[1]).toEqual(mockApiResponse.results[0]);
  });
});
