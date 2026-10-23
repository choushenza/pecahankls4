import React from 'react';
import { sounds } from '../utils/soundEffects';
import { X, BookOpen, Heart, Sparkles, Check } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border-4 border-emerald-400 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative p-6">
        {/* Close Button */}
        <button
          onClick={() => {
            sounds.playPop();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
          aria-label="Tutup Panduan"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1 mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 font-black text-xs uppercase tracking-wider">
            <BookOpen size={16} className="text-emerald-700" />
            <span>Panduan Guru & Pendamping</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-amber-950">
            Saung Pintar Dukuhwaru 🏡
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-bold">
            Pendekatan Pembelajaran Matematika Khusus Siswa Struggling Learners (Kelas 4 SD)
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-4 text-left">
          {/* 3 Pillars */}
          <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 space-y-2">
            <h3 className="font-black text-amber-950 text-base flex items-center gap-2">
              <Heart size={18} className="text-rose-500 fill-rose-500" />
              <span>3 Pilar Pendekatan Khusus:</span>
            </h3>
            <ul className="text-xs sm:text-sm font-bold text-stone-700 space-y-2">
              <li className="flex items-start gap-2">
                <Check size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>1. Konkret & Visual:</strong> Siswa melihat dan memotong langsung makanan nyata lokal (Martabak Manis Dukuhwaru, Pizza, Cokelat) sebelum diperkenalkan dengan simbol rumus angka.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>2. Bebas Tekanan & Penuh Apresiasi:</strong> Tidak ada penghitung mundur waktu (timer) yang memicu kecemasan. Kesalahan dihadapi dengan panduan ramah tanpa cap merah yang menakutkan.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>3. Scaffolding Berjenjang:</strong> Bertahap dari pembilang satu (1/2, 1/4), penyebut sama, pecahan senilai, hingga angka desimal dan persen.
                </span>
              </li>
            </ul>
          </div>

          {/* Level Breakdown */}
          <div className="space-y-2">
            <h3 className="font-black text-stone-900 text-sm uppercase tracking-wider">
              Ikhtisar 5 Level Interaktif:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold text-stone-700">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <p className="text-amber-900 font-black">Level 1: Martabak</p>
                <p className="text-stone-600">Semakin banyak potongan (penyebut besar), ukuran 1 potongnya semakin kecil.</p>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <p className="text-red-900 font-black">Level 2: Pizza</p>
                <p className="text-stone-600">Jika penyebut sama, pembilang lebih besar dapat bagian lebih banyak.</p>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <p className="text-amber-950 font-black">Level 3: Cokelat Senilai</p>
                <p className="text-stone-600">Pecahan yang bentuk angkanya berbeda tapi panjangnya sama (1/2 = 2/4 = 4/8).</p>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <p className="text-cyan-900 font-black">Level 4: Kotak Desimal</p>
                <p className="text-stone-600">Grid 10 kotak (persepuluhan) dan 100 kotak (perseratusan) ke bentuk desimal.</p>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 sm:col-span-2">
                <p className="text-yellow-900 font-black">Level 5: Konsep Persen (%)</p>
                <p className="text-stone-600">Koleksi 100 bintang: menghubungkan perseratusan 25/100 = 0,25 = 25%.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-stone-200 text-center">
          <p className="text-xs font-extrabold text-stone-500">
            Didedikasikan untuk kemajuan belajar matematika anak-anak di Saung Pintar Dukuhwaru.
          </p>
        </div>
      </div>
    </div>
  );
};
