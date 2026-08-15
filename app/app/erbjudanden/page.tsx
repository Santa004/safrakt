import { requireUser } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

export default async function OffersPage() {
  const { supabase } = await requireUser();

  const { data: offers } = await supabase
    .from("offers")
    .select("id, title, body")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (!offers?.length) {
    return (
      <EmptyState
        title="Inga erbjudanden just nu"
        body="När kliniken publicerar information syns den här. Inga priser eller kampanjer påhittas i appen."
      />
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl text-forest">Erbjudanden & info</h1>
      <ul className="space-y-4">
        {offers.map((offer) => (
          <li key={offer.id}>
            <Card>
              <h2 className="font-serif text-2xl text-forest">{offer.title}</h2>
              <p className="mt-2 whitespace-pre-wrap text-ink/80">{offer.body}</p>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
