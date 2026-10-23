import React, { useState } from 'react';
import { sounds } from '../utils/soundEffects';
import { MascotMessage } from './MascotMessage';
import { isEquivalentFraction } from '../utils/fractionLogic';
import { LEVEL_3_CHALLENGES } from '../utils/levelChallengeLogic';
import { LevelChallengeBox } from './LevelChallengeBox';
import { CheckCircle2, Sparkles, ArrowRight, Equal, RotateCcw } from 'lucide-react';

interface Level3Props {
  onCompleteLevel: () => void;
  isCompleted: boolean;
  onNextLevel: () => void;
}

interface ChocolateTarget {
  targetNum: number;
  targetDenom: number;
  allowedDenoms: number[];
  title: string;
}

const TARGETS: ChocolateTarget[] = [
  {
    targetNum: 1,
    targetDenom: 2,
    allowedDenoms: [4, 6, 8],
    title: 'Misi 1: Cari Cokelat Senilai dengan 1/2',
  },
  {
    targetNum: 1,
    targetDenom: 3,
    allowedDenoms: [6, 9],
    title: 'Misi 2: Cari Cokelat Senilai dengan 1/3',
  },
  {
    targetNum: 3,
    targetDenom: 4,
    allowedDenoms: [8],
    title: 'Misi 3: Cari Cokelat Senilai dengan 3/4',
  },
];

