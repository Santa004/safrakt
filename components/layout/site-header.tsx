import Link from "next/link";
import { clinic } from "@/lib/clinic";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/", label: "Hem" },
  { href: "/login", label: "Logga in" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-ink/10 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex min-h-16 max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="font-serif text-lg text-forest sm:text-xl">
          {clinic.name}
        </Link>
        <nav className="flex items-center gap-1 sm:gap-3" aria-label="Huvudmeny">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex min-h-11 items-center px-2 text-sm text-ink/80 hover:text-forest"
            >
              {link.label}
            </Link>
          ))}
          <Button href="/signup" variant="primary" className="ml-1 hidden sm:inline-flex">
            Skapa konto
          </Button>
        </nav>
      </div>
    </header>
  );
}
