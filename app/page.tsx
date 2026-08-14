import { Button } from "@/components/ui/button";
import { clinic } from "@/lib/clinic";

export default function HomePage() {
  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-16 sm:py-24">
      <p className="font-serif text-4xl leading-tight text-forest sm:text-5xl">
        {clinic.name}
      </p>
      <p className="max-w-xl text-lg text-ink/80">
        Premium hub för dig och dina djur — bokning och mina sidor kommer i nästa
        steg. Tandvård är vår spets.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button href="/signup">Skapa konto</Button>
        <Button href="/login" variant="secondary">
          Logga in
        </Button>
      </div>
    </section>
  );
}
