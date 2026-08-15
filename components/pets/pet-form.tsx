"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function PetForm({
  action,
  defaults,
}: {
  action: (formData: FormData) => Promise<{ error?: string } | void>;
  defaults?: {
    name?: string;
    species?: string;
    breed?: string | null;
    birth_date?: string | null;
    notes?: string | null;
  };
}) {
  return (
    <form
      action={async (formData) => {
        await action(formData);
      }}
      className="flex max-w-lg flex-col gap-4"
    >
      <Input
        id="name"
        name="name"
        label="Namn"
        required
        defaultValue={defaults?.name}
      />
      <Select
        id="species"
        name="species"
        label="Art"
        defaultValue={defaults?.species ?? "hund"}
        options={[
          { value: "hund", label: "Hund" },
          { value: "katt", label: "Katt" },
          { value: "ovrigt", label: "Övrigt" },
        ]}
      />
      <Input
        id="breed"
        name="breed"
        label="Ras (valfritt)"
        defaultValue={defaults?.breed ?? ""}
      />
      <Input
        id="birth_date"
        name="birth_date"
        label="Födelsedatum"
        type="date"
        defaultValue={defaults?.birth_date ?? ""}
      />
      <Textarea
        id="notes"
        name="notes"
        label="Anteckningar"
        defaultValue={defaults?.notes ?? ""}
      />
      <Input id="photo" name="photo" label="Foto" type="file" accept="image/*" />
      <Button type="submit">Spara</Button>
    </form>
  );
}
