import type { CSSProperties, ReactNode } from "react";

type Props = {
  href: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  eyebrow?: string;
  title?: string;
  body?: string;
};

/** Kept as a plain link so legacy callers can never trap navigation in an “updating” modal. */
export function DataUpdatingLink({ href, className, style, children }: Props) {
  return <a href={href} className={className} style={style}>{children}</a>;
}
