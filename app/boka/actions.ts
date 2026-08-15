"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { bookingSchema } from "@/lib/validations";
import { clinic } from "@/lib/clinic";

export async function createBooking(formData: FormData) {
  const { supabase, user } = await requireUser();
  const parsed = bookingSchema.safeParse({
    pet_id: formData.get("pet_id"),
    type_id: formData.get("type_id"),
    starts_at: formData.get("starts_at"),
  });

  if (!parsed.success) {
    return { error: "Ogiltig bokning." };
  }

  const starts = new Date(parsed.data.starts_at);
  const ends = new Date(
    starts.getTime() + clinic.schedule.slotMinutes * 60_000,
  );
  const cancelUntil = new Date(starts.getTime() - 24 * 60 * 60_000);

  const { data: appointment, error } = await supabase
    .from("appointments")
    .insert({
      owner_id: user.id,
      pet_id: parsed.data.pet_id,
      type_id: parsed.data.type_id,
      starts_at: starts.toISOString(),
      ends_at: ends.toISOString(),
      status: "booked",
      cancel_until: cancelUntil.toISOString(),
    })
    .select("id")
    .single();

  if (error) {
    return {
      error:
        error.code === "23505"
          ? "Tiden är redan bokad. Välj en annan slot."
          : "Kunde inte boka. Kontrollera databasen.",
    };
  }

  const reminders = [
    {
      owner_id: user.id,
      appointment_id: appointment.id,
      channel: "email",
      kind: "24h",
      send_at: new Date(starts.getTime() - 24 * 60 * 60_000).toISOString(),
    },
    {
      owner_id: user.id,
      appointment_id: appointment.id,
      channel: "email",
      kind: "2h",
      send_at: new Date(starts.getTime() - 2 * 60 * 60_000).toISOString(),
    },
  ].filter((r) => new Date(r.send_at).getTime() > Date.now());

  if (reminders.length) {
    await supabase.from("reminder_jobs").insert(reminders);
  }

  revalidatePath("/app");
  revalidatePath("/app/bokningar");
  redirect("/app/bokningar");
}

export async function cancelBooking(appointmentId: string) {
  const { supabase, user } = await requireUser();

  const { data: appointment } = await supabase
    .from("appointments")
    .select("id, cancel_until, status")
    .eq("id", appointmentId)
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!appointment || appointment.status !== "booked") {
    return { error: "Bokningen hittades inte." };
  }

  if (new Date(appointment.cancel_until).getTime() < Date.now()) {
    return {
      error: "Avbokning ska ske senast 24 timmar innan besöket. Ring kliniken.",
    };
  }

  const { error } = await supabase
    .from("appointments")
    .update({ status: "cancelled" })
    .eq("id", appointmentId)
    .eq("owner_id", user.id);

  if (error) return { error: "Kunde inte avboka." };

  revalidatePath("/app/bokningar");
  revalidatePath("/app");
  return { ok: true };
}
