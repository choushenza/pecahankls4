/**
 * levelChallengeLogic.ts
 * Logic and definitions for the 5 interactive challenges per level
 * with strict 5/5 mastery gating before unlocking the next level.
 */

export interface LevelChallengeItem {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint: string;
  interactiveData?: Record<string, unknown>;
}

export const LEVEL_1_CHALLENGES: LevelChallengeItem[] = [
  {
    id: 1,
    question: 'Jika 1 loyang martabak manis dipotong menjadi 2 bagian sama besar, 1 potong bernilai...',
    options: ['1/2', '1/4', '2/1', '1/1'],
    correctIndex: 0,
    explanation: '1 potong dari 2 bagian yang sama bernilai 1/2.',
    hint: 'Lihat loyang martabak saat dipotong tepat di tengah menjadi 2 bagian.',
  },
  {
    id: 2,
    question: 'Di antara potongan martabak berikut, manakah potongan yang ukurannya PALING BESAR?',
    options: ['1/10 Loyang', '1/8 Loyang', '1/4 Loyang', '1/2 Loyang'],
    correctIndex: 3,
    explanation: 'Makin sedikit bagian dibagi, ukuran 1 potongnya makin besar. 1/2 adalah potongan terbesar!',
    hint: 'Membagi martabak hanya untuk 2 orang menghasilkan potongan yang paling tebal dan lebar.',
  },
  {
    id: 3,
    question: 'Manakah potongan martabak yang ukurannya PALING KECIL?',
    options: ['1/2 Loyang', '1/4 Loyang', '1/8 Loyang', '1/10 Loyang'],
    correctIndex: 3,
    explanation: 'Makin banyak dipotong (penyebut 10), ukuran sepotongnya menjadi paling tipis dan kecil.',
    hint: 'Bayangkan 1 martabak dibagi untuk 10 anak, masing-masing dapat bagian yang kecil.',
  },
  {
    id: 4,
    question: 'Pada pecahan 1/8, angka 8 di bawah menunjukkan apa?',
    options: [
      'Jumlah semua potongan martabak dalam 1 loyang',
      'Jumlah martabak yang sudah dimakan',
      'Jumlah piring yang tersedia',
      'Harga martabak manis',
    ],
    correctIndex: 0,
    explanation: 'Angka bawah (penyebut) menunjukkan jumlah total potongan martabak dalam 1 loyang.',
    hint: 'Penyebut adalah jumlah seluruh bagian yang ada.',
  },
  {
    id: 5,
    question: 'Tanda perbandingan yang tepat untuk 1/4 ... 1/8 adalah...',
    options: ['< (Lebih Kecil)', '> (Lebih Besar)', '= (Sama Dengan)', '+ (Ditambah)'],
    correctIndex: 1,
    explanation: '1 potong dari 4 bagian lebih besar daripada 1 potong dari 8 bagian (1/4 > 1/8).',
    hint: 'Ingat martabak: 1/4 potongannya lebih lebar daripada 1/8!',
  },
];

export const LEVEL_2_CHALLENGES: LevelChallengeItem[] = [
  {
    id: 1,
    question: 'Dua loyang pizza dipotong 6 sama besar. Piring A berisi 2/6 pizza, Piring B berisi 5/6 pizza. Piring mana yang lebih banyak pizzanya?',
    options: ['Piring A (2 potong)', 'Piring B (5 potong)', 'Keduanya sama', 'Tidak ada yang benar'],
    correctIndex: 1,
    explanation: 'Karena ukuran tiap potongnya sama, 5 potong di Piring B lebih banyak daripada 2 potong di Piring A.',
    hint: 'Hitung jumlah potongannya: 5 potong tentu lebih banyak dari 2 potong.',
  },
  {
    id: 2,
    question: 'Tanda perbandingan yang benar untuk 3/8 ... 7/8 adalah...',
    options: ['>', '<', '=', '≠'],
    correctIndex: 1,
    explanation: 'Penyebut sama-sama 8. Karena pembilang 3 lebih kecil dari 7, maka 3/8 < 7/8.',
    hint: 'Bila angka bawah sama, cukup bandingkan angka atas: 3 lebih kecil dari 7.',
  },
  {
    id: 3,
    question: 'Di antara pecahan pizza 2/7, 5/7, 1/7, dan 6/7, manakah yang PALING BANYAK?',
    options: ['1/7', '2/7', '5/7', '6/7'],
    correctIndex: 3,
    explanation: 'Bila penyebut sama-sama 7, pecahan dengan pembilang terbesar (6/7) adalah yang paling banyak.',
    hint: 'Cari angka atas yang paling besar!',
  },
  {
    id: 4,
    question: 'Ahmad makan 4/10 pizza, sedangkan Boni makan 6/10 pizza. Siapa yang makan pizza lebih banyak?',
    options: ['Ahmad', 'Boni', 'Sama banyak', 'Tidak tahu'],
    correctIndex: 1,
    explanation: 'Boni makan 6 potong dari 10, sedangkan Ahmad hanya makan 4 potong dari 10. Jadi Boni lebih banyak.',
    hint: 'Bandingkan 6/10 dengan 4/10.',
  },
  {
    id: 5,
    question: 'Jika kamu memakan 2/5 pizza lalu menambah 2/5 pizza lagi, berapa bagian pizza yang sudah kamu makan?',
    options: ['4/10', '4/5', '5/5', '2/5'],
    correctIndex: 1,
    explanation: '2/5 + 2/5 = 4/5 bagian pizza.',
    hint: 'Jumlahkan angka atasnya: 2 + 2 = 4, penyebutnya tetap 5.',
  },
];

