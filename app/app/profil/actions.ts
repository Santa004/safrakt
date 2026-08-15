"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { profileSchema } from "@/lib/validations";

export async function updateProfile(formData: FormData) {
  const { supabase, user } = await requireUser();
  const parsed = profileSchema.safeParse({
    full_name: formData.get("full_name"),
    phone: formData.get("phone") || undefined,
  });

  if (!parsed.success) {
    return { error: "Ange namn." };
  }

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    full_name: parsed.data.full_name,
    phone: parsed.data.phone ?? null,
  });

  if (error) return { error: "Kunde inte spara profil." };

  revalidatePath("/app/profil");
  return { ok: true };
}

export async function signOut() {
  const { supabase } = await requireUser();
  await supabase.auth.signOut();
}
