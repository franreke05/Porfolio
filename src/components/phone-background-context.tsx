"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";

type PhoneBackgroundTargetContextValue = {
  projectTargetRef: RefObject<HTMLElement | null>;
  registerProjectTarget: (node: HTMLElement | null) => void;
  targetVersion: number;
};

const PhoneBackgroundTargetContext =
  createContext<PhoneBackgroundTargetContextValue | null>(null);

export function PhoneBackgroundProvider({ children }: { children: ReactNode }) {
  const projectTargetRef = useRef<HTMLElement | null>(null);
  const [targetVersion, setTargetVersion] = useState(0);

  const registerProjectTarget = useCallback((node: HTMLElement | null) => {
    if (projectTargetRef.current === node) return;

    projectTargetRef.current = node;
    setTargetVersion((version) => version + 1);
  }, []);

  const value = useMemo(
    () => ({ projectTargetRef, registerProjectTarget, targetVersion }),
    [registerProjectTarget, targetVersion],
  );

  return (
    <PhoneBackgroundTargetContext.Provider value={value}>
      {children}
    </PhoneBackgroundTargetContext.Provider>
  );
}

export function usePhoneBackgroundTarget() {
  const context = useContext(PhoneBackgroundTargetContext);

  if (!context) {
    throw new Error("usePhoneBackgroundTarget must be used inside PhoneBackgroundProvider");
  }

  return context;
}
