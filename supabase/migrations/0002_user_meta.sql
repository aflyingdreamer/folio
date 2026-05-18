create table public.user_meta (
  user_id uuid primary key references auth.users(id) on delete cascade,
  timezone text not null default 'UTC',
  updated_at timestamptz not null default now()
);
