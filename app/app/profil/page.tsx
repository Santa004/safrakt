import { requireUser } from "@/lib/auth";
import { updateProfile, signOut } from "@/app/app/profil/actions";
import { ProfileForm } from "@/components/auth/profile-form";

export default async function ProfilePage() {
  const { supabase, user } = await requireUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-forest">Profil</h1>
        <p className="mt-2 text-sm text-ink/70">
          BankID är inte aktiverat i MVP. Logga in med e-post och lösenord eller
          magisk länk.
        </p>
      </div>
      <ProfileForm
        defaults={{
          full_name: profile?.full_name ?? "",
          phone: profile?.phone ?? "",
          email: user.email ?? "",
        }}
        updateAction={updateProfile}
        signOutAction={signOut}
      />
    </div>
  );
}
