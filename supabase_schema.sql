-- Enable Row Level Security (RLS) on all tables by default
-- Security Requirement: Zero-Trust Architecture & XSS Prevention

-- ==========================================
-- 0. SECURITY FUNCTIONS
-- ==========================================

-- Function to sanitize text input (Basic XSS Prevention at DB Level)
-- This strips <script> tags to prevent stored XSS.
CREATE OR REPLACE FUNCTION public.sanitize_input()
RETURNS TRIGGER AS $$
BEGIN
  -- Iterate over columns to sanitize (simplified for specific tables/columns)
  IF TG_TABLE_NAME = 'contact_submissions' THEN
      -- Remove script tags from message and name
      NEW.message := REGEXP_REPLACE(NEW.message, '<script\b[^>]*>(.*?)</script>', '[BLOCKED SCRIPT]', 'gi');
      NEW.full_name := REGEXP_REPLACE(NEW.full_name, '<script\b[^>]*>(.*?)</script>', '', 'gi');
      -- Remove javascript: protocol from input
      NEW.message := REGEXP_REPLACE(NEW.message, 'javascript:', '', 'gi');
  END IF;
  
  IF TG_TABLE_NAME = 'newsletter_subscribers' THEN
      -- Basic sanitization for email
      NEW.email := REGEXP_REPLACE(NEW.email, '<[^>]+>', '', 'gi');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- 1. USER & SYSTEM TABLES
-- ==========================================

