import { requireUser } from "@/lib/auth";
import { createVaccination } from "@/app/app/vaccinationer/actions";
import { VaccinationForm } from "@/components/vaccinations/vaccination-form";
import { Card } from "@/components/ui/card";

export default async function VaccinationsPage() {
  const { supabase, user } = await requireUser();

  const { data: pets } = await supabase
    .from("pets")
    .select("id, name")
    .eq("owner_id", user.id);

  const { data: rows } = await supabase
    .from("vaccinations")
    .select("id, vaccine_name, given_on, due_on, pets(name)")
    .eq("owner_id", user.id)
    .order("due_on", { ascending: true });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-forest">Vaccinationer</h1>
        <p className="mt-2 text-ink/75">
          Håll koll på datum — vi skapar e-postpåminnelse en vecka innan förfall.
        </p>
      </div>

      <VaccinationForm pets={pets ?? []} action={createVaccination} />

      <ul className="space-y-3">
        {(rows ?? []).map((row) => (
          <li key={row.id}>
            <Card>
              <p className="font-medium">
                {row.vaccine_name} · {(row.pets as { name?: string } | null)?.name}
              </p>
              <p className="text-sm text-ink/70">
                Förfaller {row.due_on}
                {row.given_on ? ` · givet ${row.given_on}` : ""}
              </p>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
