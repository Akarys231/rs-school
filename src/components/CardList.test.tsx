import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import CardList from './CardList';
import type { Character } from '../types';

const mockCharacters: Character[] = [
  {
    id: 1,
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Male',
    origin: { name: 'Earth', url: '' },
    location: { name: 'Earth', url: '' },
    image: 'https://example.com/rick.jpg',
    episode: [],
    url: '',
    created: '',
  },
  {
    id: 2,
    name: 'Morty Smith',
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Male',
    origin: { name: 'Earth', url: '' },
    location: { name: 'Earth', url: '' },
    image: 'https://example.com/morty.jpg',
    episode: [],
    url: '',
    created: '',
  },
];

describe('CardList', () => {
  it('renders a list of cards when data is present', () => {
    render(<CardList characters={mockCharacters} />);

    const articles = screen.getAllByRole('article');
    expect(articles).toHaveLength(2);

    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Morty Smith')).toBeInTheDocument();
  });

  it('displays empty message when character list is empty', () => {
    render(<CardList characters={[]} />);

    expect(screen.queryAllByRole('article')).toHaveLength(0);
    expect(screen.getByRole('heading', { name: 'No characters found' })).toBeInTheDocument();
    expect(
      screen.getByText('Try a different search term or clear the search to browse all characters.')
    ).toBeInTheDocument();
  });

  it('passes onCardClick to child Card components', async () => {
    const user = userEvent.setup();
    const handleCardClick = vi.fn();
    
    render(<CardList characters={mockCharacters} onCardClick={handleCardClick} />);
    
    const secondCard = screen.getByRole('button', { name: `View details for ${mockCharacters[1].name}` });
    await user.click(secondCard);
    
    expect(handleCardClick).toHaveBeenCalledTimes(1);
    expect(handleCardClick).toHaveBeenCalledWith(2);
  });

  it('renders unchecked checkbox for unselected cards', () => {
    const handleToggle = vi.fn();
    render(
      <CardList
        characters={mockCharacters}
        selectedItems={{}}
        onToggleSelect={handleToggle}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(2);
    expect(checkboxes[0]).not.toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
  });

  it('renders checked checkbox for selected cards', () => {
    const handleToggle = vi.fn();
    render(
      <CardList
        characters={mockCharacters}
        selectedItems={{ 1: mockCharacters[0] }}
        onToggleSelect={handleToggle}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(2);
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
  });

  it('passes onToggleSelect to child Cards and delegates toggle call', async () => {
    const user = userEvent.setup();
    const handleToggle = vi.fn();

    render(
      <CardList
        characters={mockCharacters}
        selectedItems={{}}
        onToggleSelect={handleToggle}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);

    expect(handleToggle).toHaveBeenCalledTimes(1);
    expect(handleToggle).toHaveBeenCalledWith(mockCharacters[0]);
  });
});
