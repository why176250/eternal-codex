"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";

type Props = {
  href: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

export function DataUpdatingLink({ href, className, style, children }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [open]);

  return (
    <>
      <a
        href={href}
        className={className}
        style={style}
        aria-haspopup="dialog"
        onClick={(event) => {
          event.preventDefault();
          setOpen(true);
        }}
      >
        {children}
      </a>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="BiS data updating"
            className="panel w-full max-w-md p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">BiS · Data updating</p>
                <h2 className="display mt-2 text-xl text-parchment">
                  Gear data is still being verified
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-muted transition-colors hover:text-parchment"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              We are re-checking the BiS lists and farm order against the launch
              data. The gear planner will open after launch.
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-5 rounded-lg border border-line px-4 py-2 text-xs text-muted transition-colors hover:border-gold/40 hover:text-parchment"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
