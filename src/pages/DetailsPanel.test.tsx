import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DetailsPanel from './DetailsPanel';
import { fetchCharacterById } from '../api';
import type { Character } from '../types';

vi.mock('../api', () => ({
  fetchCharacterById: vi.fn(),
}));

const mockFetchById = vi.mocked(fetchCharacterById);

const mockCharacter: Character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: { name: 'Earth', url: '' },
  location: { name: 'Earth', url: '' },
  image: 'img.jpg',
  episode: ['1', '2'],
  url: '',
  created: '',
};

let locationState: Record<string, unknown> | ReturnType<typeof useLocation> = {};
function LocationObserver() {
  const location = useLocation();
  locationState = location;
  return null;
}

function renderPanel(initialEntry = '/?details=1') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <LocationObserver />
      <Routes>
        <Route path="/" element={<DetailsPanel />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('DetailsPanel', () => {
  beforeEach(() => {
    mockFetchById.mockReset();
    locationState = {};
  });

  it('не рендерит ничего, если в URL нет параметра details', () => {
    const { container } = renderPanel('/');
    expect(container).toBeEmptyDOMElement();
  });

  it('показывает спиннер и загружает данные при наличии параметра details', async () => {
    mockFetchById.mockResolvedValueOnce(mockCharacter);
    
    renderPanel('/?details=1');
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    expect(mockFetchById).toHaveBeenCalledWith(1);
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Rick Sanchez');
    expect(screen.getByText('Alive')).toBeInTheDocument();
  });

  it('удаляет параметр details из URL при клике на крестик', async () => {
    mockFetchById.mockResolvedValueOnce(mockCharacter);
    const user = userEvent.setup();
    
    renderPanel('/?details=1&page=2');
    
    const closeBtn = await screen.findByRole('button', { name: 'Close details' });
    await user.click(closeBtn);
    
    // Параметр details должен пропасть, а page остаться
    expect(locationState.search).not.toContain('details=');
    expect(locationState.search).toContain('page=2');
  });

  it('показывает сообщение об ошибке, если API вернул ошибку', async () => {
    mockFetchById.mockRejectedValueOnce(new Error('Character not found'));
    
    renderPanel('/?details=999');
    
    await waitFor(() => {
      expect(screen.getByText('Request Failed')).toBeInTheDocument();
    });
    expect(screen.getByText('Character not found')).toBeInTheDocument();
  });
});
