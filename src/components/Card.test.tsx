import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
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
  it('рендерит все основные поля и изображение', () => {
    render(<Card character={defaultCharacter} />);

    expect(screen.getByRole('heading', { level: 3, name: 'Rick Sanchez' })).toBeInTheDocument();
    
    // Проверяем наличие текста в DOM
    expect(screen.getByText(/Human/)).toBeInTheDocument();
    expect(screen.getByText(/Male/)).toBeInTheDocument();
    expect(screen.getByText('Earth (C-137)')).toBeInTheDocument();
    expect(screen.getByText('Citadel of Ricks')).toBeInTheDocument();
    
    // Проверка изображения
    const image = screen.getByRole('img', { name: 'Rick Sanchez' });
    expect(image).toHaveAttribute('src', 'https://rickandmortyapi.com/avatar/1.jpeg');
    
    // Проверка статуса (текст бэйджа)
    expect(screen.getByText('Alive')).toBeInTheDocument();
  });

  it('рендерит дополнительное поле type, если оно передано', () => {
    const characterWithType = { ...defaultCharacter, type: 'Cyborg' };
    render(<Card character={characterWithType} />);

    expect(screen.getByText(/Cyborg/)).toBeInTheDocument();
  });

  it('отображает статус Dead', () => {
    const deadCharacter = { ...defaultCharacter, status: 'Dead' };
    render(<Card character={deadCharacter} />);

    expect(screen.getByText('Dead')).toBeInTheDocument();
  });

  it('отображает статус unknown', () => {
    const unknownCharacter = { ...defaultCharacter, status: 'unknown' };
    render(<Card character={unknownCharacter} />);

    expect(screen.getByText('unknown')).toBeInTheDocument();
  });

  it('не падает при пустом URL изображения', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const characterWithoutImage = { ...defaultCharacter, image: '' };
    
    render(<Card character={characterWithoutImage} />);

    // Если src пустой, React может не отрендерить атрибут src вообще,
    // но сам тег img (или alt текст) должен быть в DOM.
    const image = screen.getByRole('img', { name: 'Rick Sanchez' });
    expect(image).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });
});
