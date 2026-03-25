/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export type Collapsible = "offcanvas" | "icon" | "none";
export type Variant = "inset" | "sidebar" | "floating";

const DEFAULT_VARIANT: Variant = "inset";
const DEFAULT_COLLAPSIBLE: Collapsible = "icon";

type LayoutContextType = {
  collapsible: Collapsible;
  setCollapsible: (collapsible: Collapsible) => void;
  variant: Variant;
  setVariant: (variant: Variant) => void;
};

const LayoutContext = createContext<LayoutContextType | null>(null);

type LayoutProviderProps = {
  children: ReactNode;
};

export function LayoutProvider({ children }: LayoutProviderProps) {
  const [collapsible, setCollapsible] =
    useState<Collapsible>(DEFAULT_COLLAPSIBLE);
  const [variant, setVariant] = useState<Variant>(DEFAULT_VARIANT);

  return (
    <LayoutContext value={{ collapsible, setCollapsible, variant, setVariant }}>
      {children}
    </LayoutContext>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
}
