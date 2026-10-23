/**
 * quizLogic.ts
 * Logic for grading quiz submissions and managing leaderboard persistence
 */

import { QuizQuestion } from './quizData';

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  total: number;
  percentage: number;
  avatar: string;
  date: string;
  badgeTitle: string;
}

export interface QuizResultSummary {
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
  totalQuestions: number;
  percentage: number;
  stars: number;
  title: string;
  feedback: string;
}

export const DEFAULT_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: 'lb-1',
    name: 'Fajar Maulana (Dukuhwaru)',
    score: 50,
    total: 50,
    percentage: 100,
    avatar: '🦊',
    date: 'Hari ini',
    badgeTitle: 'Juara Akbar Pecahan',
  },
  {
    id: 'lb-2',
    name: 'Nabila Zahra (Saung Pintar)',
    score: 48,
    total: 50,
    percentage: 96,
    avatar: '🐰',
    date: 'Kemarin',
    badgeTitle: 'Bintang Pecahan Cerdas',
  },
  {
    id: 'lb-3',
    name: 'Rizky Pratama (Kelas 4B)',
    score: 45,
    total: 50,
    percentage: 90,
    avatar: '🦁',
    date: '2 hari lalu',
    badgeTitle: 'Master Desimal & Persen',
  },
  {
    id: 'lb-4',
    name: 'Dewi Anggraini (Dukuhwaru)',
    score: 42,
    total: 50,
    percentage: 84,
    avatar: '🐼',
    date: '3 hari lalu',
    badgeTitle: 'Koki Martabak Handal',
  },
  {
    id: 'lb-5',
    name: 'Bima Aditya (Kelas 4A)',
    score: 40,
    total: 50,
    percentage: 80,
    avatar: '🐯',
    date: '3 hari lalu',
    badgeTitle: 'Pahlawan Pecahan Ceria',
  },
];

/**
 * Calculate quiz grade and positive feedback
 */
export function evaluateQuiz(
  userAnswers: Record<number, number>, // questionId -> chosen answer index
  questions: QuizQuestion[]
): QuizResultSummary {
  let correctCount = 0;
  let wrongCount = 0;
  let unansweredCount = 0;

  questions.forEach((q) => {
    const chosen = userAnswers[q.id];
    if (chosen === undefined) {
      unansweredCount++;
    } else if (chosen === q.correctAnswerIndex) {
      correctCount++;
    } else {
      wrongCount++;
    }
  });

  const totalQuestions = questions.length;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  let stars = 1;
  let title = 'Pejuang Pecahan Ceria';
  let feedback = 'Langkah awal yang luar biasa! Teruslah berlatih, kamu pasti makin mahir!';

  if (percentage >= 90) {
    stars = 5;
    title = 'Juara Akbar Pecahan Saung Pintar';
    feedback = 'Luar biasa spektakuler! Kamu menguasai semua materi dari martabak sampai persen!';
  } else if (percentage >= 75) {
    stars = 4;
    title = 'Bintang Pecahan Cerdas';
    feedback = 'Hebat sekali! Pemahaman pecahanmu sudah sangat mantap dan teliti!';
  } else if (percentage >= 60) {
    stars = 3;
    title = 'Penjelajah Pecahan Hebat';
    feedback = 'Bagus sekali! Kamu sudah memahami sebagian besar konsep pecahan!';
  } else if (percentage >= 40) {
    stars = 2;
    title = 'Sahabat Pecahan Rajin';
    feedback = 'Usaha yang sangat bagus! Sedikit latihan lagi kamu akan jadi juara!';
  }

  return {
    correctCount,
    wrongCount,
    unansweredCount,
    totalQuestions,
    percentage,
    stars,
    title,
    feedback,
  };
}

/**
 * Load leaderboard from localStorage or fallback
 */
export function getLeaderboard(): LeaderboardEntry[] {
  if (typeof window === 'undefined') return DEFAULT_LEADERBOARD;
  try {
    const saved = localStorage.getItem('saung_pintar_leaderboard');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.sort((a, b) => b.score - a.score);
      }
    }
  } catch {
    // Ignore error
  }
  return DEFAULT_LEADERBOARD;
}

/**
 * Save new leaderboard entry
 */
export function addLeaderboardEntry(entry: LeaderboardEntry): LeaderboardEntry[] {
  const current = getLeaderboard();
  const updated = [entry, ...current.filter((item) => item.id !== entry.id)]
    .sort((a, b) => b.score - a.score)
    .slice(0, 50); // Keep top 50

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('saung_pintar_leaderboard', JSON.stringify(updated));
    } catch {
      // Ignore error
    }
  }
  return updated;
}
