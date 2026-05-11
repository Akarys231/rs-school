import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Search from './Search';

describe('Search', () => {
  it('рендерит инпут и кнопку поиска', () => {
    const onSearch = vi.fn<(term: string) => void>();
    const onRemoveHistoryItem = vi.fn<(term: string) => void>();

    render(
      <Search
        initialSearchTerm=""
        onSearch={onSearch}
        isLoading={false}
        searchHistory={[]}
        onRemoveHistoryItem={onRemoveHistoryItem}
      />
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('подставляет начальное значение из пропсов', () => {
    const onSearch = vi.fn<(term: string) => void>();
    const onRemoveHistoryItem = vi.fn<(term: string) => void>();

    render(
      <Search
        initialSearchTerm="Initial value"
        onSearch={onSearch}
        isLoading={false}
        searchHistory={[]}
        onRemoveHistoryItem={onRemoveHistoryItem}
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('Initial value');
  });

  it('изменяет значение при вводе текста', async () => {
    const onSearch = vi.fn<(term: string) => void>();
    const onRemoveHistoryItem = vi.fn<(term: string) => void>();
    const user = userEvent.setup();

    render(
      <Search
        initialSearchTerm=""
        onSearch={onSearch}
        isLoading={false}
        searchHistory={[]}
        onRemoveHistoryItem={onRemoveHistoryItem}
      />
    );

    const input = screen.getByRole('textbox');
    await user.type(input, 'Morty');
    expect(input).toHaveValue('Morty');
  });

  it('вызывает onSearch с обрезанным значением при сабмите (клик по кнопке)', async () => {
    const onSearch = vi.fn<(term: string) => void>();
    const onRemoveHistoryItem = vi.fn<(term: string) => void>();
    const user = userEvent.setup();

    render(
      <Search
        initialSearchTerm=""
        onSearch={onSearch}
        isLoading={false}
        searchHistory={[]}
        onRemoveHistoryItem={onRemoveHistoryItem}
      />
    );

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /search/i });

    await user.type(input, '  Rick  ');
    await user.click(button);

    expect(onSearch).toHaveBeenCalledWith('Rick');
  });

  it('показывает и скрывает историю поиска', async () => {
    const onSearch = vi.fn<(term: string) => void>();
    const onRemoveHistoryItem = vi.fn<(term: string) => void>();
    const user = userEvent.setup();

    render(
      <Search
        initialSearchTerm=""
        onSearch={onSearch}
        isLoading={false}
        searchHistory={['Rick', 'Morty']}
        onRemoveHistoryItem={onRemoveHistoryItem}
      />
    );

    const input = screen.getByRole('textbox');
    
    // Фокус показывает историю
    await user.click(input);
    expect(screen.getByText('Rick')).toBeInTheDocument();

    // Escape скрывает историю
    await user.keyboard('{Escape}');
    expect(screen.queryByText('Rick')).not.toBeInTheDocument();
  });

  it('закрывает историю при клике вне компонента', async () => {
    const onSearch = vi.fn<(term: string) => void>();
    const onRemoveHistoryItem = vi.fn<(term: string) => void>();
    const user = userEvent.setup();

    render(
      <div>
        <Search
          initialSearchTerm=""
          onSearch={onSearch}
          isLoading={false}
          searchHistory={['Rick']}
          onRemoveHistoryItem={onRemoveHistoryItem}
        />
        <div data-testid="outside">Outside</div>
      </div>
    );

    const input = screen.getByRole('textbox');
    await user.click(input);
    expect(screen.getByText('Rick')).toBeInTheDocument();

    await user.click(screen.getByTestId('outside'));
    expect(screen.queryByText('Rick')).not.toBeInTheDocument();
  });

  it('позволяет выбрать элемент из истории и удалить его', async () => {
    const onSearch = vi.fn<(term: string) => void>();
    const onRemoveHistoryItem = vi.fn<(term: string) => void>();
    const user = userEvent.setup();

    render(
      <Search
        initialSearchTerm=""
        onSearch={onSearch}
        isLoading={false}
        searchHistory={['Rick']}
        onRemoveHistoryItem={onRemoveHistoryItem}
      />
    );

    const input = screen.getByRole('textbox');
    await user.click(input);

    const removeBtn = screen.getByLabelText('Remove Rick from history');
    await user.click(removeBtn);
    expect(onRemoveHistoryItem).toHaveBeenCalledWith('Rick');

    const historyItem = screen.getByText('Rick');
    await user.click(historyItem);
    expect(onSearch).toHaveBeenCalledWith('Rick');
  });

  it('вызывает onSearch с обрезанным значением при нажатии Enter', async () => {
    const onSearch = vi.fn<(term: string) => void>();
    const onRemoveHistoryItem = vi.fn<(term: string) => void>();
    const user = userEvent.setup();

    render(
      <Search
        initialSearchTerm=""
        onSearch={onSearch}
        isLoading={false}
        searchHistory={[]}
        onRemoveHistoryItem={onRemoveHistoryItem}
      />
    );

    const input = screen.getByRole('textbox');

    await user.type(input, '  Summer  {Enter}');
    expect(onSearch).toHaveBeenCalledWith('Summer');
  });
});
