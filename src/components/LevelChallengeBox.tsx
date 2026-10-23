import React, { useState } from 'react';
import { LevelChallengeItem } from '../utils/levelChallengeLogic';
import { sounds } from '../utils/soundEffects';
import {
  CheckCircle2,
  Lock,
  Unlock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Star,
  HelpCircle,
} from 'lucide-react';

interface LevelChallengeBoxProps {
  levelNumber: number;
  levelName: string;
  challenges: LevelChallengeItem[];
  onCompleteLevel: () => void;
  onNextLevel: () => void;
  hasNextLevel: boolean;
}

export const LevelChallengeBox: React.FC<LevelChallengeBoxProps> = ({
  levelNumber,
  levelName,
  challenges,
  onCompleteLevel,
  onNextLevel,
  hasNextLevel,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [correctIds, setCorrectIds] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<{
    questionId: number;
    isCorrect: boolean;
    text: string;
  } | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);

  const activeChallenge = challenges[currentIndex];
  const isMastered = correctIds.length >= 5;

  const handleChooseOption = (optionIndex: number) => {
    sounds.playPop();
    const isCorrect = optionIndex === activeChallenge.correctIndex;

    setSelectedAnswers((prev) => ({
      ...prev,
      [activeChallenge.id]: optionIndex,
    }));

    if (isCorrect) {
      sounds.playChime();
      const updatedCorrect = Array.from(new Set([...correctIds, activeChallenge.id]));
      setCorrectIds(updatedCorrect);

      setFeedback({
        questionId: activeChallenge.id,
        isCorrect: true,
        text: `Hebat sekali! Jawabanmu benar: ${activeChallenge.explanation}`,
      });

      // If all 5 questions are now answered correctly
      if (updatedCorrect.length === 5) {
        sounds.playFanfare();
        onCompleteLevel();
      }
    } else {
      sounds.playEncouragement();
      // Remove from correct if it was previously correct
      setCorrectIds((prev) => prev.filter((id) => id !== activeChallenge.id));
      setFeedback({
        questionId: activeChallenge.id,
        isCorrect: false,
        text: `Yuk coba teliti lagi ya! ${activeChallenge.hint} Klik "Coba Lagi" untuk memilih jawaban yang tepat.`,
      });
    }
  };

  const handleRetryCurrent = () => {
    sounds.playPop();
    setSelectedAnswers((prev) => {
      const copy = { ...prev };
      delete copy[activeChallenge.id];
      return copy;
    });
    setFeedback(null);
    setShowHint(false);
  };

  const handleSelectQuestion = (index: number) => {
    sounds.playPop();
    setCurrentIndex(index);
    setFeedback(null);
    setShowHint(false);
  };

  return (
    <div className="bg-white border-4 border-amber-300 rounded-3xl p-5 sm:p-6 shadow-lg space-y-5">
      {/* Box Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b-2 border-amber-100">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-400 text-amber-950 font-black flex items-center justify-center text-lg border-2 border-amber-500 shadow-xs">
            🎯
          </div>
          <div>
            <h3 className="font-black text-base sm:text-lg text-amber-950">
              5 Misi Tantangan Level {levelNumber}
            </h3>
            <p className="text-xs font-bold text-stone-600">
              Jawab benar 5 dari 5 soal untuk membuka level berikutnya!
            </p>
          </div>
        </div>

        {/* Score Badge */}
        <div className="flex items-center gap-1.5 bg-amber-50 px-3.5 py-1.5 rounded-2xl border-2 border-amber-300">
          <Star size={18} className="fill-amber-400 text-amber-600" />
          <span className="font-black text-sm text-amber-950">
            Skor Tantangan: {correctIds.length} / 5 Benar
          </span>
        </div>
      </div>

      {/* 5-Question Stepper Bubbles */}
      <div className="flex items-center justify-between gap-2 bg-stone-50 p-2.5 rounded-2xl border border-stone-200">
        {challenges.map((c, idx) => {
          const isCorrect = correctIds.includes(c.id);
          const isCurrent = idx === currentIndex;
          return (
            <button
              key={c.id}
              onClick={() => handleSelectQuestion(idx)}
              className={`flex-1 py-2 sm:py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-1 border-2 ${
                isCurrent
                  ? 'bg-amber-400 text-amber-950 border-amber-600 shadow-sm scale-102 ring-2 ring-amber-300'
                  : isCorrect
                  ? 'bg-emerald-500 text-white border-emerald-600'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-amber-50'
              }`}
              title={`Soal ${idx + 1}`}
              aria-label={`Soal nomor ${idx + 1}`}
            >
              <span>Soal {idx + 1}</span>
              {isCorrect && <span className="text-xs">✓</span>}
            </button>
          );
        })}
      </div>

      {/* Active Question Container */}
      <div className="space-y-4">
        {/* Question text */}
        <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200">
          <span className="text-xs font-extrabold text-amber-800 uppercase tracking-wider block mb-1">
            Soal Nomor {currentIndex + 1} dari 5:
          </span>
          <p className="text-base sm:text-lg font-black text-stone-900 leading-snug">
            {activeChallenge.question}
          </p>
        </div>

        {/* 4 Choices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          {activeChallenge.options.map((opt, optIdx) => {
            const isChosen = selectedAnswers[activeChallenge.id] === optIdx;
            const isCorrect = optIdx === activeChallenge.correctIndex;
            const hasAnswered = selectedAnswers[activeChallenge.id] !== undefined;

            let buttonClass = 'bg-stone-50 hover:bg-amber-50 border-stone-200 text-stone-800';
            if (hasAnswered) {
              if (isCorrect) {
                buttonClass = 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-2 ring-emerald-300';
              } else if (isChosen) {
                buttonClass = 'bg-yellow-100 border-yellow-400 text-yellow-950';
              }
            }

            return (
              <button
                key={optIdx}
                onClick={() => handleChooseOption(optIdx)}
                className={`p-3.5 sm:p-4 rounded-2xl font-bold text-sm sm:text-base border-3 text-left transition-all cursor-pointer flex items-center justify-between ${buttonClass}`}
                aria-label={`Pilihan ${String.fromCharCode(65 + optIdx)}: ${opt}`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-white border border-stone-300 flex items-center justify-center font-black text-xs text-stone-700 flex-shrink-0">
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span className="font-extrabold">{opt}</span>
                </div>
                {hasAnswered && isCorrect && (
                  <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback Message */}
        {feedback && feedback.questionId === activeChallenge.id && (
          <div
            className={`p-4 rounded-2xl text-sm font-bold flex flex-col sm:flex-row items-center sm:items-start justify-between gap-3 ${
              feedback.isCorrect
                ? 'bg-emerald-100 text-emerald-950 border-2 border-emerald-400'
                : 'bg-yellow-100 text-yellow-950 border-2 border-yellow-300'
            }`}
          >
            <div className="flex items-start gap-2 text-center sm:text-left">
              <span className="text-xl flex-shrink-0">
                {feedback.isCorrect ? '🎉' : '💡'}
              </span>
              <div>
                <span className="font-black block">
                  {feedback.isCorrect ? 'Benar Sekali!' : 'Belum Tepat, Yuk Coba Lagi!'}
                </span>
                <p className="text-xs sm:text-sm font-medium mt-0.5">{feedback.text}</p>
              </div>
            </div>

            {!feedback.isCorrect && (
              <button
                onClick={handleRetryCurrent}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-amber-950 font-black text-xs rounded-xl shadow cursor-pointer flex items-center gap-1.5 flex-shrink-0"
              >
                <RotateCcw size={14} />
                <span>Coba Lagi Soal Ini</span>
              </button>
            )}
          </div>
        )}

        {/* Hint toggle if needed */}
        {!feedback?.isCorrect && (
          <div className="flex justify-end">
            <button
              onClick={() => {
                sounds.playPop();
                setShowHint(!showHint);
              }}
              className="text-xs font-bold text-amber-800 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <HelpCircle size={14} />
              <span>{showHint ? 'Sembunyikan Petunjuk' : 'Butuh Petunjuk?'}</span>
            </button>
          </div>
        )}

        {showHint && (
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-300 text-xs font-bold text-amber-950">
            💡 <strong>Petunjuk Kancil:</strong> {activeChallenge.hint}
          </div>
        )}

        {/* Question Stepper Navigation Buttons */}
        <div className="pt-2 flex items-center justify-between border-t border-stone-100">
          <button
            onClick={() => handleSelectQuestion(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="px-3.5 py-2 rounded-xl text-xs font-black bg-stone-100 hover:bg-stone-200 text-stone-700 disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Soal Sebelumnya</span>
          </button>

          <span className="text-xs font-extrabold text-stone-500">
            {currentIndex + 1} dari 5
          </span>

          <button
            onClick={() => handleSelectQuestion(Math.min(challenges.length - 1, currentIndex + 1))}
            disabled={currentIndex === challenges.length - 1}
            className="px-3.5 py-2 rounded-xl text-xs font-black bg-stone-100 hover:bg-stone-200 text-stone-700 disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>Soal Berikutnya</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* STRICT 5/5 GATING BANNER & NEXT LEVEL BUTTON */}
      <div className="pt-3 border-t-2 border-stone-100">
        {!isMastered ? (
          <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center flex-shrink-0">
                <Lock size={18} />
              </div>
              <div>
                <strong className="text-xs sm:text-sm font-black text-amber-950 block">
                  Level Berikutnya Masih Terkunci 🔒
                </strong>
                <p className="text-xs font-bold text-stone-600">
                  Kamu harus menjawab benar <strong>SEMUA 5 SOAL</strong> (saat ini:{' '}
                  <span className="text-amber-900 font-black">{correctIds.length}/5 benar</span>).
                </p>
              </div>
            </div>

            <button
              disabled
              className="px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm bg-stone-200 text-stone-400 cursor-not-allowed flex items-center gap-1.5 flex-shrink-0 opacity-70"
            >
              <span>Belum Bisa Lanjut</span>
              <Lock size={14} />
            </button>
          </div>
        ) : (
          /* UNLOCKED 5/5 BANNER */
          <div className="p-4 bg-emerald-100 rounded-2xl border-2 border-emerald-400 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm animate-bounce">
                <Unlock size={20} />
              </div>
              <div>
                <strong className="text-sm sm:text-base font-black text-emerald-950 block">
                  🎉 LUAR BIASA! 5 dari 5 Soal Terjawab Benar!
                </strong>
                <p className="text-xs font-bold text-emerald-800">
                  Kamu telah menguasai seluruh tantangan {levelName}. Lencana resmi didapatkan!
                </p>
              </div>
            </div>

            {hasNextLevel ? (
              <button
                onClick={onNextLevel}
                className="px-6 py-3 rounded-xl font-black text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-md flex items-center gap-2 transition-transform active:scale-95 cursor-pointer flex-shrink-0"
              >
                <span>Buka & Lanjut ke Level {levelNumber + 1}</span>
                <ArrowRight size={18} />
              </button>
            ) : (
              <div className="text-xs font-black text-emerald-900 bg-white px-3 py-1.5 rounded-xl border border-emerald-300">
                ⭐ Semua 5 Level Berhasil Dikuasai!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