export const LEVEL_3_CHALLENGES: LevelChallengeItem[] = [
  {
    id: 1,
    question: 'Pecahan berikut yang SENILAI dengan 1/2 batang cokelat adalah...',
    options: ['2/4', '1/3', '2/5', '1/4'],
    correctIndex: 0,
    explanation: '1/2 senilai dengan 2/4 karena (1x2)/(2x2) = 2/4.',
    hint: 'Bayangkan setengah cokelat dipotong lagi jadi 2 bagian kecil: ada 2 potong dari 4 bagian!',
  },
  {
    id: 2,
    question: 'Batang cokelat dibagi 8 bagian. Berapa potong yang harus diambil agar panjangnya sama dengan 1/2 cokelat?',
    options: ['2 potong (2/8)', '4 potong (4/8)', '6 potong (6/8)', '8 potong (8/8)'],
    correctIndex: 1,
    explanation: 'Setengah dari 8 potong adalah 4 potong, jadi 1/2 = 4/8.',
    hint: 'Bagi 8 potong menjadi dua kelompok sama rata: masing-masing 4 potong.',
  },
  {
    id: 3,
    question: 'Pecahan manakah yang SENILAI dengan 1/3?',
    options: ['2/6', '2/5', '3/6', '1/6'],
    correctIndex: 0,
    explanation: 'Kalikan pembilang dan penyebut dengan 2: (1x2)/(3x2) = 2/6.',
    hint: 'Jika atas dikali 2, bawah juga dikali 2: 1x2=2, 3x2=6.',
  },
  {
    id: 4,
    question: 'Pecahan manakah yang SENILAI dengan 3/4?',
    options: ['6/8', '3/8', '4/8', '6/4'],
    correctIndex: 0,
    explanation: 'Kalikan atas dan bawah dengan 2: (3x2)/(4x2) = 6/8.',
    hint: '3x2 = 6, 4x2 = 8.',
  },
  {
    id: 5,
    question: 'Mengapa 1/2 senilai dengan 2/4 dan 4/8?',
    options: [
      'Karena panjang dan ukuran cokelat yang dinikmati persis sama',
      'Karena semua angka pecahannya sama persis',
      'Karena penyebutnya selalu ganjil',
      'Karena cokelatnya berubah rasa',
    ],
    correctIndex: 0,
    explanation: 'Pecahan senilai berarti nilainya sama besar meskipun angka pembilang dan penyebutnya berbeda.',
    hint: 'Lihat garis panduan pada cokelat: panjangnya sama persis!',
  },
];

