import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { generateSlots, formatSlot } from "@/lib/slots";
import { createBooking } from "@/app/boka/actions";
import { Button } from "@/components/ui/button";
import { BookingForm } from "@/components/booking/booking-form";

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ pet?: string }>;
}) {
  const { pet: petPref } = await searchParams;
  const supabase = await createClient();

  const { data: types } = supabase
    ? await supabase
        .from("appointment_types")
        .select("id, title_sv, slug")
        .eq("active", true)
        .order("title_sv")
    : { data: null };

  let user = null;
  let pets: { id: string; name: string }[] = [];
  let bookedStarts: string[] = [];

  if (supabase) {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    user = authUser;

    if (user) {
      const { data: petRows } = await supabase
        .from("pets")
        .select("id, name")
        .eq("owner_id", user.id);
      pets = petRows ?? [];

      const { data: booked } = await supabase
        .from("appointments")
        .select("starts_at")
        .eq("status", "booked")
        .gte("starts_at", new Date().toISOString());
      bookedStarts = (booked ?? []).map((b) => b.starts_at);
    }
  }

  const slots = generateSlots(new Date(), 14, bookedStarts);

  if (!user) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="font-serif text-4xl text-forest">Boka tid</h1>
        <p className="mt-3 max-w-xl text-ink/80">
          Du kan titta på tjänstetyper som gäst. För att välja djur och bekräfta
          tid behöver du logga in.
        </p>
        <ul className="mt-6 list-disc space-y-1 pl-5 text-ink/80">
          {(types ?? []).map((t) => (
            <li key={t.id}>{t.title_sv}</li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-ink/70">
          Akut? Ring kliniken — boka inte akut via appen.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/login">Logga in för att boka</Button>
          <Button href="/signup" variant="secondary">
            Skapa konto
          </Button>
        </div>
      </section>
    );
  }

  if (!pets.length) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="font-serif text-4xl text-forest">Boka tid</h1>
        <p className="mt-3 text-ink/80">
          Lägg till ett djur först, sedan kan du boka.
        </p>
        <Button href="/app/djur/ny" className="mt-6">
          Lägg till djur
        </Button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="font-serif text-4xl text-forest">Boka tid</h1>
      <p className="mt-2 text-sm text-ink/70">
        Avbokning senast 24 timmar innan besöket. Ingen avgiftslogik i appen än.
      </p>
      <div className="mt-8">
        <BookingForm
          action={createBooking}
          pets={pets}
          types={(types ?? []).map((t) => ({ id: t.id, title: t.title_sv }))}
          slots={slots.map((s) => ({
            value: s.toISOString(),
            label: formatSlot(s),
          }))}
          defaultPetId={petPref}
        />
      </div>
      <p className="mt-6 text-sm">
        <Link href="/app/bokningar" className="underline">
          Mina bokningar
        </Link>
      </p>
    </section>
  );
}
