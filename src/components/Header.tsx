import React from 'react';
import { Volume2, VolumeX, Award, Home, HelpCircle } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface HeaderProps {
  currentLevel: number;
  onSelectLevel: (lvl: number) => void;
  completedLevels: number[];
  earnedBadgesCount: number;
  onOpenBadges: () => void;
  onOpenHelp: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLevel,
  onSelectLevel,
  completedLevels,
  earnedBadgesCount,
  onOpenBadges,
  onOpenHelp,
  isMuted,
  onToggleMute,
}) => {
  const levels = [
    { num: 1, title: 'Level 1: Martabak', emoji: '🥞' },
    { num: 2, title: 'Level 2: Pizza', emoji: '🍕' },
    { num: 3, title: 'Level 3: Cokelat', emoji: '🍫' },
    { num: 4, title: 'Level 4: Desimal', emoji: '📊' },
    { num: 5, title: 'Level 5: Persen %', emoji: '⭐' },
    { num: 6, title: 'Kuis 50 & Juara', emoji: '🏆' },
  ];

  return (
    <header className="bg-gradient-to-r from-amber-300 via-yellow-200 to-emerald-200 border-b-4 border-amber-400 shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">
        {/* Top bar with branding and actions */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-center md:text-left">
            <button
              onClick={() => {
                sounds.playPop();
                onSelectLevel(0);
              }}
              className="bg-white/90 p-2.5 rounded-2xl shadow-sm border-2 border-amber-400 hover:scale-105 transition-transform flex items-center justify-center cursor-pointer"
              title="Kembali ke Peta Petualangan"
              aria-label="Kembali ke Beranda Peta Petualangan"
            >
              <span className="text-2xl" role="img" aria-label="Logo Saung">🏡</span>
            </button>
            <div>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-xs font-black tracking-wide uppercase">
                  Kelas 4 SD
                </span>
                <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                  Bab 2 Pecahan
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-amber-950 tracking-tight drop-shadow-xs">
                Petualangan Pecahan Saung Pintar Dukuhwaru
              </h1>
            </div>
          </div>

          {/* Quick utility buttons */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {/* Sound Toggle */}
            <button
              onClick={() => {
                onToggleMute();
                if (isMuted) sounds.playPop();
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl font-bold text-sm shadow-sm transition-all border-2 cursor-pointer ${
                isMuted
                  ? 'bg-rose-100 border-rose-300 text-rose-700 hover:bg-rose-200'
                  : 'bg-white border-amber-400 text-amber-900 hover:bg-amber-50'
              }`}
              title={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
              aria-label={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} className="text-emerald-600 animate-pulse" />}
              <span className="hidden sm:inline">{isMuted ? 'Bisu' : 'Suara'}</span>
            </button>

            {/* Badges / Rewards button */}
            <button
              onClick={() => {
                sounds.playPop();
                onOpenBadges();
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl font-black text-sm bg-amber-400 hover:bg-amber-500 text-amber-950 border-2 border-amber-500 shadow-sm transition-transform active:scale-95 cursor-pointer"
              title="Lihat Papan Stiker & Badge"
              aria-label="Buka Papan Stiker dan Badge"
            >
              <Award size={18} className="text-amber-900 fill-amber-200" />
              <span>Stiker ({earnedBadgesCount}/5)</span>
            </button>

            {/* Guide/Help button */}
            <button
              onClick={() => {
                sounds.playPop();
                onOpenHelp();
              }}
              className="p-2 rounded-2xl bg-white/90 border-2 border-amber-300 text-amber-900 hover:bg-amber-100 shadow-sm transition-transform cursor-pointer"
              title="Petunjuk Belajar & Profil"
              aria-label="Petunjuk Belajar dan Profil Saung Pintar"
            >
              <HelpCircle size={20} />
            </button>
          </div>
        </div>

        {/* Level Navigation Tabs (Extra Large Touch Targets) */}
        <nav aria-label="Navigasi Level Pecahan" className="mt-3 flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 no-scrollbar">
          <button
            onClick={() => {
              sounds.playPop();
              onSelectLevel(0);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all border-2 cursor-pointer ${
              currentLevel === 0
                ? 'bg-amber-500 text-white border-amber-600 shadow-md scale-102'
                : 'bg-white/80 hover:bg-white text-stone-800 border-amber-200'
            }`}
          >
            <Home size={16} />
            <span>Peta Misi</span>
          </button>

          {levels.map((lvl) => {
            const isActive = currentLevel === lvl.num;
            const isLocked = lvl.num >= 2 && lvl.num <= 5 && !completedLevels.includes(lvl.num - 1);
            return (
              <button
                key={lvl.num}
                onClick={() => {
                  sounds.playPop();
                  onSelectLevel(lvl.num);
                }}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all border-2 cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-white border-amber-600 shadow-md scale-105'
                    : isLocked
                    ? 'bg-stone-100 hover:bg-stone-200 text-stone-500 border-stone-200'
                    : 'bg-white/80 hover:bg-white text-stone-700 border-amber-200'
                }`}
                title={isLocked ? `Level ${lvl.num} terkunci (butuh 5/5 di Level ${lvl.num - 1})` : lvl.title}
              >
                <span>{lvl.emoji}</span>
                <span>{lvl.title}</span>
                {isLocked && <span className="text-[11px] opacity-75">🔒</span>}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
