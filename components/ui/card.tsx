import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`border border-ink/10 bg-cream p-4 sm:p-5 ${className}`}>
      {children}
    </div>
  );
}
