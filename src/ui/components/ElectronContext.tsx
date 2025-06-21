import React, { createContext, useContext } from "react";

declare global {
  interface Window {
    electronAPI: {
      send: (channel: string, data?: any) => void;
      on: (channel: string, callback: (event: any, data: any) => void) => void;
    };
  }
}

const ElectronContext = createContext<Window["electronAPI"] | null>(null);

export const ElectronProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (!window.electronAPI) {
    console.error("⚠️ electronAPI is not defined on window. Check your preload script.");
    return <>{children}</>; // fallback: allow rendering without API
  }

  return (
    <ElectronContext.Provider value={window.electronAPI}>
      {children}
    </ElectronContext.Provider>
  );
};


export const useElectron = () => {
  const ctx = useContext(ElectronContext);
  if (!ctx) throw new Error("useElectron must be used within ElectronProvider");
  return ctx;
};
