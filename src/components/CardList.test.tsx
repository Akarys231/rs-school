import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
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
  it('рендерит список карточек при наличии данных', () => {
    render(<CardList characters={mockCharacters} />);

    // Компонент Card использует тег <article>
    const articles = screen.getAllByRole('article');
    expect(articles).toHaveLength(2);

    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Morty Smith')).toBeInTheDocument();
  });

  it('отображает сообщение об отсутствии результатов при пустом массиве', () => {
    render(<CardList characters={[]} />);

    expect(screen.queryAllByRole('article')).toHaveLength(0);
    expect(screen.getByRole('heading', { name: 'No characters found' })).toBeInTheDocument();
    expect(
      screen.getByText('Try a different search term or clear the search to browse all characters.')
    ).toBeInTheDocument();
  });
});
