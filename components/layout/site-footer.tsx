import { clinic } from "@/lib/clinic";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-ink/10 bg-forest text-cream">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:grid-cols-2">
        <div>
          <p className="font-serif text-xl">{clinic.name}</p>
          <p className="mt-2 text-sm text-cream/80">{clinic.legalName}</p>
          <p className="mt-4 text-sm">
            {clinic.address}
            <br />
            {clinic.postal}
          </p>
          <p className="mt-3 text-sm">
            <a className="underline-offset-2 hover:underline" href={clinic.phoneHref}>
              {clinic.phone}
            </a>
            <br />
            <a
              className="underline-offset-2 hover:underline"
              href={`mailto:${clinic.email}`}
            >
              {clinic.email}
            </a>
          </p>
        </div>
        <div>
          <p className="text-sm font-medium">Öppettider</p>
          <ul className="mt-2 space-y-1 text-sm text-cream/85">
            {clinic.hours.map((row) => (
              <li key={row.days}>
                {row.days}: {row.time}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-cream/75">{clinic.acuteNote}</p>
        </div>
      </div>
    </footer>
  );
}
