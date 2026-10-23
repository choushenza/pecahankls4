import React from 'react';
import { BADGE_LIST } from '../utils/fractionLogic';
import { sounds } from '../utils/soundEffects';
import { X, Award, CheckCircle2, Lock, Sparkles, Printer } from 'lucide-react';

interface BadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  completedLevels: number[];
  onSelectLevel: (lvl: number) => void;
}

export const BadgeModal: React.FC<BadgeModalProps> = ({
  isOpen,
  onClose,
  completedLevels,
  onSelectLevel,
}) => {
  if (!isOpen) return null;

  const totalEarned = completedLevels.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border-4 border-amber-400 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative p-6">
        {/* Close Button */}
        <button
          onClick={() => {
            sounds.playPop();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
          aria-label="Tutup Papan Penghargaan"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-950 font-black text-xs uppercase tracking-wider">
            <Award size={16} className="text-amber-600" />
            <span>Papan Penghargaan Siswa</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-amber-950">
            Koleksi Stiker & Lencana Digital 🏅
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-bold">
            Saung Pintar Dukuhwaru • Pencapaian Kamu: {totalEarned} dari 5 Lencana
          </p>
        </div>

        {/* Badges List */}
        <div className="space-y-3">
          {BADGE_LIST.map((badge) => {
            const isUnlocked = completedLevels.includes(badge.level);
            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border-3 transition-all flex items-center gap-4 ${
                  isUnlocked
                    ? 'bg-amber-50/70 border-amber-300 shadow-xs'
                    : 'bg-stone-50 border-stone-200 opacity-60'
                }`}
              >
                {/* Badge Icon */}
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-3xl shadow-md border-2 ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-amber-300 to-amber-500 border-amber-600 text-amber-950 animate-pulse'
                      : 'bg-stone-200 border-stone-300 text-stone-400'
                  }`}
                >
                  {isUnlocked ? badge.icon : <Lock size={24} className="text-stone-400" />}
                </div>

                {/* Badge Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase text-amber-800">
                      Level {badge.level}
                    </span>
                    {isUnlocked && (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5">
                        <CheckCircle2 size={12} /> Terbuka
                      </span>
                    )}
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-stone-900 leading-snug">
                    {badge.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 font-bold">
                    {badge.subtitle}
                  </p>
                </div>

                {/* Action button */}
                <div>
                  <button
                    onClick={() => {
                      sounds.playPop();
                      onSelectLevel(badge.level);
                      onClose();
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      isUnlocked
                        ? 'bg-amber-400 hover:bg-amber-500 text-amber-950'
                        : 'bg-stone-200 hover:bg-stone-300 text-stone-700'
                    }`}
                  >
                    {isUnlocked ? 'Ulas Materi' : 'Mulai Level'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Certificate section if 5 badges completed */}
        {totalEarned === 5 && (
          <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-amber-100 via-yellow-100 to-emerald-100 border-2 border-amber-300 text-center space-y-2">
            <span className="text-2xl">🎓</span>
            <h4 className="font-black text-amber-950 text-base">
              Selamat! Kamu Telah Menjadi Ahli Pecahan Saung Pintar Dukuhwaru!
            </h4>
            <p className="text-xs text-stone-700 font-bold">
              Semua materi pecahan mulai dari martabak, pizza, cokelat, hingga desimal dan persen telah kamu selesaikan dengan sangat baik!
            </p>
            <button
              onClick={() => {
                sounds.playPop();
                window.print();
              }}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow cursor-pointer"
            >
              <Printer size={14} />
              <span>Cetak Piagam Prestasi</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
