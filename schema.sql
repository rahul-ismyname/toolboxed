-- MASTER SCHEMA
-- Copy and run this in your Supabase SQL Editor to verify/update your database.
-- It is safe to run multiple times (it uses 'if not exists' and 'or replace').

-- ==========================================
-- 1. INVOICES & VIRAL LOOPS
-- ==========================================

-- Table: Stores invoice data JSON + metadata for the Community Gallery
create table if not exists invoices (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  data jsonb not null,
  
  -- Community Gallery Columns
  title text,
  description text,
  is_public boolean default false,
  views integer default 0,
  downloads integer default 0
);

-- Function: Increment view count for invoices safely
create or replace function increment_invoice_views(row_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update invoices
  set views = views + 1
  where id = row_id;
end;
$$;

-- Security: Enable RLS but allow public access (Pilot Mode)
alter table invoices enable row level security;

-- Drop policy if it exists to avoid errors on re-run
drop policy if exists "Enable all access for invoices" on invoices;

create policy "Enable all access for invoices"
  on invoices for all
  using ( true )
  with check ( true );


-- ==========================================
-- 2. LINK SHORTENER
-- ==========================================

-- Table: Stores the mapping between short codes and original URLs
create table if not exists short_links (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  original_url text not null,
  short_code text not null unique,
  clicks integer default 0
);

-- Function: Increment click count for links safely
create or replace function increment_link_clicks(code_param text)
returns void
language plpgsql
security definer
as $$
begin
  update short_links
  set clicks = clicks + 1
  where short_code = code_param;
end;
$$;

-- Security: Allow public creation and reading of links
alter table short_links enable row level security;

-- Drop policy if it exists to avoid errors on re-run
drop policy if exists "Enable all access for short_links" on short_links;

create policy "Enable all access for short_links"
  on short_links for all
  using ( true )
  with check ( true );
