-- Run this once in Supabase: Project > SQL Editor > New query > paste > Run

create table if not exists media (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('photo', 'video', 'reel')),
  url text not null,
  caption text default '',
  duration text default '',
  created_at timestamptz not null default now()
);

alter table media enable row level security;

-- Anyone (including visitors who aren't logged in) can view media —
-- this is what makes the public website pages work.
create policy "Public can view media"
  on media for select
  using (true);

-- Only a logged-in admin (authenticated in Supabase Auth) can add media.
create policy "Authenticated can insert media"
  on media for insert
  to authenticated
  with check (true);

-- Only a logged-in admin can delete media.
create policy "Authenticated can delete media"
  on media for delete
  to authenticated
  using (true);

-- Only a logged-in admin can edit/update media (needed for the "Update" button).
create policy "Authenticated can update media"
  on media for update
  to authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------
-- CONTACT FORM LEADS (replaces the Google Sheet — saved straight
-- into the database instead)
-- ---------------------------------------------------------------

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text default '',
  email text default '',
  phone text default '',
  message text default '',
  created_at timestamptz not null default now()
);

alter table leads enable row level security;

-- Anyone visiting the site (not logged in) can submit the contact
-- form — this is what lets the public Contact page work.
create policy "Anyone can submit a lead"
  on leads for insert
  to anon, authenticated
  with check (true);

-- Only the logged-in admin can view submitted leads.
create policy "Authenticated can view leads"
  on leads for select
  to authenticated
  using (true);

-- Only the logged-in admin can delete leads.
create policy "Authenticated can delete leads"
  on leads for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------------
-- STORAGE: after running the above, also do this in the dashboard:
-- Storage > Create a new bucket > name it exactly:  media
-- Toggle "Public bucket" ON when creating it.
-- Then come back here and run the policies below.
-- ---------------------------------------------------------------

create policy "Public can view files"
  on storage.objects for select
  using (bucket_id = 'media');

create policy "Authenticated can upload files"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media');

create policy "Authenticated can delete files"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media');
