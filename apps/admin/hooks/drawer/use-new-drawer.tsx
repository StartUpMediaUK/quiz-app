import { create } from 'zustand';

interface useNewDrawerProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: (open: boolean) => void;
}

export const useNewDrawer = create<useNewDrawerProps>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false}),
  onToggle: (open: boolean) => set({ isOpen: open })
}));