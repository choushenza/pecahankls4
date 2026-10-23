/**
 * supabaseClient.ts
 * Koneksi Supabase untuk papan juara online.
 *
 * Project Supabase yang dipakai boleh sama dengan website lain.
 * Cukup isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di .env.local.
 * Selama dua variabel itu kosong, aplikasi otomatis memakai mode lokal
 * (localStorage) sehingga tidak error saat dibuka tanpa internet.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim() ?? '';
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim() ?? '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    })
  : null;

/**
 * Nama tabel sengaja diberi awalan "pecahan_" supaya tidak bentrok
 * dengan tabel website lain di project Supabase yang sama.
 */
export const LEADERBOARD_TABLE = 'pecahan_leaderboard';
