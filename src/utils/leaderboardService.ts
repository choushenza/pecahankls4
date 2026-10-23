/**
 * leaderboardService.ts
 * Baca/tulis papan juara Kuis 50 Soal.
 *
 * - Jika Supabase dikonfigurasi: data disimpan ke tabel `pecahan_leaderboard`
 *   di project Supabase yang sudah ada.
 * - Jika belum dikonfigurasi / sedang offline: otomatis fallback ke
 *   localStorage supaya hasil kuis anak tetap tampil.
 */

import {
  LEADERBOARD_TABLE,
  supabase,
} from './supabaseClient';
import {
  addLeaderboardEntry,
  getLeaderboard,
  type LeaderboardEntry,
} from './quizLogic';

export type LeaderboardSource = 'supabase' | 'local';

export interface FetchLeaderboardResult {
  entries: LeaderboardEntry[];
  source: LeaderboardSource;
}

export interface SaveLeaderboardResult {
  source: LeaderboardSource;
  /** True jika pengiriman ke Supabase gagal dan skor hanya tersimpan lokal. */
  failed?: boolean;
  /** Pesan ramah jika skor gagal dikirim ke server dan disimpan lokal. */
  warning?: string;
}

interface LeaderboardRow {
  id: string;
  name: string;
  score: number;
  total: number;
  percentage: number;
  avatar: string;
  badge_title: string;
  created_at: string;
}

const LEADERBOARD_COLUMNS =
  'id,name,score,total,percentage,avatar,badge_title,created_at';

/**
 * Ubah pesan error teknis Supabase menjadi kalimat yang ramah untuk guru/siswa.
 */
export function getFriendlyLeaderboardError(message: string): string {
  const lower = message.toLowerCase();

  if (
    lower.includes('failed to fetch') ||
    lower.includes('fetch failed') ||
    lower.includes('network') ||
    lower.includes('timeout')
  ) {
    return 'Jaringan tidak tersambung. Periksa koneksi internet lalu coba lagi.';
  }

  if (
    (lower.includes('relation') && lower.includes('does not exist')) ||
    lower.includes('could not find the table') ||
    lower.includes('schema cache') ||
    lower.includes('pgrst205')
  ) {
    return 'Tabel papan juara belum ada di Supabase. Jalankan file supabase/leaderboard.sql terlebih dahulu.';
  }

  if (lower.includes('row-level security') || lower.includes('permission denied')) {
    return 'Akses ke papan juara ditolak. Periksa policy RLS pada tabel pecahan_leaderboard.';
  }

  return message;
}

export function formatLeaderboardDate(isoDate: string): string {
  const timestamp = new Date(isoDate).getTime();
  if (!Number.isFinite(timestamp)) return '';

  const diffMs = Date.now() - timestamp;
  const minutes = Math.floor(diffMs / 60_000);

  if (minutes < 1) return 'Baru saja';
  if (minutes < 60) return `${minutes} menit lalu`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} hari lalu`;

  return new Date(isoDate).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function mapRow(row: LeaderboardRow): LeaderboardEntry {
  return {
    id: row.id,
    name: row.name,
    score: row.score,
    total: row.total,
    percentage: row.percentage,
    avatar: row.avatar,
    date: formatLeaderboardDate(row.created_at),
    badgeTitle: row.badge_title,
  };
}

export async function fetchLeaderboard(limit = 50): Promise<FetchLeaderboardResult> {
  if (!supabase) {
    return { entries: getLeaderboard(), source: 'local' };
  }

  const { data, error } = await supabase
    .from(LEADERBOARD_TABLE)
    .select(LEADERBOARD_COLUMNS)
    .order('score', { ascending: false })
    .order('percentage', { ascending: false })
    .order('created_at', { ascending: true })
    .limit(limit);

  if (error) {
    throw new Error(getFriendlyLeaderboardError(error.message));
  }

  return {
    entries: ((data ?? []) as LeaderboardRow[]).map(mapRow),
    source: 'supabase',
  };
}

export async function saveLeaderboardEntry(
  entry: LeaderboardEntry
): Promise<SaveLeaderboardResult> {
  if (!supabase) {
    addLeaderboardEntry(entry);
    return { source: 'local' };
  }

  const { error } = await supabase.from(LEADERBOARD_TABLE).insert({
    name: entry.name,
    score: entry.score,
    total: entry.total,
    percentage: entry.percentage,
    avatar: entry.avatar,
    badge_title: entry.badgeTitle,
  });

  if (!error) {
    return { source: 'supabase' };
  }

  // Jangan sampai hasil kuis anak hilang hanya karena jaringan/server bermasalah.
  addLeaderboardEntry(entry);
  return {
    source: 'local',
    failed: true,
    warning: `Skor belum terkirim ke papan juara online. ${getFriendlyLeaderboardError(
      error.message
    )} Skor disimpan sementara di perangkat ini.`,
  };
}
