"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { petSchema } from "@/lib/validations";

export async function createPet(formData: FormData) {
  const { supabase, user } = await requireUser();
  const parsed = petSchema.safeParse({
    name: formData.get("name"),
    species: formData.get("species"),
    breed: formData.get("breed") || undefined,
    birth_date: formData.get("birth_date") || undefined,
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ogiltiga uppgifter" };
  }

  let photo_path: string | null = null;
  const photo = formData.get("photo");
  if (photo instanceof File && photo.size > 0) {
    const ext = photo.name.split(".").pop() || "jpg";
    const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("pet-photos")
      .upload(path, photo, { upsert: false });
    if (uploadError) {
      return { error: "Kunde inte ladda upp foto." };
    }
    photo_path = path;
  }

  const { data, error } = await supabase
    .from("pets")
    .insert({
      owner_id: user.id,
      ...parsed.data,
      birth_date: parsed.data.birth_date || null,
      photo_path,
    })
    .select("id")
    .single();

  if (error) {
    return { error: "Kunde inte spara djuret. Kontrollera att databasen är migrerad." };
  }

  revalidatePath("/app/djur");
  redirect(`/app/djur/${data.id}`);
}

export async function updatePet(petId: string, formData: FormData) {
  const { supabase, user } = await requireUser();
  const parsed = petSchema.safeParse({
    name: formData.get("name"),
    species: formData.get("species"),
    breed: formData.get("breed") || undefined,
    birth_date: formData.get("birth_date") || undefined,
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ogiltiga uppgifter" };
  }

  const updates: Record<string, unknown> = {
    ...parsed.data,
    birth_date: parsed.data.birth_date || null,
  };

  const photo = formData.get("photo");
  if (photo instanceof File && photo.size > 0) {
    const ext = photo.name.split(".").pop() || "jpg";
    const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("pet-photos")
      .upload(path, photo, { upsert: false });
    if (uploadError) {
      return { error: "Kunde inte ladda upp foto." };
    }
    updates.photo_path = path;
  }

  const { error } = await supabase
    .from("pets")
    .update(updates)
    .eq("id", petId)
    .eq("owner_id", user.id);

  if (error) {
    return { error: "Kunde inte uppdatera djuret." };
  }

  revalidatePath(`/app/djur/${petId}`);
  redirect(`/app/djur/${petId}`);
}
