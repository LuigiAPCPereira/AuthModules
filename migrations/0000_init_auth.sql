-- migrations/0000_init_auth.sql

-- 1. Create custom profiles table tied to auth.users
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on profiles table
alter table public.profiles enable row level security;
alter table public.profiles force row level security;

-- 2. RLS Policies

-- Policy: Users can view their own profile
-- Rationale: Ensures a user can only query their own data
create policy "Users can view own profile" 
on public.profiles
for select 
to authenticated
using ( (select auth.uid()) = id );

-- Policy: Users can update their own profile
-- Rationale: Users should be able to edit their own profile details
create policy "Users can update own profile" 
on public.profiles
for update 
to authenticated
using ( (select auth.uid()) = id );

-- Removed INSERT policy because profiles are created securely via database triggers.
-- This prevents attackers from trying to manually insert mismatching profiles via the API.

-- 3. Automatic Row Update for updated_at (Optional but recommended)
create extension if not exists moddatetime schema extensions;

create trigger handle_updated_at before update on public.profiles
  for each row execute procedure moddatetime (updated_at);

-- 4. Trigger to automatically create a profile for new users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
