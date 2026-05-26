import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AboutPage from './AboutPage';

describe('AboutPage', () => {
  it('renders heading and description with developer link', () => {
    render(<AboutPage />);
    
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('About This App');
    
    const githubLink = screen.getByRole('link', { name: 'Akarys231' });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', 'https://github.com/Akarys231');
    expect(githubLink).toHaveAttribute('target', '_blank');
  });

  it('renders link to RS School React Course', () => {
    render(<AboutPage />);
    
    const courseLink = screen.getByRole('link', { name: /RS School React Course/i });
    expect(courseLink).toBeInTheDocument();
    expect(courseLink).toHaveAttribute('href', 'https://rs.school/courses/reactjs');
    expect(courseLink).toHaveAttribute('target', '_blank');
  });
});