export const Level3Chocolate: React.FC<Level3Props> = ({
  onCompleteLevel,
  isCompleted,
  onNextLevel,
}) => {
  const [targetIdx, setTargetIdx] = useState<number>(0);
  const currentTarget = TARGETS[targetIdx];

  // Chocolate Bar 2 state
  const [denomB, setDenomB] = useState<number>(4);
  const [numB, setNumB] = useState<number>(1);
  const [feedback, setFeedback] = useState<{
    correct: boolean;
    text: string;
  } | null>(null);
  const [solvedTargets, setSolvedTargets] = useState<number[]>([]);

  const isMatched = isEquivalentFraction(
    currentTarget.targetNum,
    currentTarget.targetDenom,
    numB,
    denomB
  );

  const handleDenomChange = (newDenom: number) => {
    sounds.playPop();
    setDenomB(newDenom);
    setFeedback(null);
  };

  const handleNumChange = (newNum: number) => {
    sounds.playPop();
    const clamped = Math.max(0, Math.min(denomB, newNum));
    setNumB(clamped);
    setFeedback(null);
  };

  const handleCheckEquivalent = () => {
    if (isMatched) {
      sounds.playChime();
      sounds.playApplause();
      setFeedback({
        correct: true,
        text: `SEMPURNA! Lihat garisnya, ${currentTarget.targetNum}/${currentTarget.targetDenom} dan ${numB}/${denomB} sama persis panjangnya! Kamu baru saja membuktikan PECAHAN SENILAI! 🎉🍫`,
      });

      if (!solvedTargets.includes(targetIdx)) {
        const nextSolved = [...solvedTargets, targetIdx];
        setSolvedTargets(nextSolved);
        if (nextSolved.length >= TARGETS.length && !isCompleted) {
          sounds.playFanfare();
          onCompleteLevel();
        }
      }
    } else {
      sounds.playEncouragement();
      const targetRatio = currentTarget.targetNum / currentTarget.targetDenom;
      const currentRatio = numB / denomB;
      if (currentRatio < targetRatio) {
        setFeedback({
          correct: false,
          text: `Cokelat B masih kurang panjang nih! Coba tambahkan ${denomB ? '1 potong lagi' : ''} dengan mengklik tombol (+) ya!`,
        });
      } else {
        setFeedback({
          correct: false,
          text: `Wah, cokelat B sekarang kepanjangan! Coba kurangi potongan cokelat dengan tombol (-) sampai garisnya lurus sejajar ya!`,
        });
      }
    }
  };

  const handleNextTarget = () => {
    sounds.playPop();
    const nextIdx = (targetIdx + 1) % TARGETS.length;
    setTargetIdx(nextIdx);
    setDenomB(TARGETS[nextIdx].allowedDenoms[0]);
    setNumB(1);
    setFeedback(null);
  };

  return (
    <div className="space-y-6">
      {/* Mascot Guidance */}
      <MascotMessage
        message="Ayo kita tukar potongan cokelat! Batang Cokelat A sudah dipotong. Sekarang giliranmu memotong Batang Cokelat B agar panjang cokelat yang dimakan SAMA PERSIS!"
        type="happy"
        hint="Pecahan senilai adalah pecahan yang angka-angkanya berbeda, tetapi ukurannya SAMA BESAR!"
        levelTitle="Level 3: Pecahan Senilai"
      />

      {/* Mission Tracker */}
      <div className="bg-white rounded-2xl p-3 border-2 border-amber-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-stone-700 text-sm">Misi Cokelat:</span>
          <div className="flex gap-1.5">
            {TARGETS.map((t, idx) => (
              <span
                key={idx}
                className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                  solvedTargets.includes(idx)
                    ? 'bg-emerald-500 text-white'
                    : targetIdx === idx
                    ? 'bg-amber-400 text-amber-950 border-2 border-amber-600'
                    : 'bg-stone-100 text-stone-500'
                }`}
              >
                {solvedTargets.includes(idx) ? '✓' : idx + 1}
              </span>
            ))}
          </div>
        </div>
        <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-lg">
          {currentTarget.title}
        </span>
      </div>

      {/* Visual Chocolate Bars Stage */}
      <div className="bg-white rounded-3xl p-6 border-4 border-amber-300 shadow-lg space-y-6">
        {/* Chocolate Bar A (Target Reference) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-black text-stone-800 text-base flex items-center gap-2">
              🍫 Batang Cokelat A (Patokan)
            </span>
            <span className="bg-amber-100 text-amber-950 font-black text-sm px-3 py-1 rounded-full border border-amber-300">
              Pecahan: {currentTarget.targetNum}/{currentTarget.targetDenom}
            </span>
          </div>

          {/* Chocolate Bar A Container */}
          <div className="w-full h-16 sm:h-20 bg-amber-900/10 rounded-2xl border-4 border-amber-900 p-1.5 flex gap-1 relative overflow-hidden shadow-inner">
            {Array.from({ length: currentTarget.targetDenom }).map((_, i) => {
              const isFilled = i < currentTarget.targetNum;
              return (
                <div
                  key={i}
                  className={`h-full flex-1 rounded-xl transition-all flex items-center justify-center font-black text-sm sm:text-base border-2 ${
                    isFilled
                      ? 'bg-amber-800 border-amber-950 text-amber-100 shadow-md ring-2 ring-amber-600/50'
                      : 'bg-amber-100/60 border-dashed border-amber-300 text-stone-400'
                  }`}
                >
                  {isFilled ? '🍫' : ''}
                </div>
              );
            })}
          </div>
        </div>

        {/* Vertical Alignment Guideline Indicator */}
        <div className="relative py-1 flex items-center justify-center">
          <div className="absolute inset-x-0 h-0.5 border-t-2 border-dashed border-amber-400" />
          <div className="bg-amber-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-sm relative z-10 flex items-center gap-1">
            <Equal size={14} />
            <span>Garis Ukuran Panjang Cokelat</span>
          </div>
        </div>

        {/* Chocolate Bar B (Interactive Editable) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-black text-stone-800 text-base flex items-center gap-2">
              🍫 Batang Cokelat B (Ubah Bagian Ini!)
            </span>
            <span className="bg-emerald-100 text-emerald-950 font-black text-sm px-3 py-1 rounded-full border border-emerald-300">
              Pecahan: {numB}/{denomB}
            </span>
          </div>

          {/* Chocolate Bar B Container */}
          <div className="w-full h-16 sm:h-20 bg-amber-900/10 rounded-2xl border-4 border-amber-900 p-1.5 flex gap-1 relative overflow-hidden shadow-inner">
            {Array.from({ length: denomB }).map((_, i) => {
              const isFilled = i < numB;
              return (
                <button
                  key={i}
                  onClick={() => handleNumChange(i + 1)}
                  className={`h-full flex-1 rounded-xl transition-all flex items-center justify-center font-black text-sm sm:text-base border-2 cursor-pointer ${
                    isFilled
                      ? 'bg-amber-800 border-amber-950 text-amber-100 shadow-md ring-2 ring-amber-600/50 hover:brightness-110'
                      : 'bg-amber-100/60 border-dashed border-amber-300 text-stone-400 hover:bg-amber-200/50'
                  }`}
                  title={`Klik untuk mengisi sampai potongan ke-${i + 1}`}
                  aria-label={`Potongan ${i + 1} dari ${denomB}`}
                >
                  {isFilled ? '🍫' : ''}
                </button>
              );
            })}
          </div>

          {/* Controls for Bar B */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Split options */}
            <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200">
              <label className="block text-xs font-black text-amber-900 uppercase mb-1.5">
                1. Mau Dibagi Berapa Potong?
              </label>
              <div className="flex gap-2">
                {currentTarget.allowedDenoms.map((d) => (
                  <button
                    key={d}
                    onClick={() => handleDenomChange(d)}
                    className={`flex-1 py-2 rounded-xl font-black text-sm border-2 cursor-pointer transition-all ${
                      denomB === d
                        ? 'bg-amber-500 text-white border-amber-600 shadow'
                        : 'bg-white hover:bg-amber-100 text-stone-800 border-amber-300'
                    }`}
                  >
                    Bagi {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Shaded piece counter */}
            <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200">
              <label className="block text-xs font-black text-amber-900 uppercase mb-1.5">
                2. Berapa Potong yang Diambil?
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNumChange(numB - 1)}
                  disabled={numB <= 0}
                  className="w-10 h-10 rounded-xl bg-amber-200 hover:bg-amber-300 text-amber-950 font-black text-lg disabled:opacity-40 cursor-pointer flex items-center justify-center border border-amber-400"
                  aria-label="Kurangi potongan"
                >
                  -
                </button>
                <div className="flex-1 bg-white py-1.5 rounded-xl text-center font-black text-lg border border-amber-300 text-amber-950">
                  {numB} Potong
                </div>
                <button
                  onClick={() => handleNumChange(numB + 1)}
                  disabled={numB >= denomB}
                  className="w-10 h-10 rounded-xl bg-amber-200 hover:bg-amber-300 text-amber-950 font-black text-lg disabled:opacity-40 cursor-pointer flex items-center justify-center border border-amber-400"
                  aria-label="Tambah potongan"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Check Button */}
        <div className="pt-2 text-center">
          <button
            onClick={handleCheckEquivalent}
            className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-lg rounded-2xl shadow-md border-3 border-emerald-600 transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2 mx-auto"
          >
            <Sparkles size={22} />
            <span>Periksa Apakah Sudah Senilai!</span>
          </button>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-4 sm:p-5 rounded-3xl font-bold flex flex-col sm:flex-row items-center sm:items-start gap-3 shadow-md ${
              feedback.correct
                ? 'bg-emerald-100 text-emerald-950 border-3 border-emerald-400'
                : 'bg-yellow-100 text-yellow-950 border-3 border-yellow-300'
            }`}
          >
            {feedback.correct ? (
              <CheckCircle2 size={28} className="text-emerald-600 flex-shrink-0" />
            ) : (
              <span className="text-2xl flex-shrink-0">💡</span>
            )}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <p className="text-base sm:text-lg">{feedback.text}</p>
              {feedback.correct && (
                <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                  <button
                    onClick={handleNextTarget}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow transition-transform active:scale-95 cursor-pointer flex items-center gap-2"
                  >
                    <span>Misi Cokelat Selanjutnya</span>
                    <RotateCcw size={16} />
                  </button>
                  {isCompleted && (
                    <button
                      onClick={onNextLevel}
                      className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-amber-950 font-black rounded-xl shadow transition-transform active:scale-95 cursor-pointer flex items-center gap-2"
                    >
                      <span>Lanjut ke Level 4 (Desimal)</span>
                      <ArrowRight size={18} />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Visual Equivalence Summary Chart */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-5 shadow-xs">
        <h3 className="font-black text-amber-950 text-base mb-2">
          Contoh Pecahan Senilai yang Sering Ditemui:
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 py-2">
          <div className="bg-white px-4 py-2 rounded-2xl border-2 border-amber-400 text-center font-black text-xl text-amber-900">
            1/2
          </div>
          <span className="text-2xl font-black text-amber-600">=</span>
          <div className="bg-white px-4 py-2 rounded-2xl border-2 border-amber-400 text-center font-black text-xl text-amber-900">
            2/4
          </div>
          <span className="text-2xl font-black text-amber-600">=</span>
          <div className="bg-white px-4 py-2 rounded-2xl border-2 border-amber-400 text-center font-black text-xl text-amber-900">
            4/8
          </div>
        </div>
        <p className="text-stone-700 text-xs sm:text-sm text-center font-bold mt-2">
          Meskipun angka atas & bawah dikalikan 2, ukuran cokelatnya tetap SAMA PERSIS!
        </p>
      </div>

      {/* 5-Question Challenge with 5/5 Gating Requirement */}
      <LevelChallengeBox
        levelNumber={3}
        levelName="Pecahan Senilai (Cokelat)"
        challenges={LEVEL_3_CHALLENGES}
        onCompleteLevel={onCompleteLevel}
        onNextLevel={onNextLevel}
        hasNextLevel={true}
      />
    </div>
  );
};