-- Newsletter Subscribers
create table if not exists public.newsletter_subscribers (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.newsletter_subscribers enable row level security;

-- RLS: Public can insert (subscribe), but ONLY Admins/Service Role can view list
drop policy if exists "Allow public subscription" on public.newsletter_subscribers;
create policy "Allow public subscription"
  on public.newsletter_subscribers for insert with check (true);

drop policy if exists "Admins view subscribers" on public.newsletter_subscribers;
create policy "Admins view subscribers"
  on public.newsletter_subscribers for select using (auth.role() = 'service_role');

-- Trigger: Sanitize XSS
drop trigger if exists sanitize_newsletter on public.newsletter_subscribers;
create trigger sanitize_newsletter
  before insert or update on public.newsletter_subscribers
  for each row execute procedure public.sanitize_input();


-- Contact Submissions
create table if not exists public.contact_submissions (
  id uuid default gen_random_uuid() primary key,
  full_name text not null,
  company text,
  email text not null,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.contact_submissions enable row level security;

-- RLS: Public can insert (contact form), Only Admins can view
drop policy if exists "Allow public contact submission" on public.contact_submissions;
create policy "Allow public contact submission"
  on public.contact_submissions for insert with check (true);

drop policy if exists "Admins view messages" on public.contact_submissions;
create policy "Admins view messages"
  on public.contact_submissions for select using (auth.role() = 'service_role');

-- Trigger: Sanitize XSS
drop trigger if exists sanitize_contact on public.contact_submissions;
create trigger sanitize_contact
  before insert or update on public.contact_submissions
  for each row execute procedure public.sanitize_input();


-- User Profiles
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.profiles enable row level security;

drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
  on public.profiles for insert with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);


-- Audit Logs
create table if not exists public.audit_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  action text not null,
  details jsonb,
  ip_address text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.audit_logs enable row level security;

drop policy if exists "Admins can view audit logs" on public.audit_logs;
create policy "Admins can view audit logs"
  on public.audit_logs for select
  using (auth.jwt() ->> 'role' = 'service_role');

drop policy if exists "System can insert logs" on public.audit_logs;
create policy "System can insert logs"
  on public.audit_logs for insert
  with check (auth.uid() = user_id);

-- Trigger for Auto-Profile Creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id, 
    coalesce(new.raw_user_meta_data->>'full_name', ''), 
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    avatar_url = excluded.avatar_url;
  return new;
exception when others then
  raise warning 'Error in handle_new_user trigger: %', SQLERRM;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ==========================================
-- 2. CONTENT TABLES (Backend Driven UI)
-- ==========================================
-- Strict Policies: Public Read Only, Admin Write Only

-- Services
create table if not exists public.services (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  icon_name text not null,
  color_class text not null,
  sort_order integer default 0
);
alter table public.services enable row level security;

drop policy if exists "Public can view services" on public.services;
create policy "Public can view services" on public.services for select using (true);
-- Implicitly denies insert/update/delete for anon/authenticated (good security)

-- Courses
create table if not exists public.courses (
  id text primary key,
  title text not null,
  level text not null,
  description text not null,
  price text not null,
  image_url text not null,
  tags text[] not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.courses enable row level security;

drop policy if exists "Public can view courses" on public.courses;
create policy "Public can view courses" on public.courses for select using (true);

-- Portfolio Projects
create table if not exists public.projects (
  id bigint generated by default as identity primary key,
  title text not null,
  category text not null,
  image_url text not null,
  description text
);
alter table public.projects enable row level security;

drop policy if exists "Public can view projects" on public.projects;
create policy "Public can view projects" on public.projects for select using (true);

-- Blog Posts
create table if not exists public.blog_posts (
  id text primary key,
  title text not null,
  excerpt text not null,
  date_published text not null,
  author text not null,
  category text not null,
  image_url text not null
);
alter table public.blog_posts enable row level security;

drop policy if exists "Public can view blog posts" on public.blog_posts;
create policy "Public can view blog posts" on public.blog_posts for select using (true);

-- Ecosystem Items
create table if not exists public.ecosystem (
  id text primary key,
  title text not null,
  description text not null,
  status text not null,
  icon_name text not null,
  color_class text not null,
  link text,
  action_text text,
  sort_order integer default 0
);
alter table public.ecosystem enable row level security;

drop policy if exists "Public can view ecosystem" on public.ecosystem;
create policy "Public can view ecosystem" on public.ecosystem for select using (true);

-- Notifications (New Table for Dashboard)
create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  message text not null,
  type text default 'info', -- info, alert, success
  is_global boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.notifications enable row level security;

drop policy if exists "Users view notifications" on public.notifications;
create policy "Users view notifications" on public.notifications for select using (true);


-- ==========================================
-- 3. SEED DATA (Initial Content)
-- ==========================================

-- Seed Notifications (The School App Announcement)
INSERT INTO public.notifications (title, message, type, is_global) VALUES
('Product Launch Update', 'I''ll be publishing my School app February 15, 2026. Stay tuned!', 'success', true)
ON CONFLICT DO NOTHING;

-- Seed Services
INSERT INTO public.services (title, description, icon_name, color_class, sort_order) VALUES
('AI Solutions', 'We integrate intelligent AI models into your websites and apps to automate workflows and personalize user experiences.', 'Brain', 'bg-purple-600', 1),
('SaaS Development', 'We build scalable Software-as-a-Service platforms from scratch, handling multi-tenancy and billing.', 'Server', 'bg-indigo-600', 2),
('Web Development', 'High-performance, responsive websites built with React and Next.js.', 'Globe', 'bg-blue-500', 3),
('Mobile App Development', 'Native and cross-platform mobile apps for iOS and Android.', 'Smartphone', 'bg-indigo-500', 4),
('Custom Software', 'Tailored software solutions to automate your business processes.', 'Code', 'bg-violet-500', 5),
('UI/UX Design', 'User-centric design that looks beautiful and functions perfectly.', 'Layout', 'bg-pink-500', 6)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;

-- Seed Courses
INSERT INTO public.courses (id, title, level, description, price, image_url, tags) VALUES
('1', 'Complete Web Development Bootcamp', 'Beginner', 'Learn HTML, CSS, JavaScript, and React from scratch. Build real projects.', '$49.99', 'https://picsum.photos/400/250?random=1', ARRAY['Web Dev', 'React']),
('2', 'Python for Business Automation', 'Intermediate', 'Automate spreadsheets, emails, and data analysis tasks with Python.', '$39.99', 'https://picsum.photos/400/250?random=2', ARRAY['Python', 'Automation']),
('3', 'Mobile App Development with Flutter', 'Advanced', 'Build native iOS and Android apps using a single codebase.', '$59.99', 'https://picsum.photos/400/250?random=3', ARRAY['Mobile', 'Flutter']),
('4', 'UI/UX Design Masterclass', 'Beginner', 'Master Figma and design principles to create stunning interfaces.', '$44.99', 'https://picsum.photos/400/250?random=4', ARRAY['Design', 'Figma'])
ON CONFLICT (id) DO NOTHING;

-- Seed Portfolio
INSERT INTO public.projects (title, category, image_url, description) VALUES
('FinTrack Pro', 'Fintech App', 'https://picsum.photos/600/400?random=10', 'A comprehensive financial tracking application for personal finance management.'),
('EcoMarket', 'E-commerce Platform', 'https://picsum.photos/600/400?random=11', 'Sustainable shopping marketplace connecting eco-friendly brands with consumers.'),
('HealthConnect', 'Medical Dashboard', 'https://picsum.photos/600/400?random=12', 'Patient management and appointment scheduling dashboard for clinics.'),
('LearnLoop', 'LMS System', 'https://picsum.photos/600/400?random=13', 'Learning Management System for schools and online educators.'),
('Urban Properties', 'Real Estate Web', 'https://picsum.photos/600/400?random=14', 'Modern real estate listing website with virtual tour capabilities.'),
('FoodieExpress', 'Delivery App', 'https://picsum.photos/600/400?random=15', 'Fast and reliable food delivery application with live tracking.')
ON CONFLICT DO NOTHING;

-- Seed Blog
INSERT INTO public.blog_posts (id, title, excerpt, date_published, author, category, image_url) VALUES
('1', 'Top 10 React Libraries for 2024', 'Discover the essential tools that will speed up your frontend development workflow this year.', 'Oct 12, 2023', 'Sarah Johnson', 'Development', 'https://picsum.photos/800/400?random=20'),
('2', 'How to Scale Your Startup Tech Stack', 'A guide for non-technical founders on choosing the right technology for growth.', 'Oct 08, 2023', 'Mike Chen', 'Business', 'https://picsum.photos/800/400?random=21'),
('3', 'Understanding TypeScript Generics', 'Deep dive into one of the most powerful features of TypeScript with practical examples.', 'Sep 25, 2023', 'Alex Rivera', 'Tutorial', 'https://picsum.photos/800/400?random=22')
ON CONFLICT (id) DO NOTHING;

-- Seed Ecosystem
INSERT INTO public.ecosystem (id, title, description, status, icon_name, color_class, link, action_text, sort_order) VALUES
('schools_app', 'Schools App', 'The all-in-one management platform for schools.', 'Coming Soon', 'School', 'bg-indigo-600', null, null, 1),
('labs', 'Oliskey Labs', 'Product innovation and design.', 'Coming Soon', 'FlaskConical', 'bg-pink-500', null, null, 2),
('systems', 'Oliskey Systems', 'SaaS platforms and infrastructure.', 'Coming Soon', 'Server', 'bg-blue-500', null, null, 3),
('ai', 'Oliskey AI', 'Intelligent tools and integrations.', 'Coming Soon', 'Brain', 'bg-purple-600', null, null, 4),
('education', 'Oliskey Education', 'School platforms, courses, and learning tools.', 'Live', 'GraduationCap', 'bg-green-500', '/app', 'Check the App', 5),
('media', 'Oliskey Media', 'Tutorials, videos, and creator-first content.', 'Coming Soon', 'Video', 'bg-red-500', null, null, 6)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, icon_name = EXCLUDED.icon_name, color_class = EXCLUDED.color_class;

-- 4. Permissions
alter default privileges revoke execute on functions from public;