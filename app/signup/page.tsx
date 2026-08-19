import Link from "next/link";
import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <section className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-12">
      <div>
        <h1 className="font-serif text-3xl text-forest">Skapa konto</h1>
        <p className="mt-2 text-sm text-ink/70">
          För Mina djur och bokning. BankID kommer senare.
        </p>
      </div>
      <SignupForm />
      <p className="text-sm text-ink/70">
        Har du redan konto?{" "}
        <Link href="/login" className="text-forest underline-offset-2 hover:underline">
          Logga in
        </Link>
      </p>
    </section>
  );
}
