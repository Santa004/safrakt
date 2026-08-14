"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setMessage(null);

    const supabase = createClient();
    if (!supabase) {
      setMessage("Supabase är inte konfigurerat. Lägg till nycklar i .env.local.");
      setPending(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setPending(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Konto skapat. Bekräfta e-post om kliniken kräver det, annars logga in.");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Input
        id="signup-email"
        label="E-post"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        id="signup-password"
        label="Lösenord"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {message ? <p className="text-sm text-ink/80">{message}</p> : null}
      <Button type="submit" disabled={pending}>
        Skapa konto
      </Button>
    </form>
  );
}
