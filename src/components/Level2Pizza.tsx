import React, { useState } from 'react';
import { sounds } from '../utils/soundEffects';
import { MascotMessage } from './MascotMessage';
import { LEVEL_2_CHALLENGES } from '../utils/levelChallengeLogic';
import { LevelChallengeBox } from './LevelChallengeBox';
import { CheckCircle2, Sparkles, ArrowRight, RotateCcw } from 'lucide-react';

interface Level2Props {
  onCompleteLevel: () => void;
  isCompleted: boolean;
  onNextLevel: () => void;
}

interface PizzaProblem {
  id: number;
  denominator: number;
  numA: number;
  numB: number;
  question: string;
}

const PROBLEMS: PizzaProblem[] = [
  {
    id: 1,
    denominator: 6,
    numA: 2,
    numB: 5,
    question: 'Piring mana yang berisi potongan pizza LEBIH BANYAK?',
  },
  {
    id: 2,
    denominator: 8,
    numA: 7,
    numB: 3,
    question: 'Boni ingin porsi yang PALING KENYANG. Piring mana yang dipilih?',
  },
  {
    id: 3,
    denominator: 4,
    numA: 1,
    numB: 3,
    question: 'Mana yang lebih banyak: 1 potong dari 4 bagian atau 3 potong dari 4 bagian?',
  },
];

