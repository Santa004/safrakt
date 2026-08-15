import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export function EmptyState({
  title,
  body,
  actionHref,
  actionLabel,
}: {
  title: string;
  body: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="flex flex-col items-start gap-4 border border-dashed border-ink/20 bg-cream px-5 py-10">
      <h2 className="font-serif text-2xl text-forest">{title}</h2>
      <p className="max-w-md text-ink/75">{body}</p>
      {actionHref && actionLabel ? (
        <Button href={actionHref}>{actionLabel}</Button>
      ) : null}
    </div>
  );
}
