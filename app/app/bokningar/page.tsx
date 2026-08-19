import { requireUser } from "@/lib/auth";
import { formatSlot } from "@/lib/slots";
import { cancelBooking } from "@/app/boka/actions";
import { CancelBookingButton } from "@/components/booking/cancel-button";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Card } from "@/components/ui/card";

export default async function BookingsPage() {
  const { supabase, user } = await requireUser();

  const { data: rows } = await supabase
    .from("appointments")
    .select("id, starts_at, status, cancel_until, pets(name), appointment_types(title_sv)")
    .eq("owner_id", user.id)
    .order("starts_at", { ascending: false });

  if (!rows?.length) {
    return (
      <EmptyState
        title="Inga bokningar ännu"
        body="När du bokat en tid syns den här. Avbokning senast 24 timmar innan besöket."
        actionHref="/boka"
        actionLabel="Boka tid"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-forest">Bokningar</h1>
        <Button href="/boka">Boka ny</Button>
      </div>
      <p className="text-sm text-ink/70">
        Avbokning senast 24 timmar innan. Ring kliniken om det är bråttom.
      </p>
      <ul className="space-y-3">
        {rows.map((row) => {
          const petName = (row.pets as { name?: string } | null)?.name ?? "Djur";
          const typeName =
            (row.appointment_types as { title_sv?: string } | null)?.title_sv ??
            "Tid";
          const canCancel =
            row.status === "booked" &&
            new Date(row.cancel_until).getTime() > Date.now();

          return (
            <li key={row.id}>
              <Card className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-ink">
                    {typeName} · {petName}
                  </p>
                  <p className="text-sm text-ink/70">
                    {formatSlot(new Date(row.starts_at))} · {row.status}
                  </p>
                </div>
                {canCancel ? (
                  <CancelBookingButton
                    appointmentId={row.id}
                    action={cancelBooking}
                  />
                ) : null}
              </Card>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
