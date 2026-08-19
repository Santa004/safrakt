import Link from "next/link";

const links = [
  { href: "/app", label: "Översikt" },
  { href: "/app/djur", label: "Mina djur" },
  { href: "/app/bokningar", label: "Bokningar" },
  { href: "/app/vaccinationer", label: "Vaccinationer" },
  { href: "/app/erbjudanden", label: "Erbjudanden" },
  { href: "/app/profil", label: "Profil" },
];

export function AppNav() {
  return (
    <nav
      aria-label="Appmeny"
      className="border-b border-ink/10 bg-cream"
    >
      <div className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 py-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="inline-flex min-h-11 shrink-0 items-center px-3 text-sm text-ink/80 hover:text-forest"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
