import React from 'react';
import { sounds } from '../utils/soundEffects';
import { BADGE_LIST } from '../utils/fractionLogic';
import { Play, Sparkles, CheckCircle2 } from 'lucide-react';

interface LevelMapProps {
  onSelectLevel: (lvl: number) => void;
  completedLevels: number[];
}

export const LevelMap: React.FC<LevelMapProps> = ({
  onSelectLevel,
  completedLevels,
}) => {
  const levelDetails = [
    {
      num: 1,
      title: 'Pecahan Pembilang Satu',
      subtitle: 'Si Pemotong Martabak Dukuhwaru',
      emoji: '🥞',
      desc: 'Memotong loyang martabak jadi 2, 4, 8, dan 10 potong. Buktikan kenapa 1/2 justru lebih besar dari 1/10!',
      badgeName: 'Koki Martabak Handal',
      theme: 'from-amber-400 to-orange-400 border-amber-500',
    },
    {
      num: 2,
      title: 'Pecahan Penyebut Sama',
      subtitle: 'Makan Potongan Pizza',
      emoji: '🍕',
      desc: 'Bandingkan piring pizza. Jika ukuran tiap potongnya sama, angka atas lebih besar dapat pizza lebih banyak!',
      badgeName: 'Pesta Pizza Ceria',
      theme: 'from-red-400 to-rose-500 border-red-500',
    },
    {
      num: 3,
      title: 'Pecahan Senilai',
      subtitle: 'Tukar Potongan Cokelat',
      emoji: '🍫',
      desc: 'Membagi cokelat kedua sampai ukurannya persis sama panjang dengan cokelat pertama (1/2 = 2/4 = 4/8).',
      badgeName: 'Master Cokelat Adil',
      theme: 'from-amber-600 to-yellow-700 border-amber-800',
    },
    {
      num: 4,
      title: 'Pecahan Desimal',
      subtitle: 'Kotak Persepuluhan & Perseratusan',
      emoji: '📊',
      desc: 'Warnai 10 kotak dan 100 kotak. Lihat keajaiban pecahan berubah menjadi angka desimal dengan tanda koma!',
      badgeName: 'Penjelajah Kotak Desimal',
      theme: 'from-cyan-400 to-blue-500 border-cyan-600',
    },
    {
      num: 5,
      title: 'Konsep Persen (%)',
      subtitle: 'Peta 100 Bintang Saung Pintar',
      emoji: '⭐',
      desc: 'Kumpulkan bintang dari 100 kotak. Temukan hubungan seru antara pecahan 25/100, desimal 0,25, dan 25%!',
      badgeName: 'Bintang Saung Pintar',
      theme: 'from-yellow-300 to-amber-500 border-yellow-500',
    },
    {
      num: 6,
      title: 'Kuis 50 Soal & Leaderboard',
      subtitle: 'Ujian Akbar & Papan Juara',
      emoji: '🏆',
      desc: 'Uji kemampuanmu lewat 50 soal interaktif Level 1 - Level 5, catat skormu, dan raih posisi teratas di Papan Juara!',
      badgeName: 'Juara Akbar Pecahan',
      theme: 'from-amber-500 via-yellow-400 to-amber-600 border-amber-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-yellow-200 via-amber-200 to-emerald-200 border-4 border-amber-400 rounded-3xl p-6 sm:p-8 text-center shadow-lg relative overflow-hidden">
        <div className="absolute top-2 left-3 text-3xl opacity-50 select-none animate-pulse">✨</div>
        <div className="absolute bottom-2 right-4 text-3xl opacity-50 select-none animate-bounce">🌟</div>

        <span className="px-4 py-1 rounded-full bg-emerald-600 text-white font-black text-xs uppercase tracking-wider inline-block mb-2 shadow-xs">
          Saung Pintar Dukuhwaru • Belajar Menyenangkan Tanpa Tekanan
        </span>

        <h2 className="text-2xl sm:text-4xl font-black text-amber-950 tracking-tight">
          Peta Petualangan Pecahan 🗺️
        </h2>
        <p className="mt-2 text-stone-700 font-bold text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Hai Sahabat Pintar! Mari belajar pecahan lewat makanan lezat: Martabak Manis Dukuhwaru,
          Pizza, dan Cokelat batangan. Bebas waktu, penuh bintang, dan ramah untuk semua anak!
        </p>

        <div className="mt-5 flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => {
              sounds.playPop();
              onSelectLevel(1);
            }}
            className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-amber-950 font-black text-base shadow-md border-3 border-amber-600 flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
          >
            <Play size={20} className="fill-amber-950" />
            <span>Mulai dari Level 1 (Martabak)</span>
          </button>
          <button
            onClick={() => {
              sounds.playPop();
              onSelectLevel(6);
            }}
            className="px-6 py-3.5 rounded-2xl bg-white hover:bg-amber-50 text-amber-950 font-black text-base shadow-md border-3 border-amber-400 flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
          >
            <span className="text-xl">🏆</span>
            <span>Kuis 50 Soal & Leaderboard</span>
          </button>
        </div>
      </div>

      {/* Level Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {levelDetails.map((lvl) => {
          const isDone = completedLevels.includes(lvl.num);
          const isLocked = lvl.num >= 2 && lvl.num <= 5 && !completedLevels.includes(lvl.num - 1);
          return (
            <div
              key={lvl.num}
              className={`bg-white rounded-3xl border-4 transition-all duration-300 shadow-md flex flex-col justify-between overflow-hidden relative group hover:shadow-xl hover:-translate-y-1 ${
                isDone
                  ? 'border-emerald-400'
                  : isLocked
                  ? 'border-stone-200 opacity-90'
                  : 'border-amber-200 hover:border-amber-400'
              }`}
            >
              {/* Card Top Accent */}
              <div
                className={`p-4 bg-gradient-to-r ${
                  isLocked ? 'from-stone-400 to-stone-500' : lvl.theme
                } text-white flex items-center justify-between`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-3xl p-1 bg-white/20 rounded-xl">{lvl.emoji}</span>
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider block opacity-90">
                      Level {lvl.num} {isLocked ? '• Terkunci 🔒' : ''}
                    </span>
                    <h3 className="font-black text-base sm:text-lg leading-tight drop-shadow-xs">
                      {lvl.title}
                    </h3>
                  </div>
                </div>

                {isDone ? (
                  <div className="bg-white text-emerald-700 p-1.5 rounded-full shadow-md">
                    <CheckCircle2 size={20} />
                  </div>
                ) : isLocked ? (
                  <div className="bg-stone-100 text-stone-600 p-1.5 rounded-full shadow-sm text-xs font-black">
                    🔒
                  </div>
                ) : null}
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="font-extrabold text-amber-950 text-sm mb-1">
                    {lvl.subtitle}
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-600 font-semibold leading-relaxed">
                    {lvl.desc}
                  </p>
                  {isLocked && (
                    <div className="mt-2 text-xs font-bold text-amber-900 bg-amber-50 p-2 rounded-xl border border-amber-200">
                      🔒 Jawab benar 5/5 soal di Level {lvl.num - 1} untuk membuka level ini.
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <div className="text-xs font-bold text-stone-500 flex items-center gap-1">
                    <Sparkles size={14} className="text-amber-500" />
                    <span>Lencana: {lvl.badgeName}</span>
                  </div>

                  <button
                    onClick={() => {
                      sounds.playPop();
                      onSelectLevel(lvl.num);
                    }}
                    className={`px-4 py-2 rounded-xl font-black text-xs sm:text-sm shadow-sm transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                      isDone
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : isLocked
                        ? 'bg-stone-200 hover:bg-stone-300 text-stone-700'
                        : 'bg-amber-400 hover:bg-amber-500 text-amber-950'
                    }`}
                  >
                    <span>{isDone ? 'Mainkan Lagi' : isLocked ? 'Terkunci 🔒' : 'Mainkan'}</span>
                    <Play size={14} className="fill-current" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
