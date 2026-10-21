-- Edu Mentor AI — database schema
-- Run this in the Supabase dashboard: SQL Editor -> New query -> Run.
-- Safe to re-run; everything is idempotent.

-- ---------------------------------------------------------------------------
-- Children
-- ---------------------------------------------------------------------------
create table if not exists public.child_profiles (
  id          uuid primary key default gen_random_uuid(),
  parent_id   uuid not null references auth.users (id) on delete cascade,
  name        text not null,
  age         int  not null check (age between 2 and 12),
  avatar      text not null default '🦄',
  created_at  timestamptz not null default now()
);

create index if not exists child_profiles_parent_id_idx
  on public.child_profiles (parent_id);

alter table public.child_profiles enable row level security;

drop policy if exists "Parents read own children"   on public.child_profiles;
drop policy if exists "Parents insert own children" on public.child_profiles;
drop policy if exists "Parents update own children" on public.child_profiles;
drop policy if exists "Parents delete own children" on public.child_profiles;

create policy "Parents read own children"
  on public.child_profiles for select using (auth.uid() = parent_id);
create policy "Parents insert own children"
  on public.child_profiles for insert with check (auth.uid() = parent_id);
create policy "Parents update own children"
  on public.child_profiles for update
  using (auth.uid() = parent_id) with check (auth.uid() = parent_id);
create policy "Parents delete own children"
  on public.child_profiles for delete using (auth.uid() = parent_id);

-- ---------------------------------------------------------------------------
-- Running totals: one row per child
-- ---------------------------------------------------------------------------
create table if not exists public.learning_progress (
  child_id          uuid primary key references public.child_profiles (id) on delete cascade,
  points            int  not null default 0,
  streak            int  not null default 1,
  lessons_completed int  not null default 0,
  learning_seconds  int  not null default 0,
  badges            text[] not null default '{}',
  last_active_date  date not null default current_date,
  updated_at        timestamptz not null default now()
);

alter table public.learning_progress enable row level security;

drop policy if exists "Parents read own progress"   on public.learning_progress;
drop policy if exists "Parents write own progress"  on public.learning_progress;
drop policy if exists "Parents update own progress" on public.learning_progress;

create policy "Parents read own progress"
  on public.learning_progress for select
  using (exists (select 1 from public.child_profiles c
                 where c.id = child_id and c.parent_id = auth.uid()));
create policy "Parents write own progress"
  on public.learning_progress for insert
  with check (exists (select 1 from public.child_profiles c
                      where c.id = child_id and c.parent_id = auth.uid()));
create policy "Parents update own progress"
  on public.learning_progress for update
  using (exists (select 1 from public.child_profiles c
                 where c.id = child_id and c.parent_id = auth.uid()));

-- ---------------------------------------------------------------------------
-- Every finished quiz or game
-- ---------------------------------------------------------------------------
create table if not exists public.quiz_results (
  id         uuid primary key default gen_random_uuid(),
  child_id   uuid not null references public.child_profiles (id) on delete cascade,
  kind       text not null default 'quiz',   -- 'quiz' | 'game'
  category   text not null,                  -- alphabet, numbers, findLetter, ...
  score      int  not null,
  total      int  not null,
  created_at timestamptz not null default now()
);

create index if not exists quiz_results_child_idx
  on public.quiz_results (child_id, created_at desc);

alter table public.quiz_results enable row level security;

drop policy if exists "Parents read own results"  on public.quiz_results;
drop policy if exists "Parents write own results" on public.quiz_results;

create policy "Parents read own results"
  on public.quiz_results for select
  using (exists (select 1 from public.child_profiles c
                 where c.id = child_id and c.parent_id = auth.uid()));
create policy "Parents write own results"
  on public.quiz_results for insert
  with check (exists (select 1 from public.child_profiles c
                      where c.id = child_id and c.parent_id = auth.uid()));

-- ---------------------------------------------------------------------------
-- Human-readable feed for the parent dashboard
-- ---------------------------------------------------------------------------
create table if not exists public.activity_log (
  id         uuid primary key default gen_random_uuid(),
  child_id   uuid not null references public.child_profiles (id) on delete cascade,
  icon       text not null default '⭐',
  text       text not null,
  created_at timestamptz not null default now()
);

create index if not exists activity_log_child_idx
  on public.activity_log (child_id, created_at desc);

alter table public.activity_log enable row level security;

drop policy if exists "Parents read own activity"  on public.activity_log;
drop policy if exists "Parents write own activity" on public.activity_log;

create policy "Parents read own activity"
  on public.activity_log for select
  using (exists (select 1 from public.child_profiles c
                 where c.id = child_id and c.parent_id = auth.uid()));
create policy "Parents write own activity"
  on public.activity_log for insert
  with check (exists (select 1 from public.child_profiles c
                      where c.id = child_id and c.parent_id = auth.uid()));
