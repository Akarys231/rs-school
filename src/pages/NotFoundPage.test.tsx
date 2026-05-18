import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import NotFoundPage from './NotFoundPage';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('NotFoundPage', () => {
  it('рендерит сообщение 404', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );
    
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('404');
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Page Not Found');
  });

  it('вызывает navigate(-1) при клике на кнопку назад', async () => {
    const navigateMock = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(navigateMock);
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );
    
    const backButton = screen.getByRole('button', { name: /Go Back/i });
    await user.click(backButton);
    
    expect(navigateMock).toHaveBeenCalledWith(-1);
  });
});
