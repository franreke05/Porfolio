"use client";

import { useCallback, type ReactNode } from "react";
import { usePhoneBackgroundTarget } from "@/components/phone-background-context";

type ProjectScrollTargetProps = {
  id: string;
  className?: string;
  children: ReactNode;
};

export function ProjectScrollTarget({ id, className, children }: ProjectScrollTargetProps) {
  const { registerProjectTarget } = usePhoneBackgroundTarget();

  const setTargetRef = useCallback(
    (node: HTMLElement | null) => {
      registerProjectTarget(node);
    },
    [registerProjectTarget],
  );

  return (
    <section id={id} ref={setTargetRef} className={className}>
      {children}
    </section>
  );
}
