-- Oliskey website: messages from the Contact & Support form.
-- Run once in the website's Supabase project (SQL editor). Safe to re-run.

create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null check (char_length(name) between 2 and 100),
  email       text not null check (char_length(email) between 5 and 200 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone       text check (phone is null or char_length(phone) <= 40),
  topic       text not null check (topic in ('sales', 'support', 'quote', 'partnership', 'other')),
  product     text check (product is null or product in ('school', 'fleet', 'alpha', 'labs')),
  message     text not null check (char_length(message) between 10 and 4000),
  user_id     uuid references auth.users (id) on delete set null,
  status      text not null default 'new' check (status in ('new', 'in_progress', 'resolved')),
  page        text check (page is null or char_length(page) <= 200)
);

create index if not exists contact_messages_created_at_idx on public.contact_messages (created_at desc);
create index if not exists contact_messages_user_id_idx on public.contact_messages (user_id);

alter table public.contact_messages enable row level security;

-- Anyone may send a message. A signed-in sender can only attach their own user id; status always starts as 'new'.
drop policy if exists "anyone can send a message" on public.contact_messages;
create policy "anyone can send a message" on public.contact_messages
  for insert to anon, authenticated
  with check (status = 'new' and (user_id is null or user_id = auth.uid()));

-- Signed-in customers can read only their own messages. Nobody can update or delete through the API.
drop policy if exists "customers read their own messages" on public.contact_messages;
create policy "customers read their own messages" on public.contact_messages
  for select to authenticated
  using (user_id = auth.uid());

-- Inserts must not be able to read other rows back: only the columns needed, and only own rows (policy above).
revoke all on public.contact_messages from anon, authenticated;
grant insert (id, name, email, phone, topic, product, message, user_id, page) on public.contact_messages to anon, authenticated;
grant select (id, created_at, topic, product, message, status, user_id) on public.contact_messages to authenticated;
