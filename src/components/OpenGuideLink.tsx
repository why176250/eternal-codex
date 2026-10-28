"use client";

import type { ReactNode } from "react";

export function OpenGuideLink({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href="#profession-guide"
      className={className}
      onClick={() => {
        const details = document.getElementById("profession-guide");
        if (details instanceof HTMLDetailsElement) details.open = true;
      }}
    >
      {children}
    </a>
  );
}
