"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { vaccinationSchema } from "@/lib/validations";

export async function createVaccination(formData: FormData) {
  const { supabase, user } = await requireUser();
  const parsed = vaccinationSchema.safeParse({
    pet_id: formData.get("pet_id"),
    vaccine_name: formData.get("vaccine_name"),
    given_on: formData.get("given_on") || undefined,
    due_on: formData.get("due_on"),
  });

  if (!parsed.success) {
    return { error: "Ogiltiga vaccinationsuppgifter." };
  }

  const { data, error } = await supabase
    .from("vaccinations")
    .insert({
      owner_id: user.id,
      pet_id: parsed.data.pet_id,
      vaccine_name: parsed.data.vaccine_name,
      given_on: parsed.data.given_on || null,
      due_on: parsed.data.due_on,
    })
    .select("id")
    .single();

  if (error) {
    return { error: "Kunde inte spara vaccination." };
  }

  const due = new Date(`${parsed.data.due_on}T09:00:00`);
  const sendAt = new Date(due.getTime() - 7 * 24 * 60 * 60_000);
  if (sendAt.getTime() > Date.now()) {
    await supabase.from("reminder_jobs").insert({
      owner_id: user.id,
      vaccination_id: data.id,
      channel: "email",
      kind: "vaccine",
      send_at: sendAt.toISOString(),
    });
  }

  revalidatePath("/app/vaccinationer");
  revalidatePath(`/app/djur/${parsed.data.pet_id}`);
  return { ok: true };
}
