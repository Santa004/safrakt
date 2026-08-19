"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ProfileForm({
  defaults,
  updateAction,
  signOutAction,
}: {
  defaults: { full_name: string; phone: string; email: string };
  updateAction: (formData: FormData) => Promise<{ error?: string; ok?: boolean }>;
  signOutAction: () => Promise<void>;
}) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex max-w-lg flex-col gap-8">
      <form
        className="flex flex-col gap-4"
        action={(fd) => {
          startTransition(async () => {
            const result = await updateAction(fd);
            setMessage(result.error ?? "Profil sparad.");
          });
        }}
      >
        <Input
          id="full_name"
          name="full_name"
          label="Namn"
          required
          defaultValue={defaults.full_name}
        />
        <Input
          id="phone"
          name="phone"
          label="Telefon"
          defaultValue={defaults.phone}
        />
        <Input
          id="email"
          name="email"
          label="E-post"
          defaultValue={defaults.email}
          disabled
        />
        {message ? <p className="text-sm text-ink/75">{message}</p> : null}
        <Button type="submit" disabled={pending}>
          Spara
        </Button>
      </form>

      <Button
        type="button"
        variant="secondary"
        onClick={() => {
          startTransition(async () => {
            await signOutAction();
            router.push("/");
            router.refresh();
          });
        }}
      >
        Logga ut
      </Button>
    </div>
  );
}
