import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ErrorMessage from './ErrorMessage';

describe('ErrorMessage', () => {
  it('отображает переданное сообщение об ошибке', () => {
    render(<ErrorMessage message="Ошибка сети" />);
    
    expect(screen.getByText('Request Failed')).toBeInTheDocument();
    expect(screen.getByText('Ошибка сети')).toBeInTheDocument();
  });

  it('не падает и корректно рендерит пустую строку', () => {
    render(<ErrorMessage message="" />);
    
    expect(screen.getByText('Request Failed')).toBeInTheDocument();
    expect(screen.queryByText('Ошибка сети')).not.toBeInTheDocument();
  });
});
