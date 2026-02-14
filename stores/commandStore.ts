import { create } from 'zustand';

interface CommandStoreState {
  isOpen: boolean;
  query: string;
}

interface CommandStoreActions {
  open: () => void;
  close: () => void;
  toggle: () => void;
  setQuery: (query: string) => void;
  reset: () => void;
}

type CommandStore = CommandStoreState & CommandStoreActions;

export const useCommandStore = create<CommandStore>((set) => ({
  isOpen: false,
  query: '',

  open: () => set({ isOpen: true, query: '' }),
  close: () => set({ isOpen: false, query: '' }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen, query: '' })),
  setQuery: (query) => set({ query }),
  reset: () => set({ isOpen: false, query: '' }),
}));
