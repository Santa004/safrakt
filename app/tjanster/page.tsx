import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { clinic } from "@/lib/clinic";

const services = [
  {
    title: "Tandvård",
    body: "Vår spets. Rådgivning, undersökning och uppföljning för friskare tänder och mun.",
  },
  {
    title: "Vaccination",
    body: "Grundvaccination och påfyllnad. Håll koll på datum i appen och få påminnelse.",
  },
  {
    title: "Hälsokoll",
    body: "Genomgång av allmäntillstånd — lugnt och tydligt för dig och ditt djur.",
  },
  {
    title: "Återbesök",
    body: "Uppföljning efter tidigare vård. Boka enkelt när det passar.",
  },
];

export default function ServicesPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
      <h1 className="font-serif text-4xl text-forest">Tjänster</h1>
      <p className="mt-3 max-w-2xl text-ink/80">
        Privat smådjursklinik för hund, katt och övriga smådjur. Vid akut behov:{" "}
        <a className="underline" href={clinic.phoneHref}>
          {clinic.phone}
        </a>
        .
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {services.map((s) => (
          <Card key={s.title}>
            <h2 className="font-serif text-2xl text-forest">{s.title}</h2>
            <p className="mt-2 text-ink/80">{s.body}</p>
          </Card>
        ))}
      </div>
      <p className="mt-8 text-sm text-ink/70">{clinic.acuteNote}</p>
      <div className="mt-8">
        <Button href="/boka">Boka tid</Button>
      </div>
    </section>
  );
}
