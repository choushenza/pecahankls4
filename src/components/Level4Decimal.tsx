import React, { useState } from 'react';
import { sounds } from '../utils/soundEffects';
import { MascotMessage } from './MascotMessage';
import { formatTenthsToDecimal, formatHundredthsToDecimal } from '../utils/fractionLogic';
import { LEVEL_4_CHALLENGES } from '../utils/levelChallengeLogic';
import { LevelChallengeBox } from './LevelChallengeBox';
import { CheckCircle2, Sparkles, ArrowRight, RotateCcw } from 'lucide-react';

interface Level4Props {
  onCompleteLevel: () => void;
  isCompleted: boolean;
  onNextLevel: () => void;
}

export const Level4Decimal: React.FC<Level4Props> = ({
  onCompleteLevel,
  isCompleted,
  onNextLevel,
}) => {
  const [mode, setMode] = useState<'tenths' | 'hundredths'>('tenths');
  const [tenthsCount, setTenthsCount] = useState<number>(3);
  const [hundredthsCount, setHundredthsCount] = useState<number>(25);

  // Challenges
  const [targetChallenge, setTargetChallenge] = useState<{
    mode: 'tenths' | 'hundredths';
    target: number;
    title: string;
  }>({
    mode: 'tenths',
    target: 4,
    title: 'Misi: Warnai tepat 4 kotak untuk membuat 0,4',
  });

  const [feedback, setFeedback] = useState<{
    correct: boolean;
    text: string;
  } | null>(null);

  const tenthsData = formatTenthsToDecimal(tenthsCount);
  const hundredthsData = formatHundredthsToDecimal(hundredthsCount);

  const handleTenthsClick = (idx: number) => {
    sounds.playPop();
    const newCount = idx + 1 === tenthsCount ? idx : idx + 1;
    setTenthsCount(newCount);
    checkChallenge(newCount, 'tenths');
  };

  const handleHundredthsClick = (idx: number) => {
    sounds.playPop();
    const newCount = idx + 1 === hundredthsCount ? idx : idx + 1;
    setHundredthsCount(newCount);
    checkChallenge(newCount, 'hundredths');
  };

  const checkChallenge = (currentVal: number, currentMode: 'tenths' | 'hundredths') => {
    if (targetChallenge.mode === currentMode && currentVal === targetChallenge.target) {
      sounds.playChime();
      sounds.playApplause();
      setFeedback({
        correct: true,
        text: `Bagus sekali! Kamu mewarnai ${currentVal} kotak, pecahannya adalah ${
          currentMode === 'tenths' ? `${currentVal}/10` : `${currentVal}/100`
        }, dan bentuk desimalnya adalah ${
          currentMode === 'tenths' ? tenthsData.decimalStr : hundredthsData.decimalStr
        }! 🎉`,
      });
      if (!isCompleted) {
        onCompleteLevel();
      }
    } else {
      setFeedback(null);
    }
  };

  const setPresetChallenge = (targetMode: 'tenths' | 'hundredths', targetNum: number) => {
    sounds.playPop();
    setMode(targetMode);
    setTargetChallenge({
      mode: targetMode,
      target: targetNum,
      title:
        targetMode === 'tenths'
          ? `Misi: Warnai ${targetNum} kotak untuk membuat 0,${targetNum}`
          : `Misi: Warnai ${targetNum} kotak untuk membuat 0,${targetNum < 10 ? '0' : ''}${targetNum}`,
    });
    setFeedback(null);
  };

  return (
    <div className="space-y-6">
      {/* Mascot Guidance */}
      <MascotMessage
        message="Selamat datang di Dunia Angka Desimal! Desimal itu sebenarnya pecahan persepuluhan (ada 1 angka di belakang koma) atau perseratusan (ada 2 angka di belakang koma). Coba klik kotak-kotak di bawah!"
        type="happy"
        hint="Tanda koma (,) seperti jembatan yang memisahkan bagian utuh dengan potongan kecil."
        levelTitle="Level 4: Kotak Desimal"
      />

      {/* Mode Switcher Tabs */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={() => {
            sounds.playPop();
            setMode('tenths');
            setFeedback(null);
          }}
          className={`px-5 py-3 rounded-2xl font-black text-sm sm:text-base border-3 transition-all cursor-pointer flex items-center gap-2 ${
            mode === 'tenths'
              ? 'bg-cyan-500 text-white border-cyan-600 shadow-md scale-105'
              : 'bg-white hover:bg-cyan-50 text-stone-700 border-cyan-200'
          }`}
        >
          <span>📏 Persepuluhan (10 Kotak)</span>
        </button>
        <button
          onClick={() => {
            sounds.playPop();
            setMode('hundredths');
            setFeedback(null);
          }}
          className={`px-5 py-3 rounded-2xl font-black text-sm sm:text-base border-3 transition-all cursor-pointer flex items-center gap-2 ${
            mode === 'hundredths'
              ? 'bg-blue-600 text-white border-blue-700 shadow-md scale-105'
              : 'bg-white hover:bg-blue-50 text-stone-700 border-blue-200'
          }`}
        >
          <span>🗺️ Perseratusan (100 Kotak)</span>
        </button>
      </div>

      {/* Main Interactive Grid Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Visual Grid */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border-4 border-cyan-300 shadow-lg flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-3">
            <span className="font-black text-stone-800 text-base sm:text-lg">
              {mode === 'tenths' ? 'Kotak Persepuluhan (Total 10)' : 'Kotak Perseratusan (Total 100)'}
            </span>
            <span className="text-xs font-bold text-cyan-900 bg-cyan-100 px-3 py-1 rounded-full border border-cyan-300">
              {mode === 'tenths' ? `${tenthsCount} Kotak Diwarnai` : `${hundredthsCount} Kotak Diwarnai`}
            </span>
          </div>

          {/* Render 10 Grid or 100 Grid */}
          {mode === 'tenths' ? (
            <div className="w-full space-y-3 my-2">
              <div className="grid grid-cols-10 gap-1.5 sm:gap-2 h-20 sm:h-24 bg-cyan-50 p-2 rounded-2xl border-2 border-cyan-200">
                {Array.from({ length: 10 }).map((_, idx) => {
                  const isColored = idx < tenthsCount;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleTenthsClick(idx)}
                      className={`rounded-xl transition-all font-black text-xs sm:text-sm flex items-center justify-center border-2 cursor-pointer ${
                        isColored
                          ? 'bg-cyan-500 border-cyan-700 text-white shadow-sm ring-2 ring-cyan-300 hover:brightness-110'
                          : 'bg-white border-cyan-200 hover:bg-cyan-100 text-stone-400'
                      }`}
                      title={`Kotak ke-${idx + 1}`}
                      aria-label={`Kotak ke-${idx + 1} persepuluhan`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-stone-500 text-center font-semibold">
                *Klik pada kotak nomor berapapun untuk mewarnai sampai nomor tersebut.
              </p>
            </div>
          ) : (
            <div className="w-full space-y-3 my-2">
              <div className="grid grid-cols-10 gap-1 p-2 bg-blue-50 rounded-2xl border-2 border-blue-200 aspect-square max-w-sm mx-auto">
                {Array.from({ length: 100 }).map((_, idx) => {
                  const isColored = idx < hundredthsCount;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleHundredthsClick(idx)}
                      className={`rounded-xs sm:rounded-sm transition-colors border cursor-pointer ${
                        isColored
                          ? 'bg-blue-600 border-blue-800 ring-1 ring-blue-300'
                          : 'bg-white border-blue-200 hover:bg-blue-100'
                      }`}
                      title={`Kotak ${idx + 1}`}
                      aria-label={`Kotak ${idx + 1} perseratusan`}
                    />
                  );
                })}
              </div>

              {/* Slider for 100 grid for quick interaction */}
              <div className="px-3">
                <div className="flex justify-between text-xs font-bold text-stone-600 mb-1">
                  <span>0 Kotak</span>
                  <span>50 Kotak</span>
                  <span>100 Kotak</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={hundredthsCount}
                  onChange={(e) => {
                    sounds.playPop();
                    const val = parseInt(e.target.value);
                    setHundredthsCount(val);
                    checkChallenge(val, 'hundredths');
                  }}
                  className="w-full h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  aria-label="Slider jumlah kotak perseratusan"
                />
              </div>
            </div>
          )}

          {/* Quick preset buttons */}
          <div className="w-full mt-4 pt-3 border-t border-cyan-100">
            <span className="block text-xs font-black text-stone-600 uppercase mb-2 text-center">
              Pilihan Contoh Cepat:
            </span>
            <div className="flex flex-wrap gap-2 justify-center">
              {mode === 'tenths' ? (
                <>
                  {[1, 4, 7, 10].map((n) => (
                    <button
                      key={n}
                      onClick={() => {
                        sounds.playPop();
                        setTenthsCount(n);
                        checkChallenge(n, 'tenths');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-cyan-100 hover:bg-cyan-200 text-cyan-900 font-black text-xs border border-cyan-300 cursor-pointer"
                    >
                      {n}/10 (0,{n === 10 ? '1,0' : n})
                    </button>
                  ))}
                </>
              ) : (
                <>
                  {[10, 25, 50, 75].map((n) => (
                    <button
                      key={n}
                      onClick={() => {
                        sounds.playPop();
                        setHundredthsCount(n);
                        checkChallenge(n, 'hundredths');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-900 font-black text-xs border border-blue-300 cursor-pointer"
                    >
                      {n}/100 (0,{n})
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: The Visual Transformation Display */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border-3 border-cyan-300 rounded-3xl p-5 shadow-sm text-center">
            <h2 className="text-xs font-black uppercase text-cyan-900 tracking-wider">
              Transformasi Pecahan ke Desimal
            </h2>

            {/* Side by side equation */}
            <div className="my-4 flex items-center justify-center gap-3 flex-wrap">
              {/* Fraction box */}
              <div className="bg-white px-5 py-3 rounded-2xl border-3 border-cyan-400 shadow-sm flex flex-col items-center">
                <span className="text-3xl font-black text-stone-800">
                  {mode === 'tenths' ? tenthsData.fractionStr.split('/')[0] : hundredthsData.fractionStr.split('/')[0]}
                </span>
                <div className="w-12 h-1 bg-cyan-800 rounded-full my-0.5" />
                <span className="text-3xl font-black text-cyan-700">
                  {mode === 'tenths' ? '10' : '100'}
                </span>
              </div>

              <span className="text-3xl font-black text-cyan-800">=</span>

              {/* Decimal Box */}
              <div className="bg-cyan-500 text-white px-6 py-4 rounded-2xl border-3 border-cyan-700 shadow-md">
                <span className="text-3xl sm:text-4xl font-black tracking-wider">
                  {mode === 'tenths' ? tenthsData.decimalStr : hundredthsData.decimalStr}
                </span>
                <span className="block text-xs font-bold text-cyan-100 mt-1">Bentuk Desimal</span>
              </div>
            </div>

            {/* Reading explanation */}
            <div className="bg-white/90 p-4 rounded-2xl border border-cyan-200 text-left space-y-2">
              <p className="text-sm font-bold text-stone-800">
                🗣️ <strong>Cara Membaca:</strong>{' '}
                <span className="text-cyan-900 font-black">
                  {mode === 'tenths'
                    ? tenthsCount === 10
                      ? 'Satu bulat penuh (1,0)'
                      : `Nol koma ${tenthsCount}`
                    : `Nol koma ${hundredthsCount < 10 ? `nol ${hundredthsCount}` : hundredthsCount}`}
                </span>
              </p>
              <p className="text-xs font-bold text-stone-600">
                {mode === 'tenths'
                  ? 'Karena penyebutnya 10, ada 1 angka di belakang tanda koma.'
                  : 'Karena penyebutnya 100, ada 2 angka di belakang tanda koma.'}
              </p>
            </div>
          </div>

          {/* Interactive Challenge Card */}
          <div className="bg-white border-3 border-cyan-300 rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-cyan-900">
              <Sparkles size={20} className="fill-cyan-400" />
              <h3 className="font-black text-base sm:text-lg">Tantangan Desimal</h3>
            </div>

            <div className="p-3 bg-cyan-50 rounded-2xl border border-cyan-200">
              <p className="text-sm font-black text-stone-800">{targetChallenge.title}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setPresetChallenge('tenths', 4)}
                className="flex-1 py-2 px-1 text-xs font-black rounded-xl bg-cyan-100 hover:bg-cyan-200 text-cyan-900 border border-cyan-300 cursor-pointer"
              >
                Tantangan 0,4
              </button>
              <button
                onClick={() => setPresetChallenge('tenths', 7)}
                className="flex-1 py-2 px-1 text-xs font-black rounded-xl bg-cyan-100 hover:bg-cyan-200 text-cyan-900 border border-cyan-300 cursor-pointer"
              >
                Tantangan 0,7
              </button>
              <button
                onClick={() => setPresetChallenge('hundredths', 35)}
                className="flex-1 py-2 px-1 text-xs font-black rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-900 border border-blue-300 cursor-pointer"
              >
                Tantangan 0,35
              </button>
            </div>

            {feedback && (
              <div className="p-3 bg-emerald-100 text-emerald-950 rounded-2xl border-2 border-emerald-400 font-bold text-sm flex items-start gap-2">
                <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{feedback.text}</span>
              </div>
            )}

            {isCompleted && (
              <div className="pt-2 flex items-center justify-between border-t border-cyan-100">
                <span className="text-cyan-800 font-black text-xs sm:text-sm">
                  ⭐ Lencana Kotak Desimal Terbuka!
                </span>
                <button
                  onClick={onNextLevel}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-xl shadow flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
                >
                  <span>Lanjut ke Level 5 (Persen)</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5-Question Challenge with 5/5 Gating Requirement */}
      <LevelChallengeBox
        levelNumber={4}
        levelName="Pecahan Desimal (Persepuluhan & Perseratusan)"
        challenges={LEVEL_4_CHALLENGES}
        onCompleteLevel={onCompleteLevel}
        onNextLevel={onNextLevel}
        hasNextLevel={true}
      />
    </div>
  );
};
