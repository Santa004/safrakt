import { Button } from "@/components/ui/button";
import { clinic } from "@/lib/clinic";

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
      <h1 className="font-serif text-4xl text-forest">Kontakt</h1>
      <div className="mt-8 grid gap-10 sm:grid-cols-2">
        <div className="space-y-3 text-ink/85">
          <p>
            <span className="block text-sm text-ink/60">Adress</span>
            {clinic.address}
            <br />
            {clinic.postal}
          </p>
          <p>
            <span className="block text-sm text-ink/60">Telefon</span>
            <a className="underline-offset-2 hover:underline" href={clinic.phoneHref}>
              {clinic.phone}
            </a>
          </p>
          <p>
            <span className="block text-sm text-ink/60">E-post</span>
            <a
              className="underline-offset-2 hover:underline"
              href={`mailto:${clinic.email}`}
            >
              {clinic.email}
            </a>
          </p>
          <Button href="/boka">Boka tid</Button>
        </div>
        <div>
          <h2 className="font-serif text-2xl text-forest">Öppettider</h2>
          <ul className="mt-3 space-y-2 text-ink/85">
            {clinic.hours.map((row) => (
              <li key={row.days}>
                {row.days}: {row.time}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-ink/70">{clinic.acuteNote}</p>
        </div>
      </div>
    </section>
  );
}
