import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { PetCard } from "@/components/pets/pet-card";
import { formatSlot } from "@/lib/slots";

export default async function PetsPage() {
  const { supabase, user } = await requireUser();

  const { data: pets } = await supabase
    .from("pets")
    .select("id, name, species, photo_path")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: true });

  if (!pets?.length) {
    return (
      <EmptyState
        title="Dags att lägga till ditt första djur"
        body="Precis som du lägger in dina fordon i Autodock — här lägger du in hunden, katten eller det lilla sällskapet. Ett foto och ett namn räcker för att komma igång."
        actionHref="/app/djur/ny"
        actionLabel="Lägg till djur"
      />
    );
  }

  const { data: appointments } = await supabase
    .from("appointments")
    .select("pet_id, starts_at")
    .eq("owner_id", user.id)
    .eq("status", "booked")
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true });

  const nextByPet = new Map<string, string>();
  for (const a of appointments ?? []) {
    if (!nextByPet.has(a.pet_id)) {
      nextByPet.set(a.pet_id, formatSlot(new Date(a.starts_at)));
    }
  }

  const cards = await Promise.all(
    pets.map(async (pet) => {
      let photoUrl: string | null = null;
      if (pet.photo_path) {
        const { data } = await supabase.storage
          .from("pet-photos")
          .createSignedUrl(pet.photo_path, 3600);
        photoUrl = data?.signedUrl ?? null;
      }
      return (
        <PetCard
          key={pet.id}
          pet={pet}
          nextEvent={nextByPet.get(pet.id)}
          photoUrl={photoUrl}
        />
      );
    }),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-serif text-3xl text-forest">Mina djur</h1>
        <Button href="/app/djur/ny">Lägg till</Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">{cards}</div>
      <p className="text-sm text-ink/60">
        <Link href="/boka" className="underline-offset-2 hover:underline">
          Boka tid
        </Link>
      </p>
    </div>
  );
}
