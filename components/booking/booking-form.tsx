"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

export function BookingForm({
  action,
  pets,
  types,
  slots,
  defaultPetId,
}: {
  action: (formData: FormData) => Promise<{ error?: string } | void>;
  pets: { id: string; name: string }[];
  types: { id: string; title: string }[];
  slots: { value: string; label: string }[];
  defaultPetId?: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="flex max-w-lg flex-col gap-4"
      action={(formData) => {
        startTransition(async () => {
          const result = await action(formData);
          if (result && "error" in result && result.error) {
            setError(result.error);
          }
        });
      }}
    >
      <Select
        id="pet_id"
        name="pet_id"
        label="Djur"
        defaultValue={defaultPetId ?? pets[0]?.id}
        options={pets.map((p) => ({ value: p.id, label: p.name }))}
      />
      <Select
        id="type_id"
        name="type_id"
        label="Tjänst"
        defaultValue={types[0]?.id}
        options={types.map((t) => ({ value: t.id, label: t.title }))}
      />
      <Select
        id="starts_at"
        name="starts_at"
        label="Tid"
        defaultValue={slots[0]?.value}
        options={
          slots.length
            ? slots.map((s) => ({ value: s.value, label: s.label }))
            : [{ value: "", label: "Inga lediga tider" }]
        }
      />
      {error ? <p className="text-sm text-ink/80">{error}</p> : null}
      <Button type="submit" disabled={pending || !slots.length}>
        Bekräfta bokning
      </Button>
    </form>
  );
}
