-- Enable Row Level Security (RLS) on all tables by default
-- Security Requirement: Zero-Trust Architecture

-- 1. Newsletter Subscribers
create table if not exists public.newsletter_subscribers (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.newsletter_subscribers enable row level security;

-- Idempotent Policy Creation (Drop first to avoid 42710 errors)
drop policy if exists "Allow public subscription" on public.newsletter_subscribers;
create policy "Allow public subscription"
  on public.newsletter_subscribers for insert with check (true);

-- 2. Contact Submissions
create table if not exists public.contact_submissions (
  id uuid default gen_random_uuid() primary key,
  full_name text not null,
  company text,
  email text not null,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.contact_submissions enable row level security;

drop policy if exists "Allow public contact submission" on public.contact_submissions;
create policy "Allow public contact submission"
  on public.contact_submissions for insert with check (true);

-- 3. User Profiles (Syncs with auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.profiles enable row level security;

-- Profile Policies
drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
  on public.profiles for insert with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- 4. Audit Logs (Immutable Security Ledger)
create table if not exists public.audit_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  action text not null,
  details jsonb,
  ip_address text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.audit_logs enable row level security;

-- Audit Log Policies (Zero-Trust: No one can delete/update logs)
drop policy if exists "Admins can view audit logs" on public.audit_logs;
create policy "Admins can view audit logs"
  on public.audit_logs for select
  using (auth.jwt() ->> 'role' = 'service_role');

drop policy if exists "System can insert logs" on public.audit_logs;
create policy "System can insert logs"
  on public.audit_logs for insert
  with check (auth.uid() = user_id);

-- 5. Triggers for Auto-Profile Creation
-- This ensures every Google OAuth sign-in creates a corresponding profile entry
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Drop existing trigger if exists to avoid conflicts during migration
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 6. Security Hardening
alter default privileges revoke execute on functions from public;
