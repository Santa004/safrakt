-- Fas 1 schema: owner → pet → appointment → clinical_visit (tom)

create extension if not exists "pgcrypto";

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  bankid_sub text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (id = auth.uid());

create policy "profiles_update_own"
  on public.profiles for update
  using (id = auth.uid());

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (id = auth.uid());

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create table public.pets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  species text not null,
  breed text,
  birth_date date,
  photo_path text,
  notes text,
  created_at timestamptz not null default now()
);

create index pets_owner_id_idx on public.pets (owner_id);
alter table public.pets enable row level security;

create policy "pets_all_own"
  on public.pets for all
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create table public.appointment_types (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_sv text not null,
  duration_min int not null default 20,
  active boolean not null default true
);

alter table public.appointment_types enable row level security;

create policy "appointment_types_public_read_active"
  on public.appointment_types for select
  using (active = true);

insert into public.appointment_types (slug, title_sv, duration_min) values
  ('vaccination', 'Vaccination', 20),
  ('halsokoll', 'Hälsokoll', 20),
  ('tandradgivning', 'Tandrådgivning', 20),
  ('aterbesok', 'Återbesök', 20),
  ('ovrigt', 'Övrigt', 20);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  pet_id uuid not null references public.pets (id) on delete cascade,
  type_id uuid not null references public.appointment_types (id),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'booked' check (status in ('booked', 'cancelled', 'completed')),
  cancel_until timestamptz not null,
  created_at timestamptz not null default now(),
  unique (starts_at)
);

create index appointments_owner_id_idx on public.appointments (owner_id);
create index appointments_pet_id_idx on public.appointments (pet_id);
alter table public.appointments enable row level security;

create policy "appointments_all_own"
  on public.appointments for all
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create table public.clinical_visits (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid not null unique references public.appointments (id) on delete cascade,
  pet_id uuid not null references public.pets (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.clinical_visits enable row level security;
-- Fas 1: ingen klientaccess
create policy "clinical_visits_deny_all"
  on public.clinical_visits for all
  using (false)
  with check (false);

create table public.vaccinations (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets (id) on delete cascade,
  owner_id uuid not null references public.profiles (id) on delete cascade,
  vaccine_name text not null,
  given_on date,
  due_on date not null,
  created_at timestamptz not null default now()
);

create index vaccinations_owner_id_idx on public.vaccinations (owner_id);
alter table public.vaccinations enable row level security;

create policy "vaccinations_all_own"
  on public.vaccinations for all
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create table public.reminder_jobs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  appointment_id uuid references public.appointments (id) on delete cascade,
  vaccination_id uuid references public.vaccinations (id) on delete cascade,
  channel text not null check (channel in ('email', 'push')),
  kind text not null check (kind in ('24h', '2h', 'vaccine')),
  send_at timestamptz not null,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create index reminder_jobs_send_at_idx on public.reminder_jobs (send_at) where sent_at is null;
alter table public.reminder_jobs enable row level security;

create policy "reminder_jobs_select_own"
  on public.reminder_jobs for select
  using (owner_id = auth.uid());

create policy "reminder_jobs_insert_own"
  on public.reminder_jobs for insert
  with check (owner_id = auth.uid());

create table public.offers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  active_from timestamptz not null default now(),
  active_to timestamptz,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.offers enable row level security;

create policy "offers_authenticated_read"
  on public.offers for select
  to authenticated
  using (
    published = true
    and active_from <= now()
    and (active_to is null or active_to >= now())
  );

insert into public.offers (title, body) values
  (
    'Tandvårdsinfo',
    'Regelbundna tandkontroller hjälper oss upptäcka problem tidigt. Boka tandrådgivning via appen eller ring receptionen.'
  ),
  (
    'Vaccinationssäsong',
    'Håll koll på nästa vaccinationsdatum under Vaccinationer. Vi skickar påminnelse innan det är dags.'
  );

insert into storage.buckets (id, name, public)
values ('pet-photos', 'pet-photos', false)
on conflict (id) do nothing;

create policy "pet_photos_select_own"
  on storage.objects for select
  using (bucket_id = 'pet-photos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "pet_photos_insert_own"
  on storage.objects for insert
  with check (bucket_id = 'pet-photos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "pet_photos_update_own"
  on storage.objects for update
  using (bucket_id = 'pet-photos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "pet_photos_delete_own"
  on storage.objects for delete
  using (bucket_id = 'pet-photos' and (storage.foldername(name))[1] = auth.uid()::text);
