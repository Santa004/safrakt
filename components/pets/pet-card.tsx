import Link from "next/link";
import { Card } from "@/components/ui/card";

const speciesLabel: Record<string, string> = {
  hund: "Hund",
  katt: "Katt",
  ovrigt: "Övrigt",
};

export function PetCard({
  pet,
  nextEvent,
  photoUrl,
}: {
  pet: { id: string; name: string; species: string };
  nextEvent?: string | null;
  photoUrl?: string | null;
}) {
  return (
    <Link href={`/app/djur/${pet.id}`} className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest">
      <Card className="flex gap-4 transition hover:border-brass/60">
        <div className="h-20 w-20 shrink-0 overflow-hidden bg-forest/10">
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-ink/40">
              Foto
            </div>
          )}
        </div>
        <div>
          <p className="font-serif text-xl text-forest">{pet.name}</p>
          <p className="text-sm text-ink/70">{speciesLabel[pet.species] ?? pet.species}</p>
          <p className="mt-2 text-sm text-ink/80">
            {nextEvent ? `Nästa: ${nextEvent}` : "Ingen kommande händelse"}
          </p>
        </div>
      </Card>
    </Link>
  );
}
