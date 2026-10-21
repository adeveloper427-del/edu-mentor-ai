-- Edu Mentor AI — admin access
-- Run this in the Supabase dashboard: SQL Editor -> New query -> Run.
-- Safe to re-run; everything is idempotent.
--
-- An admin is a normal Supabase auth user whose id also appears in admin_users.
-- Admin reads are enforced in the database, not in the app, so a tampered
-- client still cannot read other families' data.

-- ---------------------------------------------------------------------------
-- Who is an admin
-- ---------------------------------------------------------------------------
create table if not exists public.admin_users (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- A signed-in user may read only their own row, which is how the app asks
-- "am I an admin?" without being able to enumerate admins.
drop policy if exists "Read own admin row" on public.admin_users;
create policy "Read own admin row"
  on public.admin_users for select using (auth.uid() = user_id);

-- SECURITY DEFINER so the check itself bypasses RLS and cannot recurse.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users a where a.user_id = auth.uid());
$$;

grant execute on function public.is_admin() to authenticated;

-- ---------------------------------------------------------------------------
-- Admins can read everything (these sit alongside the per-parent policies;
-- multiple SELECT policies are OR'd together)
-- ---------------------------------------------------------------------------
drop policy if exists "Admins read all children" on public.child_profiles;
create policy "Admins read all children"
  on public.child_profiles for select using (public.is_admin());

drop policy if exists "Admins read all progress" on public.learning_progress;
create policy "Admins read all progress"
  on public.learning_progress for select using (public.is_admin());

drop policy if exists "Admins read all results" on public.quiz_results;
create policy "Admins read all results"
  on public.quiz_results for select using (public.is_admin());

drop policy if exists "Admins read all activity" on public.activity_log;
create policy "Admins read all activity"
  on public.activity_log for select using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Platform totals for the admin dashboard
-- ---------------------------------------------------------------------------
create or replace function public.admin_stats()
returns json
language sql
stable
security definer
set search_path = public
as $$
  select case when not public.is_admin() then null else json_build_object(
    'learners',        (select count(*) from public.child_profiles),
    'families',        (select count(distinct parent_id) from public.child_profiles),
    'quizzes_taken',   (select count(*) from public.quiz_results where kind = 'quiz'),
    'games_played',    (select count(*) from public.quiz_results where kind = 'game'),
    'lessons_done',    (select coalesce(sum(lessons_completed), 0) from public.learning_progress),
    'points_awarded',  (select coalesce(sum(points), 0) from public.learning_progress),
    'badges_awarded',  (select coalesce(sum(array_length(badges, 1)), 0) from public.learning_progress),
    'learning_minutes',(select coalesce(sum(learning_seconds), 0) / 60 from public.learning_progress),
    'active_today',    (select count(*) from public.learning_progress where last_active_date = current_date)
  ) end;
$$;

grant execute on function public.admin_stats() to authenticated;

-- ---------------------------------------------------------------------------
-- Every learner with their parent's email. Needs SECURITY DEFINER because
-- auth.users is not readable from the client.
-- ---------------------------------------------------------------------------
create or replace function public.admin_list_users()
returns table (
  child_id     uuid,
  child_name   text,
  child_age    int,
  avatar       text,
  parent_email text,
  joined       timestamptz,
  points       int,
  lessons      int,
  last_active  date
)
language sql
stable
security definer
set search_path = public
as $$
  select
    c.id,
    c.name,
    c.age,
    c.avatar,
    u.email::text,
    c.created_at,
    coalesce(p.points, 0),
    coalesce(p.lessons_completed, 0),
    p.last_active_date
  from public.child_profiles c
  join auth.users u on u.id = c.parent_id
  left join public.learning_progress p on p.child_id = c.id
  where public.is_admin()
  order by c.created_at desc;
$$;

grant execute on function public.admin_list_users() to authenticated;

-- ---------------------------------------------------------------------------
-- Average score per category across the whole platform
-- ---------------------------------------------------------------------------
create or replace function public.admin_category_stats()
returns table (
  category  text,
  kind      text,
  attempts  bigint,
  avg_score numeric
)
language sql
stable
security definer
set search_path = public
as $$
  select
    r.category,
    r.kind,
    count(*) as attempts,
    round(avg(r.score::numeric / nullif(r.total, 0)) * 100, 0) as avg_score
  from public.quiz_results r
  where public.is_admin()
  group by r.category, r.kind
  order by attempts desc;
$$;

grant execute on function public.admin_category_stats() to authenticated;

-- ---------------------------------------------------------------------------
-- Recent activity across all children, with the child's name
-- ---------------------------------------------------------------------------
create or replace function public.admin_recent_activity(max_rows int default 25)
returns table (
  icon       text,
  message    text,
  child_name text,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select a.icon, a.text, c.name, a.created_at
  from public.activity_log a
  join public.child_profiles c on c.id = a.child_id
  where public.is_admin()
  order by a.created_at desc
  limit greatest(1, least(max_rows, 100));
$$;

grant execute on function public.admin_recent_activity(int) to authenticated;

-- ---------------------------------------------------------------------------
-- MAKE YOURSELF AN ADMIN
-- ---------------------------------------------------------------------------
-- 1. Create a normal account in the app (or Authentication -> Users -> Add user)
-- 2. Put that email below and run this block.
--
-- insert into public.admin_users (user_id, email)
-- select id, email from auth.users where email = 'you@example.com'
-- on conflict (user_id) do nothing;
