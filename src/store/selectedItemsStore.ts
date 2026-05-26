import { create } from 'zustand';
import type { Character } from '../types';

interface SelectedItemsState {
  selectedItems: Record<number, Character>;
  toggleItem: (character: Character) => void;
  unselectAll: () => void;
}

export const useSelectedItemsStore = create<SelectedItemsState>((set) => ({
  selectedItems: {},

  toggleItem: (character) =>
    set((state) => {
      const { [character.id]: existing, ...rest } = state.selectedItems;
      if (existing) {
        return { selectedItems: rest };
      }
      return { selectedItems: { ...rest, [character.id]: character } };
    }),

  unselectAll: () => set({ selectedItems: {} }),
}));

export const selectSelectedCount = (state: SelectedItemsState): number =>
  Object.keys(state.selectedItems).length;

export const selectSelectedList = (state: SelectedItemsState): Character[] =>
  Object.values(state.selectedItems);
