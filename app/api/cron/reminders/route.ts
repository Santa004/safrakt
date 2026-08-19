import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendReminderEmail } from "@/lib/email";
import { clinic } from "@/lib/clinic";
import { formatSlot } from "@/lib/slots";

export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return NextResponse.json(
      { error: "Supabase service role saknas" },
      { status: 500 },
    );
  }

  const supabase = createClient(url, serviceKey);
  const now = new Date().toISOString();

  const { data: jobs, error } = await supabase
    .from("reminder_jobs")
    .select(
      "id, kind, channel, owner_id, appointment_id, vaccination_id, appointments(starts_at), vaccinations(vaccine_name, due_on)",
    )
    .is("sent_at", null)
    .lte("send_at", now)
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let sent = 0;
  for (const job of jobs ?? []) {
    const { data: userData } = await supabase.auth.admin.getUserById(job.owner_id);
    const email = userData.user?.email;
    if (!email) continue;

    let subject = `Påminnelse från ${clinic.name}`;
    let text = `Hej! Detta är en påminnelse från ${clinic.name}.`;

    if (job.kind === "24h" || job.kind === "2h") {
      const starts = (job.appointments as { starts_at?: string } | null)?.starts_at;
      const when = starts ? formatSlot(new Date(starts)) : "din bokade tid";
      subject =
        job.kind === "24h"
          ? `Imorgon: tid hos ${clinic.name}`
          : `Snart: tid hos ${clinic.name}`;
      text = `Hej!\n\nPåminnelse om ditt besök ${when}.\n\nAvbokning senast 24 timmar innan — ring ${clinic.phone} vid behov.\n\n${clinic.name}`;
    }

    if (job.kind === "vaccine") {
      const v = job.vaccinations as { vaccine_name?: string; due_on?: string } | null;
      subject = `Vaccinationspåminnelse — ${clinic.name}`;
      text = `Hej!\n\n${v?.vaccine_name ?? "Vaccination"} närmar sig (${v?.due_on ?? "snart"}). Boka tid i appen eller ring ${clinic.phone}.\n\n${clinic.name}`;
    }

    if (job.channel === "email" || job.channel === "push") {
      // Push i fas 1 faller tillbaka till e-post
      await sendReminderEmail({ to: email, subject, text });
    }

    await supabase
      .from("reminder_jobs")
      .update({ sent_at: new Date().toISOString() })
      .eq("id", job.id);
    sent += 1;
  }

  return NextResponse.json({ ok: true, sent });
}
