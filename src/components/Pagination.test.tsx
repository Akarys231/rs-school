import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Pagination from './Pagination';

describe('Pagination', () => {
  it('не рендерит ничего, если страниц 1 или меньше', () => {
    const onPageChange = vi.fn<(page: number) => void>();
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={onPageChange} isLoading={false} />
    );

    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByRole('button', { name: 'Prev' })).not.toBeInTheDocument();
  });

  it('отображает кнопки Prev и Next, если страниц больше 1', () => {
    const onPageChange = vi.fn<(page: number) => void>();
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} isLoading={false} />
    );

    expect(screen.getByRole('button', { name: 'Prev' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
  });

  it('кнопка Prev отключена на первой странице, а Next доступна', () => {
    const onPageChange = vi.fn<(page: number) => void>();
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} isLoading={false} />
    );

    expect(screen.getByRole('button', { name: 'Prev' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next' })).not.toBeDisabled();
  });

  it('кнопка Next отключена на последней странице, а Prev доступна', () => {
    const onPageChange = vi.fn<(page: number) => void>();
    render(
      <Pagination currentPage={5} totalPages={5} onPageChange={onPageChange} isLoading={false} />
    );

    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Prev' })).not.toBeDisabled();
  });

  it('отключает все кнопки во время загрузки', () => {
    const onPageChange = vi.fn<(page: number) => void>();
    render(
      <Pagination currentPage={2} totalPages={5} onPageChange={onPageChange} isLoading={true} />
    );

    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it('вызывает onPageChange с правильными аргументами при клике', async () => {
    const onPageChange = vi.fn<(page: number) => void>();
    const user = userEvent.setup();

    render(
      <Pagination currentPage={2} totalPages={5} onPageChange={onPageChange} isLoading={false} />
    );

    const prevButton = screen.getByRole('button', { name: 'Prev' });
    const nextButton = screen.getByRole('button', { name: 'Next' });
    const page3Button = screen.getByRole('button', { name: '3' });

    await user.click(prevButton);
    expect(onPageChange).toHaveBeenCalledWith(1);

    await user.click(nextButton);
    expect(onPageChange).toHaveBeenCalledWith(3);

    await user.click(page3Button);
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('отображает многоточия и крайние страницы при большом количестве страниц', () => {
    const onPageChange = vi.fn<(page: number) => void>();
    render(<Pagination currentPage={5} totalPages={10} onPageChange={onPageChange} isLoading={false} />);

    // Первая и последняя страница должны быть видны
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '10' })).toBeInTheDocument();
    
    // Элементы-многоточия
    const dots = screen.getAllByText('...');
    expect(dots).toHaveLength(2);
  });
});
