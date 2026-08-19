import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { formatSlot } from "@/lib/slots";

export default async function PetDetailPage({
  params,
}: {
  params: Promise<{ petId: string }>;
}) {
  const { petId } = await params;
  const { supabase, user } = await requireUser();

  const { data: pet } = await supabase
    .from("pets")
    .select("*")
    .eq("id", petId)
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!pet) notFound();

  let photoUrl: string | null = null;
  if (pet.photo_path) {
    const { data } = await supabase.storage
      .from("pet-photos")
      .createSignedUrl(pet.photo_path, 3600);
    photoUrl = data?.signedUrl ?? null;
  }

  const { data: appointments } = await supabase
    .from("appointments")
    .select("id, starts_at, status, appointment_types(title_sv)")
    .eq("pet_id", petId)
    .order("starts_at", { ascending: false })
    .limit(10);

  const { data: vaccinations } = await supabase
    .from("vaccinations")
    .select("id, vaccine_name, due_on, given_on")
    .eq("pet_id", petId)
    .order("due_on", { ascending: true })
    .limit(10);

  type TimelineItem = { at: string; label: string; kind: string };
  const timeline: TimelineItem[] = [
    ...(appointments ?? []).map((a) => ({
      at: a.starts_at,
      label: `${a.status === "cancelled" ? "Avbokad" : "Bokning"}: ${(a.appointment_types as { title_sv?: string } | null)?.title_sv ?? "Tid"}`,
      kind: "appointment",
    })),
    ...(vaccinations ?? []).map((v) => ({
      at: `${v.due_on}T00:00:00.000Z`,
      label: `Vaccin: ${v.vaccine_name}${v.given_on ? " (given)" : " (förfaller)"}`,
      kind: "vaccine",
    })),
  ].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <div className="h-40 w-40 overflow-hidden bg-forest/10">
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoUrl} alt="" className="h-full w-full object-cover" />
          ) : null}
        </div>
        <div className="flex-1 space-y-3">
          <h1 className="font-serif text-4xl text-forest">{pet.name}</h1>
          <p className="text-ink/70 capitalize">{pet.species}</p>
          {pet.breed ? <p className="text-sm text-ink/70">{pet.breed}</p> : null}
          <div className="flex flex-wrap gap-3 pt-2">
            <Button href={`/boka?pet=${pet.id}`}>Boka tid</Button>
            <Button href={`/app/djur/${pet.id}/redigera`} variant="secondary">
              Redigera
            </Button>
          </div>
        </div>
      </div>

      <section>
        <h2 className="font-serif text-2xl text-forest">Tidslinje</h2>
        {timeline.length === 0 ? (
          <p className="mt-3 text-ink/70">
            Ingen historik ännu.{" "}
            <Link href="/boka" className="underline">
              Boka första tiden
            </Link>
            .
          </p>
        ) : (
          <ul className="mt-4 space-y-3 border-l border-ink/15 pl-4">
            {timeline.map((item) => (
              <li key={`${item.kind}-${item.at}-${item.label}`} className="text-sm">
                <span className="text-ink/50">
                  {item.kind === "appointment"
                    ? formatSlot(new Date(item.at))
                    : new Date(item.at).toLocaleDateString("sv-SE")}
                </span>
                <p className="text-ink">{item.label}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
