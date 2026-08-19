import { createPet } from "@/app/app/djur/actions";
import { PetForm } from "@/components/pets/pet-form";

export default function NewPetPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-forest">Nytt djur</h1>
        <p className="mt-2 max-w-lg text-ink/75">
          Välkommen. Börja med namn och art — resten kan du fylla i när du vill.
        </p>
      </div>
      <PetForm action={createPet} />
    </div>
  );
}
