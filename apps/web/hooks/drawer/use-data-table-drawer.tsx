import { create } from 'zustand';

interface useDataTableDrawerProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: (open: boolean) => void;
}

export const useDataTableDrawer = create<useDataTableDrawerProps>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false}),
  onToggle: (open: boolean) => set({ isOpen: open })
}));