import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import Navigation from './Navigation';
import { ThemeProvider } from '../context/ThemeContext';

function renderNavigation() {
  return render(
    <MemoryRouter>
      <ThemeProvider>
        <Navigation />
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe('Navigation', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme');
  });

  it('renders navigation links', () => {
    renderNavigation();
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();
  });

  it('renders theme toggle button', () => {
    renderNavigation();
    expect(
      screen.getByRole('button', { name: /switch to dark theme/i })
    ).toBeInTheDocument();
  });

  it('toggles theme from light to dark on click', async () => {
    const user = userEvent.setup();
    renderNavigation();

    const toggleBtn = screen.getByRole('button', { name: /switch to dark theme/i });
    await user.click(toggleBtn);

    expect(
      screen.getByRole('button', { name: /switch to light theme/i })
    ).toBeInTheDocument();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('toggles theme back to light on second click', async () => {
    const user = userEvent.setup();
    renderNavigation();

    const toggleBtn = screen.getByRole('button', { name: /switch to dark theme/i });
    await user.click(toggleBtn);
    await user.click(screen.getByRole('button', { name: /switch to light theme/i }));

    expect(
      screen.getByRole('button', { name: /switch to dark theme/i })
    ).toBeInTheDocument();
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('displays moon emoji in light mode and sun emoji in dark mode', async () => {
    const user = userEvent.setup();
    renderNavigation();

    const toggleBtn = screen.getByRole('button', { name: /switch to dark theme/i });
    expect(toggleBtn.textContent).toBe('🌙');

    await user.click(toggleBtn);

    const darkToggleBtn = screen.getByRole('button', { name: /switch to light theme/i });
    expect(darkToggleBtn.textContent).toBe('☀️');
  });
});
