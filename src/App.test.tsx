import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import { fetchCharacters } from './api';
import type { ApiResponse } from './types';

// Мокаем API
vi.mock('./api', () => ({
  fetchCharacters: vi.fn(),
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

describe('App Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    mockFetch.mockReset();
    window.scrollTo = vi.fn();
  });

  it('вызывает API с пустым значением по умолчанию и рендерит данные', async () => {
    mockFetch.mockResolvedValueOnce(mockApiResponse);

    render(<App />);

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

  it('использует значение из localStorage при монтировании', async () => {
    mockFetch.mockResolvedValueOnce(mockApiResponse);
    localStorage.setItem('rick-morty-search-term', 'Morty');

    render(<App />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('Morty', 1);
    });
  });

  it('показывает сообщение об ошибке при сбое API', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    render(<App />);

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

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('No characters found')).toBeInTheDocument();
    });
  });

  it('сохраняет запрос в localStorage и вызывает API при поиске', async () => {
    mockFetch.mockResolvedValueOnce(mockApiResponse); // Маунт
    const user = userEvent.setup();

    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // Готовим ответ для поиска
    mockFetch.mockResolvedValueOnce({
      info: { count: 1, pages: 1, next: null, prev: null },
      results: [{ ...mockApiResponse.results[0], name: 'Summer Smith' }],
    });

    const input = screen.getByRole('textbox');
    const searchButton = screen.getByRole('button', { name: /search/i });

    await user.type(input, '  Summer  ');
    await user.click(searchButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('Summer', 1);
    });
    expect(localStorage.getItem('rick-morty-search-term')).toBe('Summer');
    expect(screen.getByText('Summer Smith')).toBeInTheDocument();
  });

  it('меняет страницу при клике на пагинацию', async () => {
    mockFetch.mockResolvedValueOnce(mockApiResponse); // Запрос при маунте
    const user = userEvent.setup();

    render(<App />);

    let nextButton!: HTMLElement;
    await waitFor(() => {
      nextButton = screen.getByRole('button', { name: 'Next' });
      expect(nextButton).toBeInTheDocument();
    });

    // Ответ для 2-й страницы
    mockFetch.mockResolvedValueOnce({
      ...mockApiResponse,
      results: [{ ...mockApiResponse.results[0], name: 'Page 2 Rick' }],
    });

    await user.click(nextButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('', 2);
    });
    expect(screen.getByText('Page 2 Rick')).toBeInTheDocument();
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' }); // Проверка сайд-эффекта
  });

  it('игнорирует невалидный JSON в истории localStorage', async () => {
    localStorage.setItem('rick-morty-search-history', '{invalid json');
    mockFetch.mockResolvedValueOnce(mockApiResponse);
    
    render(<App />);
    expect(screen.getByText('Rick & Morty Explorer')).toBeInTheDocument();
    
    // Ждем окончания загрузки, чтобы избежать предупреждений act(...)
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  });

  it('не вызывает API повторно, если поисковый запрос не изменился', async () => {
    mockFetch.mockResolvedValue(mockApiResponse);
    const user = userEvent.setup();
    render(<App />);
    
    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());
    mockFetch.mockClear();

    const input = screen.getByRole('textbox');
    const searchButton = screen.getByRole('button', { name: /search/i });

    // Пытаемся отправить тот же пустой запрос (обрежется до пустой строки)
    await user.type(input, '   ');
    await user.click(searchButton);

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('удаляет элемент из истории поиска', async () => {
    mockFetch.mockResolvedValue(mockApiResponse);
    localStorage.setItem('rick-morty-search-history', JSON.stringify(['Rick', 'Morty']));
    const user = userEvent.setup();
    render(<App />);
    
    const input = screen.getByRole('textbox');
    await user.click(input); // фокус для показа истории
    
    const removeButton = await screen.findByLabelText('Remove Rick from history');
    await user.click(removeButton);

    expect(screen.queryByText('Rick', { selector: '.search-history-text' })).not.toBeInTheDocument();
    // Проверяем, что в localStorage остался только Morty
    const history = JSON.parse(localStorage.getItem('rick-morty-search-history') || '[]');
    expect(history).toEqual(['Morty']);
  });
});
