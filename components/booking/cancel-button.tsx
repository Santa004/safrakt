"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";

export function CancelBookingButton({
  appointmentId,
  action,
}: {
  appointmentId: string;
  action: (id: string) => Promise<{ error?: string; ok?: boolean }>;
}) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-start gap-1">
      <Button
        type="button"
        variant="secondary"
        disabled={pending}
        onClick={() => {
          startTransition(async () => {
            const result = await action(appointmentId);
            if (result.error) setMessage(result.error);
            else setMessage("Avbokad.");
          });
        }}
      >
        Avboka
      </Button>
      {message ? <p className="text-xs text-ink/70">{message}</p> : null}
    </div>
  );
}
