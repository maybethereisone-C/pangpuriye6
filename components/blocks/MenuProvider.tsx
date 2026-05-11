"use client";

import { createContext, useCallback, useContext, useState } from "react";

interface MenuContextValue {
  open: boolean;
  setOpen: (next: boolean) => void;
  toggle: () => void;
}

const MenuContext = createContext<MenuContextValue | null>(null);

export function useMenu(): MenuContextValue {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error("useMenu must be inside <MenuProvider>");
  return ctx;
}

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((o) => !o), []);
  return (
    <MenuContext.Provider value={{ open, setOpen, toggle }}>{children}</MenuContext.Provider>
  );
}
