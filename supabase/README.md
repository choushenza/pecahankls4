# Papan Juara Online (Supabase)

Fitur ini menyimpan skor **Kuis 50 Soal** ke Supabase, sehingga peringkat bisa
dilihat oleh semua siswa — bukan hanya tersimpan di browser masing-masing.

## Bisa pakai project Supabase yang sudah ada?

**Bisa, tanpa membuat project baru.** Satu project Supabase boleh berisi banyak
tabel. Kita hanya menambahkan satu tabel baru bernama `pecahan_leaderboard`
dengan awalan `pecahan_` agar tidak bentrok dengan tabel website lain.

Yang perlu diperhatikan saat memakai project bersama:

- Kuota gratis Supabase (database, bandwidth, request) dipakai bersama.
- Jangan pernah menaruh **service_role key** di frontend. Cukup **anon/public key**.
- RLS (Row Level Security) wajib aktif supaya anon key tidak bisa membaca/mengubah
  tabel website lain. SQL di bawah hanya membuka tabel `pecahan_leaderboard`.
- Skor kuis dihitung di browser, jadi siswa yang paham teknis bisa mengirim skor
  palsu lewat anon key. Untuk kelas/sekolah biasanya cukup. Kalau butuh anti-curang,
  penilaian harus dipindah ke server/Edge Function.

## Langkah pasang

1. Buka **project Supabase lama** Anda.
2. Masuk ke **SQL Editor → New query**.
3. Tempel isi [`supabase/leaderboard.sql`](./leaderboard.sql), lalu klik **Run**.
4. Buka **Project Settings → API**, salin:
   - **Project URL**
   - **anon public key** (atau **publishable key** `sb_publishable_...`)
5. Buat file `.env.local` di folder utama proyek (sebelah `package.json`):

   ```env
   VITE_SUPABASE_URL=https://PROJECT-ANDA.supabase.co
   VITE_SUPABASE_ANON_KEY=ANON_PUBLIC_KEY_ANDA
   ```

6. Jalankan ulang `npm run dev`.
7. Selesaikan Kuis 50 Soal, isi nama, lalu simpan. Buka di browser lain (mode
   incognito) untuk memastikan skor muncul untuk semua orang.

## Kalau env belum diisi

Aplikasi tetap berjalan. Papan juara otomatis memakai **mode lokal**
(`localStorage`) dan menampilkan tulisan "Mode lokal — belum terhubung ke Supabase".
Jadi tidak ada error saat dipakai tanpa internet.

Papan juara sengaja **mulai kosong**: tidak ada data contoh/dummy. Kalau browser
masih menyimpan entri demo lama (`lb-1` sampai `lb-5`), entri itu otomatis
dibersihkan saat papan juara dibuka.

## Saat deploy

Vite membaca env saat **build**. Tambahkan `VITE_SUPABASE_URL` dan
`VITE_SUPABASE_ANON_KEY` di pengaturan environment hosting (Vercel/Netlify/AI Studio),
lalu build ulang. Setelah itu papan juara akan online untuk semua pengunjung.

## Reset papan juara (mulai kosong lagi)

Jalankan di **SQL Editor**:

```sql
truncate table public.pecahan_leaderboard;
```

Ini menghapus **semua** skor. Cocok dipakai saat tahun ajaran baru atau ingin
memulai papan juara dari kosong.

## Struktur data

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | uuid | Primary key otomatis |
| `name` | text | Nama siswa (1–40 karakter) |
| `score` | integer | Jumlah jawaban benar (0–50) |
| `total` | integer | Jumlah soal (50) |
| `percentage` | integer | Nilai akhir 0–100 |
| `avatar` | text | Emoji karakter pilihan |
| `badge_title` | text | Gelar hasil kuis |
| `created_at` | timestamptz | Waktu submit |

## Catatan tentang file HTML offline 17 KB

File `public/saung_pintar_pecahan_standalone.html` adalah versi vanilla yang
terpisah dan **tidak memiliki kuis 50 soal**. Jadi leaderboard ini hanya muncul
di aplikasi React utama. Kalau nanti versi standalone ingin ikut memakai
leaderboard, kuis 50 soal harus ditambahkan dulu ke file tersebut dan perangkat
harus online.
