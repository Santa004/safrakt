import { Button } from "@/components/ui/button";
import { clinic } from "@/lib/clinic";

export default function HomePage() {
  return (
    <div>
      <section className="relative min-h-[70vh] overflow-hidden bg-forest">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(154,123,79,0.25),transparent_45%),radial-gradient(circle_at_80%_60%,rgba(243,238,228,0.12),transparent_40%)]"
          aria-hidden
        />
        <div className="relative mx-auto flex max-w-5xl flex-col justify-end gap-6 px-4 pb-16 pt-28 text-cream sm:pb-20 sm:pt-36">
          <p className="font-serif text-4xl leading-tight sm:text-6xl">{clinic.name}</p>
          <p className="max-w-lg text-base text-cream/85 sm:text-lg">
            Trygg lokal vård i Mantorp — med tandvård som spets. Sköt dina djur,
            boka tid och få påminnelser på ett ställe.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button href="/boka" className="bg-cream text-forest hover:bg-cream/90">
              Boka tid
            </Button>
            <Button
              href="/app"
              variant="secondary"
              className="border-cream/40 text-cream hover:border-brass"
            >
              Mina djur
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="font-serif text-3xl text-forest">Tandvård i fokus</h2>
        <p className="mt-3 max-w-2xl text-ink/80">
          Många husdjur får tandproblem som går att förebygga. Vi hjälper dig med
          rådgivning, undersökning och uppföljning — nära hemma i Mantorp.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/tjanster">Se tjänster</Button>
          <Button href="/kontakt" variant="secondary">
            Kontakta oss
          </Button>
        </div>
      </section>
    </div>
  );
}
