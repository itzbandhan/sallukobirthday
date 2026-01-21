-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Table: invitation_settings
create table invitation_settings (
  id uuid primary key default uuid_generate_v4(),
  title text not null default 'You''re invited to Sallu''s 18th Birthday',
  date_text text not null default 'March 04, 2026 (Saturday)',
  venue_text text not null default 'Galyang, Syangja — Venue Name',
  subtitle text default null,
  theme_variant text default 'cute-pastel',
  emoji text default '🩷',
  confetti_enabled boolean default true,
  emoji_overlay_enabled boolean default true,
  open_button_text text default 'Tap to Open',
  generic_message text default null,
  updated_at timestamp with time zone default now()
);

-- Insert default row
insert into invitation_settings (title, date_text, venue_text, subtitle)
values ('You''re invited to Sallu''s 18th Birthday', 'March 04, 2026 (Saturday)', 'Galyang, Syangja — Venue Name', 'Come celebrate with us!');


-- Table: recipients
create table recipients (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  invite_type text check (invite_type in ('single', 'couple', 'special')) not null default 'single',
  name_single text,
  name_partner1 text,
  name_partner2 text,
  custom_message text,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

-- RLS Policies
alter table invitation_settings enable row level security;
alter table recipients enable row level security;

-- Public Read Access
create policy "Allow public read settings" on invitation_settings for select using (true);
create policy "Allow public read recipients" on recipients for select using (true);

-- Admin Write Access
-- For INSERT, we must use WITH CHECK
create policy "Allow internal insert settings" on invitation_settings for insert with check (auth.role() = 'authenticated');
create policy "Allow internal update settings" on invitation_settings for update using (auth.role() = 'authenticated');

-- For recipients, handle all write operations
create policy "Allow internal insert recipients" on recipients for insert with check (auth.role() = 'authenticated');
create policy "Allow internal update recipients" on recipients for update using (auth.role() = 'authenticated');
create policy "Allow internal delete recipients" on recipients for delete using (auth.role() = 'authenticated');
