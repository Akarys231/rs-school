import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Flyout from './Flyout';
import { useSelectedItemsStore } from '../store/selectedItemsStore';
import type { Character } from '../types';

const mockCharacter: Character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: { name: 'Earth', url: '' },
  location: { name: 'Earth', url: '' },
  image: 'img.jpg',
  episode: [],
  url: '',
  created: '',
};

describe('Flyout', () => {
  beforeEach(() => {
    useSelectedItemsStore.setState({ selectedItems: {} });
  });

  it('renders nothing when there are no selected items', () => {
    const handleDownload = vi.fn();
    render(<Flyout onDownload={handleDownload} />);
    expect(screen.queryByTestId('selected-flyout')).not.toBeInTheDocument();
  });

  it('renders flyout when there is a selected item', () => {
    const handleDownload = vi.fn();
    useSelectedItemsStore.setState({ selectedItems: { 1: mockCharacter } });

    render(<Flyout onDownload={handleDownload} />);

    expect(screen.getByTestId('selected-flyout')).toBeInTheDocument();
    expect(screen.getByTestId('selected-count').textContent).toBe('1 item selected');
  });

  it('displays plural form when multiple items are selected', () => {
    const handleDownload = vi.fn();
    useSelectedItemsStore.setState({
      selectedItems: {
        1: mockCharacter,
        2: { ...mockCharacter, id: 2, name: 'Morty Smith' },
      },
    });

    render(<Flyout onDownload={handleDownload} />);

    expect(screen.getByTestId('selected-count').textContent).toBe('2 items selected');
  });

  it('calls unselectAll action when clicking unselect all button', async () => {
    const user = userEvent.setup();
    const handleDownload = vi.fn();
    useSelectedItemsStore.setState({ selectedItems: { 1: mockCharacter } });

    render(<Flyout onDownload={handleDownload} />);

    const unselectBtn = screen.getByRole('button', { name: 'Unselect all' });
    await user.click(unselectBtn);

    expect(useSelectedItemsStore.getState().selectedItems).toEqual({});
  });

  it('calls onDownload prop when clicking download button', async () => {
    const user = userEvent.setup();
    const handleDownload = vi.fn();
    useSelectedItemsStore.setState({ selectedItems: { 1: mockCharacter } });

    render(<Flyout onDownload={handleDownload} />);

    const downloadBtn = screen.getByRole('button', { name: 'Download' });
    await user.click(downloadBtn);

    expect(handleDownload).toHaveBeenCalledTimes(1);
  });
});
