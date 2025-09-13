import type { Dispatch, SetStateAction } from "react";

type UseDrawer = {
  isOpen: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  changeState: Dispatch<SetStateAction<boolean>>;
}

export type { UseDrawer };

