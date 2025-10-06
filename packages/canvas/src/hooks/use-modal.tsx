'use client';

import { ModalContext, ModalContextType } from "@/providers/modal-provider";
import React from "react";

export const useModal = (): ModalContextType => {
  const context = React.useContext(ModalContext);

  if (!context) {
    throw new Error("useModal hook must be used within the modal provider");
  }

  return context;
};
