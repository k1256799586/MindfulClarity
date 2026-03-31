create extension if not exists "pgcrypto";

create table if not exists tasks (
  id text primary key,
  title text not null,
  subtitle text,
  status text not null,
  lane text not null,
  scheduled_label text,
  duration_minutes integer not null,
  reminder_enabled boolean not null default true,
  high_focus boolean not null default false,
  progress_ratio double precision,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists focus_sessions (
  id text primary key,
  task_id text references tasks(id) on delete set null,
  task_title_snapshot text not null,
  duration_minutes integer not null,
  remaining_seconds integer not null,
  status text not null,
  started_at timestamptz,
  ends_at timestamptz,
  paused_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists check_ins (
  id text primary key,
  session_id text not null references focus_sessions(id) on delete cascade,
  note text not null,
  created_at timestamptz not null default now()
);

create table if not exists app_limits (
  id text primary key,
  app_name text not null,
  daily_limit_minutes integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists usage_snapshots (
  id text primary key,
  app_name text not null,
  minutes_used integer not null,
  daily_limit_minutes integer not null,
  is_distracting boolean not null default false,
  category_label text not null,
  captured_on date not null default current_date
);

create table if not exists settings (
  id boolean primary key default true,
  deep_work_mode boolean not null default true,
  zen_notifications boolean not null default true,
  visual_clarity text not null default 'System',
  monitoring_enabled boolean not null default true,
  reminders_enabled boolean not null default true,
  updated_at timestamptz not null default now(),
  constraint settings_single_row check (id)
);

create table if not exists streak_state (
  id boolean primary key default true,
  current_days integer not null default 0,
  longest_days integer not null default 0,
  last_check_in_date date,
  updated_at timestamptz not null default now(),
  constraint streak_state_single_row check (id)
);

create table if not exists insight_summary (
  id boolean primary key default true,
  title text not null,
  body text not null,
  updated_at timestamptz not null default now(),
  constraint insight_summary_single_row check (id)
);
