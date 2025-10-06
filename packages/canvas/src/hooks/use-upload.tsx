export type UploadFunction = (file: File) => Promise<string>; // returns uploaded file URL

export interface CanvasUploadAPI {
  upload: UploadFunction;
}

import React, { createContext, useContext } from "react";

const UploadContext = createContext<CanvasUploadAPI | null>(null);

export const CanvasUploadProvider: React.FC<{ api: CanvasUploadAPI; children: React.ReactNode }> = ({
  api,
  children,
}) => {
  return <UploadContext.Provider value={api}>{children}</UploadContext.Provider>;
};

export const useCanvasUpload = () => {
  const context = useContext(UploadContext);
  if (!context) throw new Error("useCanvasUpload must be used within CanvasUploadProvider");
  return context;
};