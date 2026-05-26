import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Card from './Card';
import type { Character } from '../types';

const defaultCharacter: Character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: { name: 'Earth (C-137)', url: '' },
  location: { name: 'Citadel of Ricks', url: '' },
  image: 'https://rickandmortyapi.com/avatar/1.jpeg',
  episode: [],
  url: '',
  created: '',
};

describe('Card', () => {
  it('renders all main fields and image', () => {
    render(<Card character={defaultCharacter} />);

    expect(screen.getByRole('heading', { level: 3, name: 'Rick Sanchez' })).toBeInTheDocument();
    expect(screen.getByText(/Human/)).toBeInTheDocument();
    expect(screen.getByText(/Male/)).toBeInTheDocument();
    expect(screen.getByText('Earth (C-137)')).toBeInTheDocument();
    expect(screen.getByText('Citadel of Ricks')).toBeInTheDocument();

    const image = screen.getByRole('img', { name: 'Rick Sanchez' });
    expect(image).toHaveAttribute('src', 'https://rickandmortyapi.com/avatar/1.jpeg');
    expect(screen.getByText('Alive')).toBeInTheDocument();
  });

  it('renders type field when provided', () => {
    const characterWithType = { ...defaultCharacter, type: 'Cyborg' };
    render(<Card character={characterWithType} />);
    expect(screen.getByText(/Cyborg/)).toBeInTheDocument();
  });

  it('displays Dead status', () => {
    const deadCharacter = { ...defaultCharacter, status: 'Dead' };
    render(<Card character={deadCharacter} />);
    expect(screen.getByText('Dead')).toBeInTheDocument();
  });

  it('displays unknown status', () => {
    const unknownCharacter = { ...defaultCharacter, status: 'unknown' };
    render(<Card character={unknownCharacter} />);
    expect(screen.getByText('unknown')).toBeInTheDocument();
  });

  it('does not crash with empty image URL', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const characterWithoutImage = { ...defaultCharacter, image: '' };

    render(<Card character={characterWithoutImage} />);

    const image = screen.getByRole('img', { name: 'Rick Sanchez' });
    expect(image).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('calls onCardClick with character ID on click', async () => {
    const user = userEvent.setup();
    const handleCardClick = vi.fn();

    render(<Card character={defaultCharacter} onCardClick={handleCardClick} />);

    const card = screen.getByRole('button', { name: `View details for ${defaultCharacter.name}` });
    await user.click(card);

    expect(handleCardClick).toHaveBeenCalledTimes(1);
    expect(handleCardClick).toHaveBeenCalledWith(1);
  });

  it('calls onCardClick on Enter key', async () => {
    const user = userEvent.setup();
    const handleCardClick = vi.fn();

    render(<Card character={defaultCharacter} onCardClick={handleCardClick} />);

    const card = screen.getByRole('button', { name: `View details for ${defaultCharacter.name}` });
    card.focus();
    await user.keyboard('{Enter}');

    expect(handleCardClick).toHaveBeenCalledTimes(1);
    expect(handleCardClick).toHaveBeenCalledWith(1);
  });

  it('calls onCardClick on Space key', async () => {
    const user = userEvent.setup();
    const handleCardClick = vi.fn();

    render(<Card character={defaultCharacter} onCardClick={handleCardClick} />);

    const card = screen.getByRole('button', { name: `View details for ${defaultCharacter.name}` });
    card.focus();
    await user.keyboard(' ');

    expect(handleCardClick).toHaveBeenCalledTimes(1);
    expect(handleCardClick).toHaveBeenCalledWith(1);
  });

  it('has no button role and aria-label when onCardClick is not provided', () => {
    render(<Card character={defaultCharacter} />);
    const card = screen.queryByRole('button');
    expect(card).not.toBeInTheDocument();
  });

  it('does not render checkbox when onToggleSelect is not provided', () => {
    render(<Card character={defaultCharacter} />);
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('renders checkbox when onToggleSelect is provided', () => {
    const handleToggle = vi.fn();
    render(<Card character={defaultCharacter} onToggleSelect={handleToggle} />);
    expect(screen.getByRole('checkbox', { name: `Select ${defaultCharacter.name}` })).toBeInTheDocument();
  });

  it('checkbox is unchecked when isSelected is false', () => {
    const handleToggle = vi.fn();
    render(<Card character={defaultCharacter} isSelected={false} onToggleSelect={handleToggle} />);
    const checkbox = screen.getByRole('checkbox', { name: `Select ${defaultCharacter.name}` });
    expect(checkbox).not.toBeChecked();
  });

  it('checkbox is checked when isSelected is true', () => {
    const handleToggle = vi.fn();
    render(<Card character={defaultCharacter} isSelected={true} onToggleSelect={handleToggle} />);
    const checkbox = screen.getByRole('checkbox', { name: `Select ${defaultCharacter.name}` });
    expect(checkbox).toBeChecked();
  });

  it('calls onToggleSelect when checkbox is clicked', async () => {
    const user = userEvent.setup();
    const handleToggle = vi.fn();
    const handleCardClick = vi.fn();

    render(
      <Card
        character={defaultCharacter}
        onCardClick={handleCardClick}
        onToggleSelect={handleToggle}
      />
    );

    const checkbox = screen.getByRole('checkbox', { name: `Select ${defaultCharacter.name}` });
    await user.click(checkbox);

    expect(handleToggle).toHaveBeenCalledTimes(1);
    expect(handleToggle).toHaveBeenCalledWith(defaultCharacter);
  });

  it('checkbox click does not trigger onCardClick', async () => {
    const user = userEvent.setup();
    const handleToggle = vi.fn();
    const handleCardClick = vi.fn();

    render(
      <Card
        character={defaultCharacter}
        onCardClick={handleCardClick}
        onToggleSelect={handleToggle}
      />
    );

    const checkbox = screen.getByRole('checkbox', { name: `Select ${defaultCharacter.name}` });
    await user.click(checkbox);

    expect(handleToggle).toHaveBeenCalledTimes(1);
    expect(handleCardClick).not.toHaveBeenCalled();
  });

  it('applies card-selected class when isSelected is true', () => {
    const handleToggle = vi.fn();
    render(<Card character={defaultCharacter} isSelected={true} onToggleSelect={handleToggle} />);
    const article = screen.getByRole('article');
    expect(article.className).toContain('card-selected');
  });

  it('does not apply card-selected class when isSelected is false', () => {
    const handleToggle = vi.fn();
    render(<Card character={defaultCharacter} isSelected={false} onToggleSelect={handleToggle} />);
    const article = screen.getByRole('article');
    expect(article.className).not.toContain('card-selected');
  });
});
