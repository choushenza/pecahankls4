/**
 * fractionLogic.ts
 * Pure business logic for Pecahan Pembelajaran Kelas 4 SD
 * Saung Pintar Dukuhwaru
 */

export interface Fraction {
  numerator: number;
  denominator: number;
}

export type ComparisonResult = 'greater' | 'less' | 'equal';

/**
 * Compare two fractions
 */
export function compareFractions(
  n1: number,
  d1: number,
  n2: number,
  d2: number
): ComparisonResult {
  if (d1 === 0 || d2 === 0) {
    throw new Error('Penyebut tidak boleh bernilai nol!');
  }
  const cross1 = n1 * d2;
  const cross2 = n2 * d1;
  if (cross1 > cross2) return 'greater';
  if (cross1 < cross2) return 'less';
  return 'equal';
}

/**
 * Check if two fractions are equivalent (pecahan senilai)
 */
export function isEquivalentFraction(
  n1: number,
  d1: number,
  n2: number,
  d2: number
): boolean {
  if (d1 <= 0 || d2 <= 0) return false;
  return n1 * d2 === n2 * d1;
}

/**
 * Convert tenths fraction to decimal formatted string (Indonesian comma style or standard)
 * 1/10 -> "0,1"
 */
export function formatTenthsToDecimal(numerator: number): {
  fractionStr: string;
  decimalStr: string;
  ratio: number;
} {
  const clamped = Math.max(0, Math.min(10, Math.round(numerator)));
  const ratio = clamped / 10;
  return {
    fractionStr: `${clamped}/10`,
    decimalStr: (ratio).toFixed(1).replace('.', ','),
    ratio,
  };
}

/**
 * Convert hundredths fraction to decimal formatted string
 * 25/100 -> "0,25"
 */
export function formatHundredthsToDecimal(numerator: number): {
  fractionStr: string;
  decimalStr: string;
  percentStr: string;
  ratio: number;
} {
  const clamped = Math.max(0, Math.min(100, Math.round(numerator)));
  const ratio = clamped / 100;
  return {
    fractionStr: `${clamped}/100`,
    decimalStr: (ratio).toFixed(2).replace('.', ','),
    percentStr: `${clamped}%`,
    ratio,
  };
}

/**
 * Calculate visual slice size description for unit fractions (Level 1)
 */
export function getUnitFractionConcept(denominator: number): {
  pieceFraction: string;
  sliceDescription: string;
  encouragement: string;
} {
  const descriptions: Record<number, { desc: string; text: string }> = {
    2: {
      desc: '1 potong dari 2 bagian (Besar sekali!)',
      text: 'Karena dibagi cuma untuk 2 orang, setiap potongnya tebal dan besar!',
    },
    4: {
      desc: '1 potong dari 4 bagian (Cukup besar)',
      text: 'Bagus! Dibagi 4 potong, pas untuk dinikmati bersama teman!',
    },
    8: {
      desc: '1 potong dari 8 bagian (Mulai mengecil)',
      text: 'Wah, karena dipotong jadi 8, ukuran tiap potong mulai lebih ramping ya!',
    },
    10: {
      desc: '1 potong dari 10 bagian (Paling kecil)',
      text: 'Penyebutnya 10 (paling besar), tapi potongan yang kamu dapat justru PALING KECIL!',
    },
  };

  const defaultDesc = {
    desc: `1 potong dari ${denominator} bagian`,
    text: `Makin besar angka bawahnya (${denominator}), potongan martabaknya makin kecil!`,
  };

  const info = descriptions[denominator] || defaultDesc;
  return {
    pieceFraction: `1/${denominator}`,
    sliceDescription: info.desc,
    encouragement: info.text,
  };
}

export interface BadgeInfo {
  id: string;
  level: number;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
}

export const BADGE_LIST: BadgeInfo[] = [
  {
    id: 'badge-1',
    level: 1,
    title: 'Koki Martabak Handal',
    subtitle: 'Menguasai Pecahan Pembilang Satu',
    icon: '🥞',
    color: 'from-amber-400 to-orange-500',
  },
  {
    id: 'badge-2',
    level: 2,
    title: 'Pesta Pizza Ceria',
    subtitle: 'Membandingkan Pecahan Penyebut Sama',
    icon: '🍕',
    color: 'from-red-400 to-rose-600',
  },
  {
    id: 'badge-3',
    level: 3,
    title: 'Master Cokelat Adil',
    subtitle: 'Menemukan Pecahan Senilai',
    icon: '🍫',
    color: 'from-amber-700 to-yellow-800',
  },
  {
    id: 'badge-4',
    level: 4,
    title: 'Penjelajah Kotak Desimal',
    subtitle: 'Memahami Persepuluhan & Perseratusan',
    icon: '📊',
    color: 'from-cyan-400 to-blue-600',
  },
  {
    id: 'badge-5',
    level: 5,
    title: 'Bintang Saung Pintar',
    subtitle: 'Menguasai Konsep Persen (%)',
    icon: '⭐',
    color: 'from-yellow-300 to-amber-500',
  },
];
