import React, { useState } from 'react';
import { sounds } from '../utils/soundEffects';
import { MascotMessage } from './MascotMessage';
import { getUnitFractionConcept } from '../utils/fractionLogic';
import { LEVEL_1_CHALLENGES } from '../utils/levelChallengeLogic';
import { LevelChallengeBox } from './LevelChallengeBox';

interface Level1Props {
  onCompleteLevel: () => void;
  isCompleted: boolean;
  onNextLevel: () => void;
}

export const Level1Martabak: React.FC<Level1Props> = ({
  onCompleteLevel,
  isCompleted,
  onNextLevel,
}) => {
  const [slices, setSlices] = useState<number>(4);
  const [selectedSliceIndex, setSelectedSliceIndex] = useState<number | null>(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<{
    correct: boolean;
    text: string;
  } | null>(null);

  const concept = getUnitFractionConcept(slices);

  const handleSliceChange = (newVal: number) => {
    sounds.playPop();
    setSlices(newVal);
    setSelectedSliceIndex(0);
  };

  const handleQuizChoice = (choice: number) => {
    setQuizAnswer(choice);
    // Question: "Mana yang potongannya PALING BESAR?" (Answer: 2 because 1/2 is biggest)
    if (choice === 2) {
      sounds.playChime();
      sounds.playApplause();
      setQuizFeedback({
        correct: true,
        text: 'Hebat sekali, Sahabat Saung Pintar! Karena hanya dibagi 2, satu potong martabaknya paling tebal & besar!',
      });
      if (!isCompleted) {
        onCompleteLevel();
      }
    } else {
      sounds.playEncouragement();
      setQuizFeedback({
        correct: false,
        text: `Yuk coba amati lagi martabaknya saat dipotong jadi ${choice} bagian. Ternyata makin banyak yang dibagi, potongannya makin menciut lho! Coba pilih yang potongannya paling lebar ya!`,
      });
    }
  };

  // Render Martabak SVG slices
  const renderMartabakSlices = () => {
    const radius = 120;
    const center = 150;
    const sliceAngle = 360 / slices;
    const paths = [];

    for (let i = 0; i < slices; i++) {
      const startAngle = (i * sliceAngle - 90) * (Math.PI / 180);
      const endAngle = ((i + 1) * sliceAngle - 90) * (Math.PI / 180);

      const x1 = center + radius * Math.cos(startAngle);
      const y1 = center + radius * Math.sin(startAngle);
      const x2 = center + radius * Math.cos(endAngle);
      const y2 = center + radius * Math.sin(endAngle);

      const isSelected = selectedSliceIndex === i;
      // Slight outward explosion for selected slice
      const midAngle = ((i + 0.5) * sliceAngle - 90) * (Math.PI / 180);
      const offsetX = isSelected ? Math.cos(midAngle) * 12 : 0;
      const offsetY = isSelected ? Math.sin(midAngle) * 12 : 0;

      const pathData = `M ${center + offsetX} ${center + offsetY} L ${x1 + offsetX} ${y1 + offsetY} A ${radius} ${radius} 0 0 1 ${x2 + offsetX} ${y2 + offsetY} Z`;

      paths.push(
        <g
          key={i}
          onClick={() => {
            sounds.playPop();
            setSelectedSliceIndex(i);
          }}
          className="cursor-pointer transition-transform duration-300"
        >
          {/* Slice Base */}
          <path
            d={pathData}
            fill={isSelected ? '#FBBF24' : '#F59E0B'}
            stroke="#78350F"
            strokeWidth="3.5"
            className="hover:brightness-110 transition-all"
          />
          {/* Toppings (chocolate sprinkles & cheese simulation) */}
          <circle
            cx={center + offsetX + Math.cos(midAngle) * (radius * 0.55)}
            cy={center + offsetY + Math.sin(midAngle) * (radius * 0.55)}
            r={radius > 100 ? 5 : 3}
            fill="#451A03"
          />
          <circle
            cx={center + offsetX + Math.cos(midAngle + 0.1) * (radius * 0.75)}
            cy={center + offsetY + Math.sin(midAngle + 0.1) * (radius * 0.75)}
            r={3}
            fill="#FEF08A"
          />
          <circle
            cx={center + offsetX + Math.cos(midAngle - 0.1) * (radius * 0.35)}
            cy={center + offsetY + Math.sin(midAngle - 0.1) * (radius * 0.35)}
            r={2.5}
            fill="#451A03"
          />
        </g>
      );
    }

    return paths;
  };

  return (
    <div className="space-y-6">
      {/* Mascot Guidance */}
      <MascotMessage
        message="Selamat datang di Dapur Martabak Manis Dukuhwaru! Ayo kita potong loyang martabak ini bersama-sama dan lihat apa yang terjadi pada ukuran satu potongannya!"
        type="happy"
        hint="Coba perhatikan: jika loyang dipotong makin banyak, apakah satu potong yang kamu dapat semakin besar atau semakin kecil?"
        levelTitle="Level 1: Pecahan Pembilang Satu"
      />

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Visual Loyang Martabak */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border-4 border-amber-300 shadow-lg flex flex-col items-center relative overflow-hidden">
          <div className="w-full flex items-center justify-between mb-2">
            <span className="font-extrabold text-amber-950 text-base sm:text-lg flex items-center gap-2">
              🥞 1 Loyang Martabak Manis Dukuhwaru
            </span>
            <span className="bg-amber-100 text-amber-900 font-black text-sm px-3 py-1 rounded-full border border-amber-300">
              Dipotong {slices} Bagian
            </span>
          </div>

          {/* SVG Martabak Platter */}
          <div className="relative my-2">
            {/* Wooden serving board SVG background */}
            <div className="w-72 h-72 sm:w-80 sm:h-80 relative flex items-center justify-center">
              <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-xl">
                {/* Wood cutting board */}
                <circle cx="150" cy="150" r="142" fill="#E2A669" stroke="#9A5424" strokeWidth="6" />
                <circle cx="150" cy="150" r="132" fill="#F4CB9F" />
                {/* Crispy outer crust of Martabak */}
                <circle cx="150" cy="150" r="124" fill="#92400E" />
                <circle cx="150" cy="150" r="120" fill="#B45309" />
                {/* Slices */}
                {renderMartabakSlices()}
                {/* Center Hub */}
                <circle cx="150" cy="150" r="8" fill="#78350F" />
              </svg>
            </div>
          </div>

          <p className="text-xs text-stone-500 font-semibold mt-1">
            *Ketuk salah satu potongan martabak untuk mengangkatnya ke atas piring!
          </p>

          {/* Slice Selector Buttons (Huge & Accessible) */}
          <div className="w-full mt-5">
            <label className="block text-center font-bold text-stone-700 text-sm mb-2">
              Pilih Mau Dipotong Jadi Berapa Bagian:
            </label>
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {[2, 4, 8, 10].map((num) => (
                <button
                  key={num}
                  onClick={() => handleSliceChange(num)}
                  className={`py-3 px-2 rounded-2xl font-black text-base sm:text-lg border-3 transition-all cursor-pointer flex flex-col items-center justify-center ${
                    slices === num
                      ? 'bg-amber-400 text-amber-950 border-amber-600 shadow-md scale-105'
                      : 'bg-amber-50 hover:bg-amber-100 text-stone-800 border-amber-200'
                  }`}
                  aria-label={`Bagi martabak menjadi ${num} bagian`}
                >
                  <span>{num} Potong</span>
                  <span className="text-xs font-bold text-amber-900/80">1/{num}</span>
                </button>
              ))}
            </div>

            {/* Slider Option */}
            <div className="mt-4 px-2">
              <div className="flex justify-between text-xs font-bold text-stone-600 mb-1">
                <span>Dikit (2 Potong)</span>
                <span>Banyak (10 Potong)</span>
              </div>
              <input
                type="range"
                min="2"
                max="10"
                step="2"
                value={slices === 6 ? 4 : slices}
                onChange={(e) => {
                  let v = parseInt(e.target.value);
                  if (v === 6) v = 8;
                  handleSliceChange(v);
                }}
                className="w-full h-3 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                aria-label="Slider jumlah potongan martabak"
              />
            </div>
          </div>
        </div>

        {/* Right Panel: The "Aha!" Discovery & Concept Visual */}
        <div className="lg:col-span-5 space-y-4">
          {/* Card: 1 Potong Nilainya */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-3 border-amber-300 rounded-3xl p-5 shadow-sm text-center">
            <h2 className="text-xs font-black uppercase text-amber-800 tracking-wider">
              Nilai Pecahan 1 Potong Martabak
            </h2>

            {/* Big Fraction Display */}
            <div className="my-3 inline-flex flex-col items-center bg-white px-8 py-3 rounded-2xl border-3 border-amber-400 shadow-sm">
              <span className="text-4xl sm:text-5xl font-black text-amber-950">1</span>
              <div className="w-16 h-1.5 bg-amber-800 rounded-full my-1" />
              <span className="text-4xl sm:text-5xl font-black text-emerald-600">{slices}</span>
            </div>

            <div className="text-left bg-white/80 p-3.5 rounded-2xl border border-amber-200 space-y-1">
              <p className="text-sm font-extrabold text-stone-800">
                📌 Angka <span className="text-amber-900 font-black">1 (Atas/Pembilang)</span> = 1 potong martabak yang kamu ambil.
              </p>
              <p className="text-sm font-extrabold text-stone-800">
                📌 Angka <span className="text-emerald-700 font-black">{slices} (Bawah/Penyebut)</span> = Jumlah SEMUA potongan dalam 1 loyang.
              </p>
            </div>

            {/* Crucial Concept Callout for Struggling Learners */}
            <div className="mt-4 p-4 rounded-2xl bg-amber-200/70 border-2 border-amber-400 text-amber-950 text-left">
              <p className="text-sm sm:text-base font-black flex items-start gap-2">
                <span>💡</span>
                <span>
                  Rahasia Penting: <span className="underline decoration-amber-600">Semakin BANYAK potongan</span> (angka bawah semakin besar), ukuran 1 potong martabak justru <span className="text-red-700 uppercase">semakin KECIL</span>!
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Question Challenge with 5/5 Gating Requirement */}
      <LevelChallengeBox
        levelNumber={1}
        levelName="Pecahan Pembilang Satu (Martabak)"
        challenges={LEVEL_1_CHALLENGES}
        onCompleteLevel={onCompleteLevel}
        onNextLevel={onNextLevel}
        hasNextLevel={true}
      />
    </div>
  );
};
