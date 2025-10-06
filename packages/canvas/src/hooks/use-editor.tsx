import { EditorContext } from "@/providers/editor-provider";
import React from "react";

export const useEditor = () => {
  const context = React.useContext(EditorContext);

  if (!context) {
    throw new Error("useEditor hook must be used within the editor provider");
  }

  return context;
};
