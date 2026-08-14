import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <section className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-12">
      <div>
        <h1 className="font-serif text-3xl text-forest">Logga in</h1>
        <p className="mt-2 text-sm text-ink/70">
          Använd e-post och lösenord, eller magisk länk.
        </p>
      </div>
      <LoginForm />
      <p className="text-sm text-ink/70">
        Inget konto?{" "}
        <Link href="/signup" className="text-forest underline-offset-2 hover:underline">
          Skapa konto
        </Link>
      </p>
    </section>
  );
}
