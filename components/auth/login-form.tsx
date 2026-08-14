"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onPasswordLogin(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setMessage(null);

    const supabase = createClient();
    if (!supabase) {
      setMessage("Supabase är inte konfigurerat. Lägg till nycklar i .env.local.");
      setPending(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setPending(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    router.push("/");
    router.refresh();
  }

  async function onMagicLink() {
    setPending(true);
    setMessage(null);

    const supabase = createClient();
    if (!supabase) {
      setMessage("Supabase är inte konfigurerat. Lägg till nycklar i .env.local.");
      setPending(false);
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setPending(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Kolla din e-post för inloggningslänken.");
  }

  return (
    <form onSubmit={onPasswordLogin} className="flex flex-col gap-4">
      <Input
        id="email"
        label="E-post"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        id="password"
        label="Lösenord"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {message ? <p className="text-sm text-ink/80">{message}</p> : null}
      <Button type="submit" disabled={pending}>
        Logga in med lösenord
      </Button>
      <Button
        type="button"
        variant="secondary"
        disabled={pending || !email}
        onClick={onMagicLink}
      >
        Skicka magisk länk
      </Button>
    </form>
  );
}
