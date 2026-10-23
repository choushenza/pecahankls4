import React, { useState } from 'react';
import { sounds } from '../utils/soundEffects';
import { MascotMessage } from './MascotMessage';
import { formatHundredthsToDecimal } from '../utils/fractionLogic';
import { LEVEL_5_CHALLENGES } from '../utils/levelChallengeLogic';
import { LevelChallengeBox } from './LevelChallengeBox';
import { CheckCircle2, Sparkles, Award, Star, RotateCcw } from 'lucide-react';

interface Level5Props {
  onCompleteLevel: () => void;
  isCompleted: boolean;
  onOpenBadges: () => void;
}

export const Level5Percent: React.FC<Level5Props> = ({
  onCompleteLevel,
  isCompleted,
  onOpenBadges,
}) => {
  const [starCount, setStarCount] = useState<number>(25);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<{
    correct: boolean;
    text: string;
  } | null>(null);

  const data = formatHundredthsToDecimal(starCount);

  const handleStarClick = (idx: number) => {
    sounds.playPop();
    const newCount = idx + 1 === starCount ? idx : idx + 1;
    setStarCount(newCount);
  };

  const handlePreset = (val: number) => {
    sounds.playPop();
    setStarCount(val);
  };

  const handleQuizChoice = (ans: number) => {
    setQuizAnswer(ans);
    // Question: "Jika mengumpulkan 50 dari 100 bintang, berapa persen nilainya?"
    if (ans === 50) {
      sounds.playChime();
      sounds.playFanfare();
      setQuizFeedback({
        correct: true,
        text: 'Luar Biasa, Juara Saung Pintar! 50 dari 100 bintang sama dengan 50/100 = 0,50 = 50% (setengah dari seluruh bintang)! ⭐🎉',
      });
      if (!isCompleted) {
        onCompleteLevel();
      }
    } else {
      sounds.playEncouragement();
      setQuizFeedback({
        correct: false,
        text: `Ingat ya, persen artinya "per seratus". Jadi kalau ada ${ans} bintang dari 100 bintang, nilainya adalah ${ans}%. Nah, soal tadi mencari nilai untuk 50 bintang, yuk pilih 50%!`,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Mascot Guidance */}
      <MascotMessage
        message="Selamat datang di Puncak Petualangan: Konsep Persen (%)! Tahukah kamu? Kata 'Persen' berasal dari kata 'Per-Seratus'. Setiap kotak bintang dari 100 kotak bernilai 1%!"
        type="celebrate"
        hint="Simbol % memiliki garis miring dan dua lingkaran kecil, mirip seperti angka 100!"
        levelTitle="Level 5: Konsep Persen (%)"
      />

      {/* Triple Transformation Banner (Fraction = Decimal = Percent) */}
      <div className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 rounded-3xl p-5 border-4 border-amber-500 shadow-md">
        <h2 className="text-center font-black text-amber-950 text-sm sm:text-base uppercase tracking-wider mb-3">
          Tiga Sahabat Karib: Pecahan, Desimal, dan Persen
        </h2>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
          {/* Fraction Card */}
          <div className="bg-white px-4 sm:px-6 py-2.5 rounded-2xl border-3 border-amber-600 shadow flex flex-col items-center">
            <span className="text-xs font-black text-stone-500 uppercase">Pecahan</span>
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-black text-stone-900">{starCount}</span>
              <div className="w-12 h-1 bg-amber-800 rounded-full my-0.5" />
              <span className="text-2xl sm:text-3xl font-black text-amber-700">100</span>
            </div>
          </div>

          <span className="text-3xl font-black text-amber-950">=</span>

          {/* Decimal Card */}
          <div className="bg-white px-4 sm:px-6 py-2.5 rounded-2xl border-3 border-cyan-500 shadow flex flex-col items-center">
            <span className="text-xs font-black text-stone-500 uppercase">Desimal</span>
            <span className="text-2xl sm:text-3xl font-black text-cyan-800 my-auto">
              {data.decimalStr}
            </span>
          </div>

          <span className="text-3xl font-black text-amber-950">=</span>

          {/* Percent Card */}
          <div className="bg-white px-4 sm:px-6 py-2.5 rounded-2xl border-3 border-emerald-500 shadow flex flex-col items-center">
            <span className="text-xs font-black text-stone-500 uppercase">Persen</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-600 my-auto">
              {data.percentStr}
            </span>
          </div>
        </div>
      </div>

      {/* Main 100-Star Grid & Interactive Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 100-Star Grid */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border-4 border-yellow-300 shadow-lg flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-3">
            <span className="font-black text-stone-800 text-base sm:text-lg flex items-center gap-1.5">
              ⭐ Peta 100 Bintang Saung Pintar
            </span>
            <span className="text-xs font-black text-amber-950 bg-amber-200 px-3 py-1 rounded-full border border-amber-300">
              {starCount} dari 100 ({data.percentStr})
            </span>
          </div>

          {/* 10x10 Star Grid */}
          <div className="grid grid-cols-10 gap-1 sm:gap-1.5 p-3 bg-amber-50 rounded-2xl border-2 border-amber-200 aspect-square w-full max-w-sm mx-auto">
            {Array.from({ length: 100 }).map((_, idx) => {
              const isFilled = idx < starCount;
              return (
                <button
                  key={idx}
                  onClick={() => handleStarClick(idx)}
                  className={`rounded-md sm:rounded-lg aspect-square flex items-center justify-center transition-all cursor-pointer border ${
                    isFilled
                      ? 'bg-amber-400 border-amber-600 shadow-xs text-amber-950 scale-102 hover:brightness-110'
                      : 'bg-white border-amber-200 hover:bg-amber-100 text-stone-300'
                  }`}
                  title={`Bintang ${idx + 1}`}
                  aria-label={`Bintang ${idx + 1} persen`}
                >
                  <Star
                    size={14}
                    className={isFilled ? 'fill-amber-900 text-amber-900' : 'text-stone-300'}
                  />
                </button>
              );
            })}
          </div>

          {/* Slider */}
          <div className="w-full px-3 mt-4">
            <div className="flex justify-between text-xs font-bold text-stone-600 mb-1">
              <span>0% (0 Bintang)</span>
              <span>50%</span>
              <span>100% (Penuh)</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={starCount}
              onChange={(e) => {
                sounds.playPop();
                setStarCount(parseInt(e.target.value));
              }}
              className="w-full h-3 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
              aria-label="Slider koleksi bintang persen"
            />
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap gap-2 justify-center mt-4 pt-3 border-t border-amber-100 w-full">
            {[10, 25, 50, 75, 100].map((p) => (
              <button
                key={p}
                onClick={() => handlePreset(p)}
                className={`px-3 py-1.5 rounded-xl font-black text-xs border-2 transition-all cursor-pointer ${
                  starCount === p
                    ? 'bg-amber-500 text-white border-amber-600 shadow'
                    : 'bg-amber-100 hover:bg-amber-200 text-amber-950 border-amber-300'
                }`}
              >
                {p}% ({p} Bintang)
              </button>
            ))}
          </div>
        </div>

        {/* Right: Meaning of Percent & Quiz */}
        <div className="lg:col-span-5 space-y-4">
          {/* Explanation Box */}
          <div className="bg-amber-50 border-3 border-amber-300 rounded-3xl p-5 shadow-sm space-y-2">
            <h3 className="font-black text-amber-950 text-base flex items-center gap-2">
              <Sparkles size={18} className="text-amber-600" />
              <span>Arti Rahasia Simbol %</span>
            </h3>
            <p className="text-sm font-bold text-stone-700 leading-relaxed">
              Kata <strong>Persen</strong> artinya <em>Per-Seratus</em>.
            </p>
            <div className="bg-white p-3 rounded-2xl border border-amber-200 text-xs sm:text-sm font-bold text-stone-800 space-y-1">
              <p>✨ <strong>25%</strong> = 25 potong dari 100 bagian (0,25)</p>
              <p>✨ <strong>50%</strong> = 50 potong dari 100 bagian (setengah / 0,50)</p>
              <p>✨ <strong>100%</strong> = Semua 100 bintang terkumpul penuh (1 utuh)!</p>
            </div>
          </div>

          {/* Interactive Quiz */}
          <div className="bg-white border-3 border-yellow-400 rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-amber-900">
              <Star size={20} className="fill-amber-400 text-amber-500" />
              <h3 className="font-black text-base sm:text-lg">Tantangan Bintang Persen</h3>
            </div>

            <p className="text-sm font-bold text-stone-800">
              Jika Sahabat Saung Pintar mengumpulkan <strong>50 dari 100 bintang</strong>, berapa persen nilainya?
            </p>

            <div className="grid grid-cols-3 gap-2">
              {[25, 50, 75].map((val) => (
                <button
                  key={val}
                  onClick={() => handleQuizChoice(val)}
                  className={`py-3 rounded-2xl font-black text-base border-3 transition-all cursor-pointer ${
                    quizAnswer === val
                      ? quizFeedback?.correct
                        ? 'bg-emerald-500 text-white border-emerald-600 scale-105'
                        : 'bg-amber-200 text-amber-950 border-amber-400'
                      : 'bg-amber-50 hover:bg-amber-100 text-stone-800 border-amber-200'
                  }`}
                  aria-label={`Pilihan ${val} persen`}
                >
                  {val}%
                </button>
              ))}
            </div>

            {quizFeedback && (
              <div
                className={`p-3.5 rounded-2xl text-sm font-bold flex items-start gap-2 ${
                  quizFeedback.correct
                    ? 'bg-emerald-100 text-emerald-950 border-2 border-emerald-400'
                    : 'bg-yellow-100 text-yellow-950 border-2 border-yellow-300'
                }`}
              >
                {quizFeedback.correct ? (
                  <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <span className="text-lg flex-shrink-0">💡</span>
                )}
                <span>{quizFeedback.text}</span>
              </div>
            )}

            {isCompleted && (
              <div className="pt-3 border-t border-amber-200 flex flex-col gap-2">
                <div className="p-3 bg-amber-100 rounded-2xl text-center">
                  <span className="text-amber-950 font-black text-sm block">
                    🎉 SELAMAT! Kamu telah menyelesaikan seluruh 5 Level Pecahan!
                  </span>
                </div>
                <button
                  onClick={onOpenBadges}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-amber-950 font-black rounded-2xl shadow-lg border-2 border-amber-600 flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
                >
                  <Award size={20} />
                  <span>Buka Papan Stiker & Penghargaan Digital!</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5-Question Challenge with 5/5 Gating Requirement */}
      <LevelChallengeBox
        levelNumber={5}
        levelName="Konsep Persen (%)"
        challenges={LEVEL_5_CHALLENGES}
        onCompleteLevel={onCompleteLevel}
        onNextLevel={onOpenBadges}
        hasNextLevel={false}
      />
    </div>
  );
};
