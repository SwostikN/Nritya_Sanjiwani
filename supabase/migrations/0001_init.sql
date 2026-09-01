-- =============================================================
-- Nritya Sanjiwani — initial schema
--
-- Design note: the content model mirrors lib/content.ts. Most of
-- the site is ordered lists of short records, so those share one
-- `collections` table keyed by collection name, with the field
-- shape defined in lib/schema.ts. That keeps one well-built
-- editor screen instead of twenty half-built ones. Things with
-- real structure or real privacy needs — submissions, media,
-- users — get their own tables.
-- =============================================================

-- ---------- who can edit ----------
create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text,
  name       text,
  role       text not null default 'editor' check (role in ('admin','editor')),
  created_at timestamptz not null default now()
);
comment on table public.profiles is
  'admin = everything. editor = journal, gallery and submissions only (volunteers).';

create or replace function public.role_of(uid uuid) returns text
  language sql stable security definer set search_path = public as
$$ select role from public.profiles where id = uid $$;

create or replace function public.is_admin() returns boolean
  language sql stable security definer set search_path = public as
$$ select coalesce(public.role_of(auth.uid()) = 'admin', false) $$;

create or replace function public.is_staff() returns boolean
  language sql stable security definer set search_path = public as
$$ select public.role_of(auth.uid()) in ('admin','editor') $$;

-- every new auth user gets a profile; the first one ever created is the admin
create or replace function public.handle_new_user() returns trigger
  language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, name, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', ''),
          case when (select count(*) from public.profiles) = 0 then 'admin' else 'editor' end);
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users for each row execute function public.handle_new_user();

-- ---------- editable content ----------
create table public.collections (
  id         uuid primary key default gen_random_uuid(),
  collection text not null,
  sort       integer not null default 0,
  data       jsonb not null default '{}'::jsonb,
  published  boolean not null default true,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);
create index collections_lookup on public.collections (collection, sort);

-- singletons: contact details, section visibility, page ledes
create table public.site_settings (
  key        text primary key,
  value      jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ---------- uploaded images ----------
create table public.media (
  id         uuid primary key default gen_random_uuid(),
  path       text not null unique,
  alt        text not null,
  caption    text,
  credit     text,
  width      integer,
  height     integer,
  bytes      integer,
  mime       text,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  -- PRD §14: alt text is a required field on every image upload
  constraint media_alt_present check (length(btrim(alt)) > 0)
);

-- ---------- what the public sends us ----------
create table public.partner_enquiries (
  id         uuid primary key,
  created_at timestamptz not null default now(),
  name       text not null,
  org        text,
  email      text not null,
  phone      text,
  interest   text,
  message    text,
  status     text not null default 'new' check (status in ('new','read','replied','archived')),
  notes      text
);

create table public.applications (
  id           uuid primary key,
  created_at   timestamptz not null default now(),
  name         text not null,
  age          text not null,
  contact      text not null,
  community    text,
  experience   text,
  access       text,
  why          text,
  consent_data  boolean not null default false,
  consent_media boolean not null default false,
  status       text not null default 'new' check (status in ('new','reviewing','accepted','declined','archived')),
  notes        text,
  -- Applications carry personal data collected under an explicit consent
  -- checkbox. Keeping them forever is not what that consent covers, so every
  -- row carries its own expiry from the day it arrives.
  delete_after date not null default (current_date + interval '24 months')
);
comment on column public.applications.delete_after is
  'Retention limit. Rows past this date should be deleted — see the retention job in the admin.';

create table public.newsletter_subscribers (
  id              uuid primary key,
  created_at      timestamptz not null default now(),
  email           text not null unique,
  unsubscribed_at timestamptz
);

-- =============================================================
-- Row level security
--
-- The public site reads published content with the publishable
-- key. Nothing else is reachable without a session: submissions
-- have no anonymous policy at all, so applications can never be
-- read from a browser even if the publishable key leaks.
-- =============================================================
alter table public.profiles              enable row level security;
alter table public.collections           enable row level security;
alter table public.site_settings         enable row level security;
alter table public.media                 enable row level security;
alter table public.partner_enquiries     enable row level security;
alter table public.applications          enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- content: world-readable when published, staff-readable always
create policy "published content is public" on public.collections
  for select using (published or public.is_staff());
create policy "settings are public"          on public.site_settings for select using (true);
create policy "media is public"              on public.media         for select using (true);

-- content: admins write anything; editors only the collections they own
create policy "admins write content" on public.collections
  for all using (public.is_admin()) with check (public.is_admin());
create policy "editors write their collections" on public.collections
  for all using  (public.role_of(auth.uid()) = 'editor' and collection in ('journal','gallery_groups','gallery_items'))
      with check (public.role_of(auth.uid()) = 'editor' and collection in ('journal','gallery_groups','gallery_items'));

create policy "admins write settings" on public.site_settings
  for all using (public.is_admin()) with check (public.is_admin());
create policy "staff write media" on public.media
  for all using (public.is_staff()) with check (public.is_staff());

-- profiles: you can always see yourself; admins see and manage everyone
create policy "read own profile"   on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "admins manage users" on public.profiles for all using (public.is_admin()) with check (public.is_admin());

-- submissions: staff read, admins update/delete. No insert policy —
-- the forms write through the server with the secret key, so a
-- browser can never write directly.
create policy "staff read enquiries"    on public.partner_enquiries     for select using (public.is_staff());
create policy "staff read applications" on public.applications          for select using (public.is_staff());
create policy "staff read subscribers"  on public.newsletter_subscribers for select using (public.is_staff());
create policy "admins manage enquiries"    on public.partner_enquiries     for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage applications" on public.applications          for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage subscribers"  on public.newsletter_subscribers for all using (public.is_admin()) with check (public.is_admin());

-- =============================================================
-- Storage for uploaded images
-- =============================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "media images are public" on storage.objects
  for select using (bucket_id = 'media');
create policy "staff upload media" on storage.objects
  for insert with check (bucket_id = 'media' and public.is_staff());
create policy "staff update media" on storage.objects
  for update using (bucket_id = 'media' and public.is_staff());
create policy "admins delete media" on storage.objects
  for delete using (bucket_id = 'media' and public.is_admin());
