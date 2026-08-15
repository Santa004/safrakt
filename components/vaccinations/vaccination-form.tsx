"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function VaccinationForm({
  pets,
  action,
}: {
  pets: { id: string; name: string }[];
  action: (formData: FormData) => Promise<{ error?: string; ok?: boolean }>;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (!pets.length) {
    return <p className="text-ink/70">Lägg till ett djur innan du sparar vaccinationer.</p>;
  }

  return (
    <form
      className="flex max-w-lg flex-col gap-4"
      action={(fd) => {
        startTransition(async () => {
          const result = await action(fd);
          setMessage(result.error ?? "Sparad.");
        });
      }}
    >
      <Select
        id="pet_id"
        name="pet_id"
        label="Djur"
        options={pets.map((p) => ({ value: p.id, label: p.name }))}
        defaultValue={pets[0].id}
      />
      <Input id="vaccine_name" name="vaccine_name" label="Vaccin" required />
      <Input id="given_on" name="given_on" label="Givet datum" type="date" />
      <Input id="due_on" name="due_on" label="Nästa dos / förfaller" type="date" required />
      {message ? <p className="text-sm text-ink/75">{message}</p> : null}
      <Button type="submit" disabled={pending}>
        Spara vaccination
      </Button>
    </form>
  );
}
