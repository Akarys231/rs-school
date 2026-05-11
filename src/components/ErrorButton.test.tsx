import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach } from 'vitest';
import ErrorButton from './ErrorButton';

describe('ErrorButton', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('рендерит кнопку по умолчанию', () => {
    render(<ErrorButton />);
    expect(screen.getByRole('button', { name: 'Trigger Error' })).toBeInTheDocument();
  });

  it('выбрасывает ошибку при клике', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const user = userEvent.setup();
    
    render(<ErrorButton />);
    const button = screen.getByRole('button', { name: 'Trigger Error' });
    
    // В React 18+ ошибки рендера из обработчиков событий перехватываются flushSync
    // Так как userEvent асинхронный, мы ожидаем отклонения промиса
    await expect(user.click(button)).rejects.toThrowError(
      'Test error triggered by ErrorButton — this is intentional!'
    );

    consoleErrorSpy.mockRestore();
  });
});
