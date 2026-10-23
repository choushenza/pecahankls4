import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

interface MascotMessageProps {
  message: string;
  type?: 'happy' | 'thinking' | 'celebrate' | 'guide';
  hint?: string;
  levelTitle?: string;
}

export const MascotMessage: React.FC<MascotMessageProps> = ({
  message,
  type = 'happy',
  hint,
  levelTitle,
}) => {
  return (
    <aside aria-label="Pesan Pembimbing Saung Pintar" className="bg-amber-50/90 border-2 border-amber-300 rounded-3xl p-4 md:p-5 shadow-sm transition-all duration-300 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-yellow-200/50 rounded-full blur-xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
        {/* Mascot Avatar SVG (Si Kancil Pintar Sahabat Belajar) */}
        <div className="relative flex-shrink-0 group">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-b from-amber-200 to-amber-400 p-1 shadow-md border-2 border-white flex items-center justify-center">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full transform transition-transform duration-300 group-hover:scale-105"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Ears */}
              <ellipse cx="28" cy="22" rx="10" ry="18" fill="#B45309" transform="rotate(-15 28 22)" />
              <ellipse cx="28" cy="22" rx="6" ry="13" fill="#FDE68A" transform="rotate(-15 28 22)" />
              <ellipse cx="72" cy="22" rx="10" ry="18" fill="#B45309" transform="rotate(15 72 22)" />
              <ellipse cx="72" cy="22" rx="6" ry="13" fill="#FDE68A" transform="rotate(15 72 22)" />

              {/* Head */}
              <ellipse cx="50" cy="56" rx="34" ry="30" fill="#D97706" />

              {/* Cheeks & Face highlights */}
              <ellipse cx="36" cy="62" rx="12" ry="10" fill="#FDE68A" />
              <ellipse cx="64" cy="62" rx="12" ry="10" fill="#FDE68A" />
              <ellipse cx="50" cy="66" rx="16" ry="12" fill="#FEF3C7" />

              {/* Rosy blush */}
              <circle cx="28" cy="62" r="5" fill="#FCA5A5" opacity="0.8" />
              <circle cx="72" cy="62" r="5" fill="#FCA5A5" opacity="0.8" />

              {/* Eyes */}
              {type === 'celebrate' || type === 'happy' ? (
                // Happy curved eyes
                <>
                  <path d="M30 48 Q37 40 44 48" stroke="#1F2937" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                  <path d="M56 48 Q63 40 70 48" stroke="#1F2937" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                </>
              ) : (
                // Wide friendly open eyes
                <>
                  <circle cx="37" cy="46" r="6" fill="#1F2937" />
                  <circle cx="39" cy="44" r="2.2" fill="#FFF" />
                  <circle cx="63" cy="46" r="6" fill="#1F2937" />
                  <circle cx="65" cy="44" r="2.2" fill="#FFF" />
                </>
              )}

              {/* Cute nose */}
              <polygon points="50,60 46,55 54,55" fill="#78350F" />

              {/* Smiling mouth */}
              <path d="M44 64 Q50 71 56 64" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" fill="none" />

              {/* Headband / Pita Sahabat Pintar */}
              <path d="M22 36 Q50 31 78 36" stroke="#22C55E" strokeWidth="5" strokeLinecap="round" fill="none" />
              <circle cx="50" cy="34" r="4.5" fill="#EF4444" />
            </svg>
          </div>
          {type === 'celebrate' && (
            <span className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 rounded-full p-1 shadow animate-bounce">
              <Sparkles size={16} />
            </span>
          )}
        </div>

        {/* Speech Bubble */}
        <div className="flex-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wide uppercase mb-1">
            <Heart size={12} className="text-emerald-600 fill-emerald-600" />
            <span>Kancil Pintar Dukuhwaru</span>
            {levelTitle && <span className="text-emerald-600">• {levelTitle}</span>}
          </div>

          <p className="text-base sm:text-lg font-bold text-stone-800 leading-snug">
            {message}
          </p>

          {hint && (
            <div className="mt-2 text-sm text-amber-900 bg-amber-100/80 px-3 py-1.5 rounded-xl border border-amber-200/80 inline-block font-medium">
              💡 <strong>Tips Belajar:</strong> {hint}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