export const LEVEL_4_CHALLENGES: LevelChallengeItem[] = [
  {
    id: 1,
    question: 'Pecahan persepuluhan 1/10 jika diubah ke bentuk desimal adalah...',
    options: ['0,1', '0,01', '1,0', '0,10'],
    correctIndex: 0,
    explanation: 'Penyebut 10 memiliki 1 angka di belakang koma, jadi 1/10 = 0,1.',
    hint: 'Satu angka di belakang koma untuk persepuluhan.',
  },
  {
    id: 2,
    question: 'Pecahan 4/10 jika diubah ke bentuk desimal adalah...',
    options: ['0,4', '0,04', '4,0', '0,14'],
    correctIndex: 0,
    explanation: '4/10 = 0,4 (nol koma empat).',
    hint: 'Tulis nol, tanda koma, lalu angka pembilangnya (4).',
  },
  {
    id: 3,
    question: 'Pecahan perseratusan 25/100 jika diubah ke desimal adalah...',
    options: ['0,25', '0,025', '2,5', '25,0'],
    correctIndex: 0,
    explanation: 'Penyebut 100 memiliki 2 angka di belakang koma, jadi 25/100 = 0,25.',
    hint: 'Ada dua angka di belakang koma: 0,25.',
  },
  {
    id: 4,
    question: 'Boni mewarnai 7 dari 10 kotak persepuluhan. Nilai desimalnya adalah...',
    options: ['0,7', '0,07', '7,0', '0,17'],
    correctIndex: 0,
    explanation: '7 kotak dari 10 kotak = 7/10 = 0,7.',
    hint: 'Tujuh persepuluhan sama dengan 0,7.',
  },
  {
    id: 5,
    question: 'Bilangan desimal 0,5 jika diubah ke pecahan biasa adalah...',
    options: ['5/10', '5/100', '1/5', '5/1'],
    correctIndex: 0,
    explanation: 'Karena ada 1 angka di belakang koma (5), bentuk pecahannya adalah 5/10 (senilai dengan 1/2).',
    hint: 'Satu angka setelah koma artinya per sepuluh ( /10 ).',
  },
];

export const LEVEL_5_CHALLENGES: LevelChallengeItem[] = [
  {
    id: 1,
    question: 'Kata "Persen" artinya adalah...',
    options: ['Per-Seratus', 'Per-Sepuluh', 'Per-Seribu', 'Per-Satu'],
    correctIndex: 0,
    explanation: 'Persen berasal dari kata Latin "per centum" yang berarti per seratus.',
    hint: 'Ingat simbol % yang menyerupai angka 100 yang dimiringkan.',
  },
  {
    id: 2,
    question: 'Pecahan 25/100 sama dengan berapa persen?',
    options: ['25%', '2,5%', '250%', '0,25%'],
    correctIndex: 0,
    explanation: '25 per seratus = 25%.',
    hint: 'Angka pembilangnya langsung ditulis dengan tanda persen.',
  },
  {
    id: 3,
    question: 'Berapa persen nilai dari setengah bagian penuh (1/2 atau 50/100)?',
    options: ['50%', '20%', '10%', '100%'],
    correctIndex: 0,
    explanation: 'Setengah bagian penuh adalah 50 dari 100 bagian, yaitu 50%.',
    hint: 'Setengah dari 100 adalah 50.',
  },
  {
    id: 4,
    question: 'Jika 100 kotak bintang Saung Pintar terisi PENUH (100/100), nilainya adalah...',
    options: ['100%', '50%', '10%', '1%'],
    correctIndex: 0,
    explanation: 'Seluruh 100 kotak terisi penuh sama dengan 1 utuh atau 100%.',
    hint: 'Semua bintang terkumpul penuh tanpa sisa!',
  },
  {
    id: 5,
    question: 'Manakah hubungan nilai pecahan, desimal, dan persen yang BENAR?',
    options: [
      '25/100 = 0,25 = 25%',
      '50/100 = 0,05 = 50%',
      '10/100 = 0,01 = 10%',
      '75/100 = 7,5 = 75%',
    ],
    correctIndex: 0,
    explanation: '25/100 sama dengan desimal 0,25 dan sama dengan 25%. Inilah hubungan trio pecahan!',
    hint: 'Cari yang desimal dan persennya cocok tepat (0,25 dan 25%).',
  },
];

export const ALL_LEVEL_CHALLENGES: Record<number, LevelChallengeItem[]> = {
  1: LEVEL_1_CHALLENGES,
  2: LEVEL_2_CHALLENGES,
  3: LEVEL_3_CHALLENGES,
  4: LEVEL_4_CHALLENGES,
  5: LEVEL_5_CHALLENGES,
};

/**
 * Check if a level is unlocked.
 * Strict Gating:
 * - Level 1 is always unlocked.
 * - Level N (for N > 1) is unlocked ONLY if Level N-1 has all 5 questions answered correctly (5/5).
 */
export function isLevelUnlocked(
  level: number,
  completedLevels: number[]
): boolean {
  if (level <= 1) return true;
  // Level N requires Level N-1 to be completed (with 5/5 score)
  return completedLevels.includes(level - 1);
}

/**
 * Check if a student can proceed to next level.
 * Requires exactly 5 out of 5 correct answers in current level.
 */
export function canProceedToNextLevel(correctAnswersCount: number): boolean {
  return correctAnswersCount >= 5;
}
