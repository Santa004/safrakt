import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { updatePet } from "@/app/app/djur/actions";
import { PetForm } from "@/components/pets/pet-form";

export default async function EditPetPage({
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

  const action = updatePet.bind(null, petId);

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl text-forest">Redigera {pet.name}</h1>
      <PetForm
        action={action}
        defaults={{
          name: pet.name,
          species: pet.species,
          breed: pet.breed,
          birth_date: pet.birth_date,
          notes: pet.notes,
        }}
      />
    </div>
  );
}
