import { describe, it, expect, beforeEach } from 'vitest';
import {
  useSelectedItemsStore,
  selectSelectedCount,
  selectSelectedList,
} from './selectedItemsStore';
import type { Character } from '../types';

const mockCharacter: Character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: { name: 'Earth', url: '' },
  location: { name: 'Citadel of Ricks', url: '' },
  image: 'rick.png',
  episode: [],
  url: '',
  created: '',
};

const mockCharacter2: Character = {
  id: 2,
  name: 'Morty Smith',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: { name: 'Earth', url: '' },
  location: { name: 'Earth', url: '' },
  image: 'morty.png',
  episode: [],
  url: '',
  created: '',
};

describe('selectedItemsStore', () => {
  beforeEach(() => {
    useSelectedItemsStore.setState({ selectedItems: {} });
  });

  it('has empty initial state', () => {
    const state = useSelectedItemsStore.getState();
    expect(state.selectedItems).toEqual({});
    expect(selectSelectedCount(state)).toBe(0);
    expect(selectSelectedList(state)).toEqual([]);
  });

  it('toggleItem adds a character when not selected', () => {
    useSelectedItemsStore.getState().toggleItem(mockCharacter);
    const state = useSelectedItemsStore.getState();
    expect(state.selectedItems[1]).toEqual(mockCharacter);
    expect(selectSelectedCount(state)).toBe(1);
  });

  it('toggleItem removes a character when already selected', () => {
    useSelectedItemsStore.getState().toggleItem(mockCharacter);
    useSelectedItemsStore.getState().toggleItem(mockCharacter);
    const state = useSelectedItemsStore.getState();
    expect(state.selectedItems[1]).toBeUndefined();
    expect(selectSelectedCount(state)).toBe(0);
  });

  it('handles multiple selections', () => {
    const { toggleItem } = useSelectedItemsStore.getState();
    toggleItem(mockCharacter);
    toggleItem(mockCharacter2);
    const state = useSelectedItemsStore.getState();
    expect(selectSelectedCount(state)).toBe(2);
    expect(selectSelectedList(state)).toHaveLength(2);
  });

  it('unselectAll clears all selections', () => {
    const { toggleItem } = useSelectedItemsStore.getState();
    toggleItem(mockCharacter);
    toggleItem(mockCharacter2);
    useSelectedItemsStore.getState().unselectAll();
    const state = useSelectedItemsStore.getState();
    expect(state.selectedItems).toEqual({});
    expect(selectSelectedCount(state)).toBe(0);
  });

  it('selectSelectedList returns array of selected characters', () => {
    useSelectedItemsStore.getState().toggleItem(mockCharacter);
    const list = selectSelectedList(useSelectedItemsStore.getState());
    expect(list).toEqual([mockCharacter]);
  });

  it('toggle does not mutate previous state reference', () => {
    useSelectedItemsStore.getState().toggleItem(mockCharacter);
    const before = useSelectedItemsStore.getState().selectedItems;
    useSelectedItemsStore.getState().toggleItem(mockCharacter2);
    const after = useSelectedItemsStore.getState().selectedItems;
    expect(before).not.toBe(after);
  });

  it('re-toggling same item restores empty state', () => {
    const { toggleItem } = useSelectedItemsStore.getState();
    toggleItem(mockCharacter);
    toggleItem(mockCharacter);
    const state = useSelectedItemsStore.getState();
    expect(selectSelectedList(state)).toEqual([]);
  });
});
