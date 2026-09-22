"use client";

import { createContext, useContext, useMemo, useState } from "react";

type TwinContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
};

const TwinContext = createContext<TwinContextValue | null>(null);

export function TwinProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const value = useMemo(
    () => ({
      open,
      setOpen,
      toggle: () => setOpen((current) => !current),
    }),
    [open],
  );

  return <TwinContext.Provider value={value}>{children}</TwinContext.Provider>;
}

export function useTwin(): TwinContextValue {
  const context = useContext(TwinContext);
  if (!context) {
    throw new Error("useTwin requires TwinProvider");
  }
  return context;
}
