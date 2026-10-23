import React, { useState, useEffect } from 'react';
import { QUIZ_50_QUESTIONS, QuizQuestion } from '../utils/quizData';
import {
  evaluateQuiz,
  getLeaderboard,
  LeaderboardEntry,
  QuizResultSummary,
} from '../utils/quizLogic';
import {
  fetchLeaderboard,
  saveLeaderboardEntry,
  type LeaderboardSource,
} from '../utils/leaderboardService';
import { isSupabaseConfigured } from '../utils/supabaseClient';
import { sounds } from '../utils/soundEffects';
import {
  Trophy,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Send,
  Star,
  Award,
  Filter,
  Check,
  ChevronRight,
} from 'lucide-react';

interface QuizViewProps {
  onBackToHome: () => void;
  onConfetti: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ onBackToHome, onConfetti }) => {
  const [activeTab, setActiveTab] = useState<'quiz' | 'leaderboard'>('quiz');
  const [levelFilter, setLevelFilter] = useState<number | 'all'>('all');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showInstantExplanation, setShowInstantExplanation] = useState<boolean>(true);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [quizResult, setQuizResult] = useState<QuizResultSummary | null>(null);

  // Leaderboard form
  const [playerName, setPlayerName] = useState<string>('');
  const [selectedAvatar, setSelectedAvatar] = useState<string>('🦊');
  const [hasSubmittedToLeaderboard, setHasSubmittedToLeaderboard] = useState<boolean>(false);
  const [leaderboardList, setLeaderboardList] = useState<LeaderboardEntry[]>([]);
  const [leaderboardSource, setLeaderboardSource] = useState<LeaderboardSource>('local');
  const [isLeaderboardLoading, setIsLeaderboardLoading] = useState<boolean>(false);
  const [leaderboardError, setLeaderboardError] = useState<string | null>(null);
  const [isSavingScore, setIsSavingScore] = useState<boolean>(false);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const pendingEntryRef = React.useRef<LeaderboardEntry | null>(null);

  const AVATARS = ['🦊', '🐰', '🦁', '🐼', '🐯', '🦉', '🐬', '⭐', '🥞', '🍕'];

  // Filtered questions based on level filter
  const filteredQuestions = React.useMemo(() => {
    if (levelFilter === 'all') return QUIZ_50_QUESTIONS;
    return QUIZ_50_QUESTIONS.filter((q) => q.level === levelFilter);
  }, [levelFilter]);

  const loadLeaderboard = React.useCallback(async () => {
    setIsLeaderboardLoading(true);
    setLeaderboardError(null);

    try {
      const { entries, source } = await fetchLeaderboard();
      setLeaderboardList(entries);
      setLeaderboardSource(source);
    } catch (error) {
      setLeaderboardList(getLeaderboard());
      setLeaderboardSource('local');
      setLeaderboardError(
        error instanceof Error
          ? `Papan juara online belum bisa dimuat (${error.message}). Sementara menampilkan skor di perangkat ini.`
          : 'Papan juara online belum bisa dimuat. Sementara menampilkan skor di perangkat ini.'
      );
    } finally {
      setIsLeaderboardLoading(false);
    }
  }, []);

  // Load leaderboard entries
  useEffect(() => {
    void loadLeaderboard();
  }, [loadLeaderboard, activeTab]);

  const activeQuestion: QuizQuestion | undefined = filteredQuestions[currentQuestionIndex];

  const handleSelectAnswer = (optionIdx: number) => {
    if (!activeQuestion) return;
    sounds.playPop();

    const updated = {
      ...userAnswers,
      [activeQuestion.id]: optionIdx,
    };
    setUserAnswers(updated);

    if (showInstantExplanation) {
      if (optionIdx === activeQuestion.correctAnswerIndex) {
        sounds.playChime();
      } else {
        sounds.playEncouragement();
      }
    }
  };

  const handlePrev = () => {
    sounds.playPop();
    setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    sounds.playPop();
    setCurrentQuestionIndex((prev) => Math.min(filteredQuestions.length - 1, prev + 1));
  };

  const handleSubmitQuiz = () => {
    sounds.playPop();
    const result = evaluateQuiz(userAnswers, QUIZ_50_QUESTIONS);
    setQuizResult(result);
    setIsSubmitted(true);
    onConfetti();
    sounds.playFanfare();
  };

  const submitScoreToLeaderboard = async () => {
    if (!playerName.trim() || !quizResult || isSavingScore) return;

    sounds.playPop();
    setIsSavingScore(true);
    setSaveNotice(null);
    setSaveError(null);

    // Pakai ID yang sama saat mencoba ulang supaya tidak dobel di penyimpanan lokal.
    const baseEntry: LeaderboardEntry =
      pendingEntryRef.current ?? {
        id: 'entry-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8),
        name: playerName.trim(),
        score: quizResult.correctCount,
        total: quizResult.totalQuestions,
        percentage: quizResult.percentage,
        avatar: selectedAvatar,
        date: 'Baru saja',
        badgeTitle: quizResult.title,
      };

    const newEntry: LeaderboardEntry = {
      ...baseEntry,
      name: playerName.trim(),
      avatar: selectedAvatar,
    };
    pendingEntryRef.current = newEntry;

    try {
      const result = await saveLeaderboardEntry(newEntry);

      if (result.failed) {
        setSaveError(
          result.warning ??
            'Jaringan sedang bermasalah. Skor belum terkirim ke papan juara online.'
        );
        setLeaderboardList(getLeaderboard());
        setLeaderboardSource('local');
        sounds.playEncouragement();
        return;
      }

      pendingEntryRef.current = null;
      setHasSubmittedToLeaderboard(true);
      setSaveNotice(
        result.source === 'supabase'
          ? 'Namamu sudah tercatat di papan juara online Saung Pintar!'
          : 'Namamu tercatat di papan juara perangkat ini. Hubungkan Supabase agar skor tampil untuk semua siswa.'
      );
      sounds.playFanfare();
      onConfetti();

      if (result.source === 'supabase') {
        await loadLeaderboard();
      } else {
        setLeaderboardList(getLeaderboard());
        setLeaderboardSource('local');
      }
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? `Gagal menyimpan skor: ${error.message}. Periksa jaringan lalu coba lagi.`
          : 'Gagal menyimpan skor. Periksa jaringan lalu coba lagi.'
      );
      sounds.playEncouragement();
    } finally {
      setIsSavingScore(false);
    }
  };

  const handleSaveToLeaderboard = (e: React.FormEvent) => {
    e.preventDefault();
    void submitScoreToLeaderboard();
  };

  const handleRestartQuiz = () => {
    sounds.playPop();
    setUserAnswers({});
    setIsSubmitted(false);
    setQuizResult(null);
    setCurrentQuestionIndex(0);
    setHasSubmittedToLeaderboard(false);
    setSaveNotice(null);
    setSaveError(null);
    pendingEntryRef.current = null;
  };

  const answeredCount = Object.keys(userAnswers).length;

  return (
    <div className="space-y-6">
      {/* Top Navigation & Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-3xl border-3 border-amber-300 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-2xl shadow-sm border-2 border-amber-500">
            🏆
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-amber-950">
              Kuis 50 Soal & Papan Juara
            </h2>
            <p className="text-xs font-bold text-stone-600">
              Uji pemahaman seluruh materi Level 1 sampai Level 5 Saung Pintar
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sounds.playPop();
              setActiveTab('quiz');
            }}
            className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm border-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'quiz'
                ? 'bg-amber-500 text-white border-amber-600 shadow-md scale-102'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-950 border-amber-200'
            }`}
          >
            <span>📝 Mulai Kuis ({answeredCount}/50)</span>
          </button>
          <button
            onClick={() => {
              sounds.playPop();
              setActiveTab('leaderboard');
            }}
            className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm border-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'leaderboard'
                ? 'bg-amber-500 text-white border-amber-600 shadow-md scale-102'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-950 border-amber-200'
            }`}
          >
            <Trophy size={16} />
            <span>Papan Juara</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: QUIZ ACTIVE OR RESULT */}
      {activeTab === 'quiz' && (
        <>
          {!isSubmitted ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Question Navigator (Sidebar on Desktop) */}
              <div className="lg:col-span-4 bg-white rounded-3xl p-5 border-3 border-amber-200 shadow-md space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-black text-stone-800 text-sm flex items-center gap-1.5">
                    <Filter size={16} className="text-amber-600" />
                    <span>Daftar 50 Soal</span>
                  </span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    {answeredCount} Terjawab
                  </span>
                </div>

                {/* Level Quick Filter Tabs */}
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => {
                      sounds.playPop();
                      setLevelFilter('all');
                      setCurrentQuestionIndex(0);
                    }}
                    className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      levelFilter === 'all'
                        ? 'bg-amber-500 text-white'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    Semua (50)
                  </button>
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => {
                        sounds.playPop();
                        setLevelFilter(lvl);
                        setCurrentQuestionIndex(0);
                      }}
                      className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        levelFilter === lvl
                          ? 'bg-amber-500 text-white'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      Lvl {lvl}
                    </button>
                  ))}
                </div>

                {/* Numbered Bubbles Grid (1 to 50) */}
                <div className="max-h-64 sm:max-h-80 overflow-y-auto p-1 grid grid-cols-5 sm:grid-cols-5 gap-2 border border-stone-200 rounded-2xl bg-stone-50/50">
                  {filteredQuestions.map((q, idx) => {
                    const isAnswered = userAnswers[q.id] !== undefined;
                    const isCurrent = idx === currentQuestionIndex;
                    return (
                      <button
                        key={q.id}
                        onClick={() => {
                          sounds.playPop();
                          setCurrentQuestionIndex(idx);
                        }}
                        className={`h-9 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center justify-center border-2 ${
                          isCurrent
                            ? 'bg-amber-400 border-amber-600 text-amber-950 scale-105 shadow-sm ring-2 ring-amber-300'
                            : isAnswered
                            ? 'bg-emerald-500 border-emerald-600 text-white'
                            : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100'
                        }`}
                        title={`Soal nomor ${q.id} (${q.topic})`}
                      >
                        <span>{q.id}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Toggle Instant Explanation */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-700 flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showInstantExplanation}
                      onChange={(e) => setShowInstantExplanation(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-600 accent-amber-500 cursor-pointer"
                    />
                    <span>Tampilkan Pembahasan Langsung</span>
                  </label>
                </div>

                {/* Submit Quiz Button */}
                <button
                  onClick={handleSubmitQuiz}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm rounded-2xl shadow-md border-2 border-emerald-700 flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
                >
                  <Send size={18} />
                  <span>Kumpulkan & Lihat Nilai Akhir</span>
                </button>
              </div>

              {/* Active Question Box */}
              {activeQuestion && (
                <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-7 border-4 border-amber-300 shadow-lg space-y-6">
                  {/* Question Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b-2 border-amber-100">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-950 font-black text-xs border border-amber-300">
                        Soal Nomor {activeQuestion.id} dari 50
                      </span>
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs">
                        Level {activeQuestion.level}: {activeQuestion.topic}
                      </span>
                    </div>

                    <span className="text-2xl">{activeQuestion.illustrationEmoji}</span>
                  </div>

                  {/* Question Statement */}
                  <h3 className="text-lg sm:text-xl font-black text-stone-900 leading-relaxed">
                    {activeQuestion.question}
                  </h3>

                  {/* 4 Answer Choices */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeQuestion.options.map((opt, optIdx) => {
                      const isChosen = userAnswers[activeQuestion.id] === optIdx;
                      const isCorrect = optIdx === activeQuestion.correctAnswerIndex;
                      const hasAnsweredThis = userAnswers[activeQuestion.id] !== undefined;

                      let buttonStyle = 'bg-stone-50 hover:bg-amber-50 border-stone-200 text-stone-800';
                      if (hasAnsweredThis) {
                        if (showInstantExplanation) {
                          if (isCorrect) {
                            buttonStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-2 ring-emerald-300';
                          } else if (isChosen) {
                            buttonStyle = 'bg-yellow-100 border-yellow-400 text-yellow-950';
                          }
                        } else if (isChosen) {
                          buttonStyle = 'bg-amber-400 border-amber-600 text-amber-950 shadow-sm';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectAnswer(optIdx)}
                          className={`p-4 rounded-2xl font-bold text-base border-3 text-left transition-all cursor-pointer flex items-center justify-between ${buttonStyle}`}
                          aria-label={`Pilihan ${String.fromCharCode(65 + optIdx)}: ${opt}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-xl bg-white border border-stone-300 flex items-center justify-center font-black text-sm text-stone-800 flex-shrink-0 shadow-xs">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="font-extrabold">{opt}</span>
                          </div>

                          {showInstantExplanation && hasAnsweredThis && isCorrect && (
                            <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Instant Explanation Box */}
                  {showInstantExplanation && userAnswers[activeQuestion.id] !== undefined && (
                    <div
                      className={`p-4 rounded-2xl text-sm font-bold flex items-start gap-3 ${
                        userAnswers[activeQuestion.id] === activeQuestion.correctAnswerIndex
                          ? 'bg-emerald-50 text-emerald-950 border-2 border-emerald-300'
                          : 'bg-amber-50 text-amber-950 border-2 border-amber-300'
                      }`}
                    >
                      <span className="text-xl flex-shrink-0">
                        {userAnswers[activeQuestion.id] === activeQuestion.correctAnswerIndex ? '🎉' : '💡'}
                      </span>
                      <div>
                        <span className="font-black block mb-0.5">
                          {userAnswers[activeQuestion.id] === activeQuestion.correctAnswerIndex
                            ? 'Jawabanmu Tepat Sekali!'
                            : 'Pembahasan Belajar:'}
                        </span>
                        <p className="text-xs sm:text-sm font-semibold">{activeQuestion.explanation}</p>
                      </div>
                    </div>
                  )}

                  {/* Previous / Next Controls */}
                  <div className="pt-4 border-t-2 border-stone-100 flex items-center justify-between">
                    <button
                      onClick={handlePrev}
                      disabled={currentQuestionIndex === 0}
                      className="px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm bg-stone-100 hover:bg-stone-200 text-stone-700 disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft size={16} />
                      <span>Sebelumnya</span>
                    </button>

                    <span className="text-xs font-bold text-stone-500">
                      Soal {currentQuestionIndex + 1} dari {filteredQuestions.length}
                    </span>

                    <button
                      onClick={handleNext}
                      disabled={currentQuestionIndex === filteredQuestions.length - 1}
                      className="px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm bg-amber-400 hover:bg-amber-500 text-amber-950 disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Selanjutnya</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* QUIZ COMPLETED SCREEN & LEADERBOARD ENTRY */
            <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border-4 border-amber-400 shadow-xl space-y-6 text-center">
              {/* Star Rating */}
              <div className="flex justify-center gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={36}
                    className={
                      i < (quizResult?.stars || 1)
                        ? 'fill-amber-400 text-amber-500 animate-bounce'
                        : 'text-stone-300'
                    }
                  />
                ))}
              </div>

              <div>
                <span className="px-4 py-1 rounded-full bg-emerald-100 text-emerald-900 font-black text-xs uppercase tracking-wider inline-block mb-2">
                  Hasil Akhir Kuis 50 Soal
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-amber-950">
                  {quizResult?.title}
                </h3>
                <p className="text-sm font-bold text-stone-600 mt-1">
                  {quizResult?.feedback}
                </p>
              </div>

              {/* Score Metric Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-300">
                  <span className="text-2xl sm:text-3xl font-black text-emerald-700 block">
                    {quizResult?.correctCount}
                  </span>
                  <span className="text-xs font-bold text-emerald-900">Benar</span>
                </div>
                <div className="p-4 bg-yellow-50 rounded-2xl border-2 border-yellow-300">
                  <span className="text-2xl sm:text-3xl font-black text-yellow-700 block">
                    {quizResult?.wrongCount}
                  </span>
                  <span className="text-xs font-bold text-yellow-900">Perlu Diulas</span>
                </div>
                <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-300">
                  <span className="text-2xl sm:text-3xl font-black text-amber-800 block">
                    {quizResult?.percentage}%
                  </span>
                  <span className="text-xs font-bold text-amber-950">Nilai Akhir</span>
                </div>
              </div>

              {/* Form to submit to Leaderboard */}
              {!hasSubmittedToLeaderboard ? (
                <form
                  onSubmit={handleSaveToLeaderboard}
                  className="bg-amber-50/70 p-5 rounded-2xl border-2 border-amber-300 text-left space-y-4"
                >
                  <h4 className="font-black text-amber-950 text-base flex items-center gap-2">
                    <Trophy size={18} className="text-amber-600" />
                    <span>Catat Namamu di Papan Juara Saung Pintar!</span>
                  </h4>

                  {/* Name Input */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Nama Kamu / Nama Panggilan:
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={40}
                      placeholder="Contoh: Budi Santoso (Dukuhwaru)"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-amber-300 bg-white font-bold text-stone-900 focus:outline-hidden focus:border-amber-500"
                    />
                  </div>

                  {/* Avatar Selector */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      Pilih Karakter Favorit:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {AVATARS.map((av) => (
                        <button
                          key={av}
                          type="button"
                          onClick={() => {
                            sounds.playPop();
                            setSelectedAvatar(av);
                          }}
                          className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center border-2 transition-transform cursor-pointer ${
                            selectedAvatar === av
                              ? 'bg-amber-400 border-amber-600 scale-110 shadow-sm'
                              : 'bg-white border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          {av}
                        </button>
                      ))}
                    </div>
                  </div>

                  {saveError && (
                    <div className="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-950 space-y-2.5">
                      <div className="flex items-start gap-2 text-xs font-bold">
                        <span className="text-base flex-shrink-0">⚠️</span>
                        <span>{saveError}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          void submitScoreToLeaderboard();
                        }}
                        disabled={isSavingScore}
                        className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-sm rounded-xl shadow-sm transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:pointer-events-none"
                      >
                        <RotateCcw
                          size={16}
                          className={isSavingScore ? 'animate-spin' : ''}
                        />
                        <span>{isSavingScore ? 'Mengirim ulang...' : 'Coba Kirim Ulang'}</span>
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSavingScore}
                    className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-amber-950 font-black text-base rounded-xl shadow-md border-2 border-amber-600 transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:pointer-events-none"
                  >
                    {isSavingScore ? (
                      <span className="w-5 h-5 border-2 border-amber-900 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Award size={18} />
                    )}
                    <span>{isSavingScore ? 'Menyimpan...' : 'Simpan ke Papan Juara'}</span>
                  </button>
                </form>
              ) : (
                <div
                  className={`p-4 rounded-2xl border-2 font-bold text-sm flex items-center justify-center gap-2 ${
                    leaderboardSource === 'supabase'
                      ? 'bg-emerald-100 border-emerald-400 text-emerald-950'
                      : 'bg-amber-100 border-amber-400 text-amber-950'
                  }`}
                >
                  <CheckCircle2
                    size={20}
                    className={leaderboardSource === 'supabase' ? 'text-emerald-600' : 'text-amber-700'}
                  />
                  <span>
                    {saveNotice ?? 'Namamu sudah berhasil tercatat di Papan Juara Saung Pintar!'}
                  </span>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3 justify-center pt-2">
                <button
                  onClick={() => {
                    sounds.playPop();
                    setActiveTab('leaderboard');
                  }}
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-sm rounded-xl shadow cursor-pointer flex items-center gap-2"
                >
                  <Trophy size={16} />
                  <span>Lihat Papan Juara</span>
                </button>
                <button
                  onClick={handleRestartQuiz}
                  className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-black text-sm rounded-xl shadow cursor-pointer flex items-center gap-2"
                >
                  <RotateCcw size={16} />
                  <span>Ulangi Kuis</span>
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* VIEW 2: LEADERBOARD / PAPAN JUARA */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-6">
          {/* Podium Top 3 */}
          <div className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 rounded-3xl p-6 border-4 border-amber-400 shadow-md text-center">
            <span className="px-3.5 py-1 rounded-full bg-amber-600 text-white font-black text-xs uppercase tracking-wider inline-block mb-2">
              Bintang Saung Pintar Dukuhwaru
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-amber-950">
              Papan Juara Kuis Pecahan 🏆
            </h3>
            <p className="text-xs sm:text-sm text-stone-700 font-bold max-w-xl mx-auto mt-1">
              Selamat kepada para pejuang matematika yang telah menyelesaikan seluruh 50 tantangan pecahan!
            </p>

            {/* Podium Visual */}
            {isLeaderboardLoading ? (
              <div className="mt-6 py-12 flex flex-col items-center justify-center gap-3 text-amber-900">
                <span className="w-8 h-8 border-4 border-amber-700 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-black">Memuat papan juara...</span>
              </div>
            ) : leaderboardList.length === 0 ? (
              <div className="mt-6 bg-white/80 border-2 border-amber-300 rounded-2xl p-6 max-w-md mx-auto">
                <p className="text-3xl mb-2">🏁</p>
                <p className="text-sm font-black text-amber-950">
                  Belum ada peserta di papan juara.
                </p>
                <p className="text-xs font-bold text-stone-600 mt-1">
                  Selesaikan Kuis 50 Soal dan jadilah juara pertama!
                </p>
              </div>
            ) : (
              <div className="flex justify-center items-end gap-2 sm:gap-4 max-w-md mx-auto mt-6">
                {/* Rank 2 (Silver) */}
                {leaderboardList[1] && (
                  <div className="w-1/3 flex flex-col items-center">
                    <span className="text-3xl mb-1">{leaderboardList[1].avatar}</span>
                    <div className="bg-white/90 p-2.5 rounded-2xl border-2 border-stone-300 w-full shadow-sm">
                      <span className="text-xs font-black text-stone-500 block">🥈 Juara 2</span>
                      <strong className="text-xs sm:text-sm font-black text-stone-800 truncate block">
                        {leaderboardList[1].name.split(' ')[0]}
                      </strong>
                      <span className="text-xs font-black text-emerald-700">
                        {leaderboardList[1].score}/{leaderboardList[1].total}
                      </span>
                    </div>
                    <div className="w-full h-16 bg-stone-200 rounded-t-xl mt-1 border-t-2 border-stone-300" />
                  </div>
                )}

                {/* Rank 1 (Gold) */}
                {leaderboardList[0] && (
                  <div className="w-1/3 flex flex-col items-center">
                    <div className="text-4xl mb-1 animate-bounce">👑</div>
                    <span className="text-4xl mb-1">{leaderboardList[0].avatar}</span>
                    <div className="bg-white p-3 rounded-2xl border-3 border-amber-500 w-full shadow-md">
                      <span className="text-xs font-black text-amber-700 block">🥇 Juara 1</span>
                      <strong className="text-sm sm:text-base font-black text-amber-950 truncate block">
                        {leaderboardList[0].name.split(' ')[0]}
                      </strong>
                      <span className="text-sm font-black text-emerald-700">
                        {leaderboardList[0].score}/{leaderboardList[0].total} ({leaderboardList[0].percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-24 bg-amber-400 rounded-t-xl mt-1 border-t-3 border-amber-500" />
                  </div>
                )}

                {/* Rank 3 (Bronze) */}
                {leaderboardList[2] && (
                  <div className="w-1/3 flex flex-col items-center">
                    <span className="text-3xl mb-1">{leaderboardList[2].avatar}</span>
                    <div className="bg-white/90 p-2.5 rounded-2xl border-2 border-amber-300 w-full shadow-sm">
                      <span className="text-xs font-black text-amber-800 block">🥉 Juara 3</span>
                      <strong className="text-xs sm:text-sm font-black text-stone-800 truncate block">
                        {leaderboardList[2].name.split(' ')[0]}
                      </strong>
                      <span className="text-xs font-black text-emerald-700">
                        {leaderboardList[2].score}/{leaderboardList[2].total}
                      </span>
                    </div>
                    <div className="w-full h-12 bg-amber-300 rounded-t-xl mt-1 border-t-2 border-amber-400" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Leaderboard Table List */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border-3 border-amber-200 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
              <div>
                <h4 className="font-black text-stone-900 text-base sm:text-lg">
                  Daftar Peringkat Lengkap ({leaderboardList.length} Peserta)
                </h4>
                <p
                  className={`text-[11px] font-bold mt-1 flex items-center gap-1.5 ${
                    leaderboardSource === 'supabase' ? 'text-emerald-700' : 'text-amber-800'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      leaderboardSource === 'supabase' ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  />
                  {leaderboardSource === 'supabase'
                    ? 'Online via Supabase — skor tampil untuk semua siswa.'
                    : isSupabaseConfigured
                    ? 'Mode lokal sementara — server belum bisa dihubungi.'
                    : 'Mode lokal — belum terhubung ke Supabase.'}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => {
                    sounds.playPop();
                    void loadLeaderboard();
                  }}
                  disabled={isLeaderboardLoading}
                  className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-black text-xs rounded-xl shadow-sm cursor-pointer flex items-center gap-1.5 disabled:opacity-60 disabled:pointer-events-none"
                >
                  <RotateCcw size={14} className={isLeaderboardLoading ? 'animate-spin' : ''} />
                  <span>Muat Ulang</span>
                </button>
                <button
                  onClick={() => {
                    sounds.playPop();
                    setActiveTab('quiz');
                  }}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs sm:text-sm rounded-xl shadow cursor-pointer flex items-center gap-1.5"
                >
                  <span>Ikuti Kuis Sekarang</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {leaderboardError && (
              <div className="mb-4 p-3 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 text-xs font-bold flex items-start gap-2">
                <span className="text-base flex-shrink-0">⚠️</span>
                <span>{leaderboardError}</span>
              </div>
            )}

            {isLeaderboardLoading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3 text-stone-600">
                <span className="w-7 h-7 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-black">Mengambil skor terbaru...</span>
              </div>
            ) : leaderboardList.length === 0 ? (
              <div className="py-10 text-center bg-stone-50 rounded-2xl border-2 border-dashed border-stone-200">
                <p className="text-3xl mb-1">🌟</p>
                <p className="text-sm font-black text-stone-700">Belum ada skor yang tercatat.</p>
                <p className="text-xs font-bold text-stone-500 mt-1">
                  Selesaikan kuis untuk mengisi papan juara.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {leaderboardList.map((entry, index) => {
                  return (
                  <div
                    key={entry.id}
                    className={`p-3.5 rounded-2xl border-2 transition-all flex items-center gap-3 ${
                      index === 0
                        ? 'bg-amber-50 border-amber-300 shadow-xs'
                        : index === 1
                        ? 'bg-stone-50 border-stone-300'
                        : index === 2
                        ? 'bg-orange-50/60 border-orange-200'
                        : 'bg-white border-stone-100 hover:border-amber-200'
                    }`}
                  >
                    {/* Rank Badge */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 ${
                        index === 0
                          ? 'bg-amber-400 text-amber-950 font-black'
                          : index === 1
                          ? 'bg-stone-300 text-stone-800'
                          : index === 2
                          ? 'bg-amber-600 text-white'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {index + 1}
                    </div>

                    {/* Avatar */}
                    <span className="text-2xl sm:text-3xl flex-shrink-0">{entry.avatar}</span>

                    {/* User info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <strong className="text-sm sm:text-base font-black text-stone-900 truncate">
                          {entry.name}
                        </strong>
                        <span className="text-[10px] font-bold text-stone-500">
                          • {entry.date}
                        </span>
                      </div>
                      <span className="text-xs text-amber-900 font-extrabold block truncate">
                        {entry.badgeTitle}
                      </span>
                    </div>

                    {/* Score badge */}
                    <div className="text-right flex-shrink-0">
                      <div className="text-base sm:text-lg font-black text-emerald-700">
                        {entry.score} / {entry.total}
                      </div>
                      <span className="text-xs font-bold text-stone-500">
                        {entry.percentage}% Benar
                      </span>
                    </div>
                  </div>
                );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