export const Level2Pizza: React.FC<Level2Props> = ({
  onCompleteLevel,
  isCompleted,
  onNextLevel,
}) => {
  const [currentRoundIdx, setCurrentRoundIdx] = useState<number>(0);
  const [selectedPlate, setSelectedPlate] = useState<'A' | 'B' | null>(null);
  const [roundFeedback, setRoundFeedback] = useState<{
    correct: boolean;
    text: string;
  } | null>(null);
  const [completedRounds, setCompletedRounds] = useState<number[]>([]);

  const problem = PROBLEMS[currentRoundIdx];

  const handleSelectPlate = (plate: 'A' | 'B') => {
    setSelectedPlate(plate);
    const countA = problem.numA;
    const countB = problem.numB;
    const isCorrect = (plate === 'A' && countA > countB) || (plate === 'B' && countB > countA);

    if (isCorrect) {
      sounds.playChime();
      const chosenNumerator = plate === 'A' ? countA : countB;
      const otherNumerator = plate === 'A' ? countB : countA;
      setRoundFeedback({
        correct: true,
        text: `Hebat sekali! Piring ${plate} punya ${chosenNumerator} potong, lebih banyak dari ${otherNumerator} potong. Karena ukuran tiap potongnya sama, angka atas (${chosenNumerator}) lebih besar artinya dapat pizza LEBIH BANYAK! 🍕`,
      });

      if (!completedRounds.includes(problem.id)) {
        const nextDone = [...completedRounds, problem.id];
        setCompletedRounds(nextDone);
        if (nextDone.length >= PROBLEMS.length && !isCompleted) {
          sounds.playFanfare();
          onCompleteLevel();
        }
      }
    } else {
      sounds.playEncouragement();
      const chosenCount = plate === 'A' ? countA : countB;
      const otherPlate = plate === 'A' ? 'B' : 'A';
      const otherCount = plate === 'A' ? countB : countA;
      setRoundFeedback({
        correct: false,
        text: `Yuk, coba kita hitung bersama! Piring ${plate} hanya ada ${chosenCount} potong, sedangkan Piring ${otherPlate} ada ${otherCount} potong. Coba pilih piring yang potongannya lebih banyak ya!`,
      });
    }
  };

  const nextProblem = () => {
    sounds.playPop();
    setSelectedPlate(null);
    setRoundFeedback(null);
    setCurrentRoundIdx((prev) => (prev + 1) % PROBLEMS.length);
  };

  // Render SVG Pizza with exact sliced portions
  const renderPizzaPlate = (
    numerator: number,
    denominator: number,
    plateLabel: 'A' | 'B',
    isSelected: boolean
  ) => {
    const radius = 80;
    const center = 100;
    const sliceAngle = 360 / denominator;
    const slices = [];

    for (let i = 0; i < denominator; i++) {
      const isFilled = i < numerator;
      const startAngle = (i * sliceAngle - 90) * (Math.PI / 180);
      const endAngle = ((i + 1) * sliceAngle - 90) * (Math.PI / 180);

      const x1 = center + radius * Math.cos(startAngle);
      const y1 = center + radius * Math.sin(startAngle);
      const x2 = center + radius * Math.cos(endAngle);
      const y2 = center + radius * Math.sin(endAngle);

      const pathData = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;

      const midAngle = ((i + 0.5) * sliceAngle - 90) * (Math.PI / 180);
      const topX = center + Math.cos(midAngle) * (radius * 0.55);
      const topY = center + Math.sin(midAngle) * (radius * 0.55);

      slices.push(
        <g key={i}>
          {isFilled ? (
            <>
              {/* Golden Cheese Slice */}
              <path
                d={pathData}
                fill="#FBBF24"
                stroke="#B45309"
                strokeWidth="2.5"
                className="transition-all"
              />
              {/* Tomato sauce peek */}
              <circle cx={topX} cy={topY} r="7" fill="#DC2626" />
              {/* Basil herb speckle */}
              <circle cx={topX + 4} cy={topY - 4} r="2" fill="#15803D" />
            </>
          ) : (
            /* Empty plate slot showing plate base */
            <path
              d={pathData}
              fill="#F8FAFC"
              stroke="#CBD5E1"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
          )}
        </g>
      );
    }

    return (
      <div
        onClick={() => handleSelectPlate(plateLabel)}
        className={`bg-white rounded-3xl p-5 border-4 transition-all cursor-pointer flex flex-col items-center shadow-md relative ${
          isSelected
            ? roundFeedback?.correct
              ? 'border-emerald-500 bg-emerald-50/50 scale-102 ring-4 ring-emerald-200'
              : 'border-yellow-400 bg-yellow-50/50 ring-4 ring-yellow-200'
            : 'border-amber-200 hover:border-amber-400 hover:scale-102'
        }`}
        role="button"
        tabIndex={0}
        aria-label={`Pilih Piring ${plateLabel} dengan pecahan ${numerator}/${denominator}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleSelectPlate(plateLabel);
          }
        }}
      >
        {/* Plate Header */}
        <div className="flex items-center justify-between w-full mb-2">
          <span className="font-black text-amber-950 text-lg px-3 py-1 rounded-xl bg-amber-100">
            Piring {plateLabel}
          </span>
          <span className="text-xs font-bold text-stone-500">
            {numerator} dari {denominator} potong
          </span>
        </div>

        {/* SVG Plate & Pizza */}
        <div className="w-56 h-56 sm:w-64 sm:h-64 relative flex items-center justify-center my-2">
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
            {/* Ceramic Plate */}
            <circle cx="100" cy="100" r="95" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="4" />
            <circle cx="100" cy="100" r="88" fill="#F1F5F9" />
            {/* Pizza Crust Ring */}
            <circle cx="100" cy="100" r="83" fill="#B45309" />
            {/* Slices */}
            {slices}
            {/* Center Pin */}
            <circle cx="100" cy="100" r="4" fill="#78350F" />
          </svg>
        </div>

        {/* Fraction Display */}
        <div className="mt-3 flex flex-col items-center bg-amber-50 px-6 py-2.5 rounded-2xl border-2 border-amber-300">
          <span className="text-3xl font-black text-amber-950">{numerator}</span>
          <div className="w-12 h-1 bg-amber-800 rounded-full my-0.5" />
          <span className="text-3xl font-black text-stone-700">{denominator}</span>
        </div>

        <button
          className={`mt-4 w-full py-3 rounded-2xl font-black text-base shadow-sm transition-transform cursor-pointer ${
            isSelected
              ? 'bg-amber-500 text-white shadow-md'
              : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
          }`}
        >
          Pilih Piring {plateLabel} Ini
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Mascot Guidance */}
      <MascotMessage
        message="Ayo kita berpesta pizza! Lihat, kedua piring dipotong sama rata. Sekarang, piring mana yang memberi kita potongan LEBIH BANYAK?"
        type="happy"
        hint="Jika penyebut (angka bawah) SAMA, cukup lihat angka atas (pembilang). Angka atas lebih besar = pizza lebih banyak!"
        levelTitle="Level 2: Pecahan Penyebut Sama"
      />

      {/* Round Progress Tracker */}
      <div className="bg-white rounded-2xl p-3 border-2 border-amber-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-stone-700 text-sm">Misi Pizza:</span>
          <div className="flex gap-1.5">
            {PROBLEMS.map((p, idx) => (
              <span
                key={p.id}
                className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                  completedRounds.includes(p.id)
                    ? 'bg-emerald-500 text-white'
                    : currentRoundIdx === idx
                    ? 'bg-amber-400 text-amber-950 border-2 border-amber-600'
                    : 'bg-stone-100 text-stone-500'
                }`}
              >
                {completedRounds.includes(p.id) ? '✓' : idx + 1}
              </span>
            ))}
          </div>
        </div>
        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
          {completedRounds.length}/{PROBLEMS.length} Terselesaikan
        </span>
      </div>

      {/* Question Prompt */}
      <div className="text-center bg-amber-100/70 py-3 px-4 rounded-2xl border border-amber-300">
        <h2 className="text-base sm:text-xl font-black text-amber-950 flex items-center justify-center gap-2">
          <span>🍕</span>
          <span>{problem.question}</span>
        </h2>
      </div>

      {/* Two Plates Side-by-Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderPizzaPlate(problem.numA, problem.denominator, 'A', selectedPlate === 'A')}
        {renderPizzaPlate(problem.numB, problem.denominator, 'B', selectedPlate === 'B')}
      </div>

      {/* Round Feedback and Explanation */}
      {roundFeedback && (
        <div
          className={`p-4 sm:p-5 rounded-3xl font-bold flex flex-col sm:flex-row items-center sm:items-start gap-3 shadow-md ${
            roundFeedback.correct
              ? 'bg-emerald-100 text-emerald-950 border-3 border-emerald-400'
              : 'bg-yellow-100 text-yellow-950 border-3 border-yellow-300'
          }`}
        >
          {roundFeedback.correct ? (
            <CheckCircle2 size={28} className="text-emerald-600 flex-shrink-0" />
          ) : (
            <span className="text-2xl flex-shrink-0">🤔</span>
          )}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <p className="text-base sm:text-lg">{roundFeedback.text}</p>
            {roundFeedback.correct && (
              <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                <button
                  onClick={nextProblem}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow transition-transform active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <span>Misi Pizza Berikutnya</span>
                  <RotateCcw size={16} />
                </button>
                {isCompleted && (
                  <button
                    onClick={onNextLevel}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-amber-950 font-black rounded-xl shadow transition-transform active:scale-95 cursor-pointer flex items-center gap-2"
                  >
                    <span>Lanjut ke Level 3 (Cokelat)</span>
                    <ArrowRight size={18} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Visual Rule Box */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-5 shadow-xs">
        <h3 className="font-black text-amber-950 text-base mb-2 flex items-center gap-2">
          <Sparkles size={18} className="text-amber-600" />
          <span>Rumus Mudah Diingat:</span>
        </h3>
        <p className="text-stone-700 font-bold text-sm leading-relaxed">
          Bila angka bawah (penyebut) sama, berarti ukuran sepotong pizza di kedua piring sama persis.
          Tinggal bandingkan angka atas (pembilang):{' '}
          <strong className="text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-md">
            Makin BESAR angka atas, makin BANYAK potongan pizza yang kita dapatkan!
          </strong>
        </p>
      </div>

      {/* 5-Question Challenge with 5/5 Gating Requirement */}
      <LevelChallengeBox
        levelNumber={2}
        levelName="Pecahan Penyebut Sama (Pizza)"
        challenges={LEVEL_2_CHALLENGES}
        onCompleteLevel={onCompleteLevel}
        onNextLevel={onNextLevel}
        hasNextLevel={true}
      />
    </div>
  );
};
