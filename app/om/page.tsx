import { clinic } from "@/lib/clinic";

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
      <h1 className="font-serif text-4xl text-forest">Om kliniken</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink/80">
        {clinic.legalName} är en lokal privat smådjursklinik i Mantorp. Vi vill
        att besöket ska kännas tryggt, kompetent och nära — inte som en kedja.
      </p>
      <p className="mt-4 max-w-2xl text-ink/80">
        Tandvård är vår spets. Utöver det hjälper vi till med vaccination,
        hälsokoll och återbesök. Akuta ärenden bedöms via telefon.
      </p>
      <div className="mt-10 border-l-2 border-brass pl-4">
        <p className="font-medium text-ink">{clinic.address}</p>
        <p className="text-ink/80">{clinic.postal}</p>
      </div>
    </section>
  );
}
