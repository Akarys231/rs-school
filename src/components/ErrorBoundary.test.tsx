import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach } from 'vitest';
import ErrorBoundary from './ErrorBoundary';
import ErrorButton from './ErrorButton';

describe('ErrorBoundary', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('рендерит дочерние элементы по умолчанию', () => {
    render(
      <ErrorBoundary>
        <div>Нормальный контент</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Нормальный контент')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });

  it('ловит ошибку, показывает fallback, логирует и позволяет сбросить состояние', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const user = userEvent.setup();

    render(
      <ErrorBoundary>
        <ErrorButton />
      </ErrorBoundary>
    );

    // До ошибки
    const triggerButton = screen.getByRole('button', { name: 'Trigger Error' });
    expect(triggerButton).toBeInTheDocument();

    // Провоцируем ошибку (ошибка происходит в render ErrorButton и ловится ErrorBoundary)
    await user.click(triggerButton);

    // 1. Дети исчезли, появился fallback с правильным текстом
    expect(screen.queryByRole('button', { name: 'Trigger Error' })).not.toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(
      screen.getByText('Test error triggered by ErrorButton — this is intentional!')
    ).toBeInTheDocument();

    // 2. Логирование было вызвано (React + наш ErrorBoundary.componentDidCatch)
    expect(consoleSpy).toHaveBeenCalled();

    // 3. Кликаем сброс (Try Again)
    const resetButton = screen.getByRole('button', { name: 'Try Again' });
    await user.click(resetButton);

    // 4. Fallback исчез, дети вернулись
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Trigger Error' })).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('показывает дефолтное сообщение, если у ошибки нет текста', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Компонент, который кидает ошибку без message
    const ThrowEmptyError = () => {
      throw new Error('');
    };

    render(
      <ErrorBoundary>
        <ThrowEmptyError />
      </ErrorBoundary>
    );

    // Должен показаться дефолтный текст
    expect(screen.getByText('An unexpected error occurred in the application.')).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });
});
