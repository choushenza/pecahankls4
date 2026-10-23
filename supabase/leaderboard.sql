-- ============================================================
-- Papan Juara Kuis 50 Soal — Petualangan Pecahan Saung Pintar
-- ============================================================
-- Jalankan file ini di project Supabase yang SUDAH ADA.
-- Tidak perlu membuat project baru.
--
-- Tabel diberi awalan "pecahan_" agar tidak bentrok dengan
-- tabel website lain di project yang sama.
--
-- Cara pakai:
--   1. Buka Supabase Dashboard > project lama Anda.
--   2. Pilih menu "SQL Editor" > "New query".
--   3. Tempel seluruh isi file ini, lalu klik "Run".
-- ============================================================

create table if not exists public.pecahan_leaderboard (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  score integer not null,
  total integer not null default 50,
  percentage integer not null,
  avatar text not null default '🦊',
  badge_title text not null default '',
  created_at timestamptz not null default now(),

  constraint pecahan_leaderboard_name_length
    check (char_length(btrim(name)) between 1 and 40),
  constraint pecahan_leaderboard_total_range
    check (total between 1 and 100),
  constraint pecahan_leaderboard_score_range
    check (score between 0 and total),
  constraint pecahan_leaderboard_percentage_range
    check (percentage between 0 and 100),
  constraint pecahan_leaderboard_avatar_length
    check (char_length(avatar) between 1 and 8),
  constraint pecahan_leaderboard_badge_length
    check (char_length(badge_title) <= 80)
);

-- Urutan peringkat: skor tertinggi, lalu persentase, lalu yang paling dulu menyelesaikan.
create index if not exists pecahan_leaderboard_rank_idx
  on public.pecahan_leaderboard (score desc, percentage desc, created_at asc);

-- ============================================================
-- Keamanan (Row Level Security)
-- ============================================================
-- anon/public key boleh:
--   - membaca semua skor
--   - menambah satu skor baru
-- anon TIDAK boleh mengubah atau menghapus skor.
-- ============================================================

alter table public.pecahan_leaderboard enable row level security;

drop policy if exists "pecahan_leaderboard_read" on public.pecahan_leaderboard;
create policy "pecahan_leaderboard_read"
  on public.pecahan_leaderboard
  for select
  to anon, authenticated
  using (true);

drop policy if exists "pecahan_leaderboard_insert" on public.pecahan_leaderboard;
create policy "pecahan_leaderboard_insert"
  on public.pecahan_leaderboard
  for insert
  to anon, authenticated
  with check (
    char_length(btrim(name)) between 1 and 40
    and total between 1 and 100
    and score between 0 and total
    and percentage between 0 and 100
    and char_length(avatar) between 1 and 8
    and char_length(badge_title) <= 80
  );

revoke all on public.pecahan_leaderboard from anon, authenticated;
grant select, insert on public.pecahan_leaderboard to anon, authenticated;

-- ============================================================
-- Opsional: cek hasil
-- ============================================================
-- select * from public.pecahan_leaderboard order by score desc limit 10;
