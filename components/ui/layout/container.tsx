import type { ReactNode } from "react";

import { Toaster } from "@/components/ui/sonner";

export const AppContainer = ({ children }: { children: ReactNode }) => {
  return (
    <>
      {children}
      <Toaster expand closeButton richColors />
    </>
  );
};
