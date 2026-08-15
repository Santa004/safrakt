import { clinic } from "@/lib/clinic";

type ReminderPayload = {
  to: string;
  subject: string;
  text: string;
};

export async function sendReminderEmail(payload: ReminderPayload) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.info("[reminders] RESEND_API_KEY saknas — loggar endast", payload);
    return { ok: true, skipped: true };
  }

  const from = process.env.RESEND_FROM_EMAIL ?? clinic.email;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: payload.to,
      subject: payload.subject,
      text: payload.text,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend fel: ${body}`);
  }

  return { ok: true };
}
