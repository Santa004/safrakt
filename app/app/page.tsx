import { requireUser } from "@/lib/auth";
import { formatSlot } from "@/lib/slots";
import { Button } from "@/components/ui/button";
import { PetCard } from "@/components/pets/pet-card";
import { Card } from "@/components/ui/card";

export default async function AppHomePage() {
  const { supabase, user } = await requireUser();

  const { data: next } = await supabase
    .from("appointments")
    .select("starts_at, pets(name), appointment_types(title_sv)")
    .eq("owner_id", user.id)
    .eq("status", "booked")
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  const { data: pets } = await supabase
    .from("pets")
    .select("id, name, species, photo_path")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: true })
    .limit(4);

  const { data: offers } = await supabase
    .from("offers")
    .select("id, title")
    .eq("published", true)
    .limit(2);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-serif text-3xl text-forest">Översikt</h1>
        <p className="mt-2 text-ink/75">Här ser du nästa tid och dina djur.</p>
      </div>

      <Card>
        <p className="text-sm text-ink/60">Nästa tid</p>
        {next ? (
          <div className="mt-2">
            <p className="font-serif text-2xl text-forest">
              {formatSlot(new Date(next.starts_at))}
            </p>
            <p className="text-ink/80">
              {(next.appointment_types as { title_sv?: string } | null)?.title_sv}{" "}
              · {(next.pets as { name?: string } | null)?.name}
            </p>
          </div>
        ) : (
          <p className="mt-2 text-ink/75">Ingen bokad tid.</p>
        )}
        <div className="mt-4">
          <Button href="/boka">Boka tid</Button>
        </div>
      </Card>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl text-forest">Mina djur</h2>
          <Button href="/app/djur" variant="ghost">
            Visa alla
          </Button>
        </div>
        {pets?.length ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {await Promise.all(
              pets.map(async (pet) => {
                let photoUrl: string | null = null;
                if (pet.photo_path) {
                  const { data } = await supabase.storage
                    .from("pet-photos")
                    .createSignedUrl(pet.photo_path, 3600);
                  photoUrl = data?.signedUrl ?? null;
                }
                return <PetCard key={pet.id} pet={pet} photoUrl={photoUrl} />;
              }),
            )}
          </div>
        ) : (
          <Button href="/app/djur/ny">Lägg till ditt första djur</Button>
        )}
      </section>

      {offers?.length ? (
        <section>
          <h2 className="font-serif text-2xl text-forest">Erbjudanden</h2>
          <ul className="mt-3 space-y-2">
            {offers.map((o) => (
              <li key={o.id}>
                <Button href="/app/erbjudanden" variant="ghost" className="px-0">
                  {o.title}
                </Button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="rounded border border-dashed border-ink/20 px-4 py-3 text-sm text-ink/70">
        Tips: Lägg till appen på hemskärmen för snabbare tillgång och påminnelser.
      </p>
    </div>
  );
}
