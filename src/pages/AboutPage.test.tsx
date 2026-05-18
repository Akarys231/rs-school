import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AboutPage from './AboutPage';

describe('AboutPage', () => {
  it('рендерит заголовок и описание', () => {
    render(<AboutPage />);
    
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('About This App');
    expect(screen.getByText(/created by a developer/i)).toBeInTheDocument();
  });

  it('рендерит ссылку на RS School', () => {
    render(<AboutPage />);
    
    const link = screen.getByRole('link', { name: /RS School React Course/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://rs.school/react/');
    expect(link).toHaveAttribute('target', '_blank');
  });
});
