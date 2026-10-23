import React, { useState } from 'react';
import { sounds } from '../utils/soundEffects';
import { X, Download, Copy, Check, ExternalLink, FileCode } from 'lucide-react';

interface StandaloneExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StandaloneExportModal: React.FC<StandaloneExportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    sounds.playPop();
    const link = document.createElement('a');
    link.href = '/saung_pintar_pecahan_standalone.html';
    link.download = 'Petualangan_Pecahan_Saung_Pintar.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyUrl = async () => {
    sounds.playPop();
    try {
      const fullUrl = window.location.origin + '/saung_pintar_pecahan_standalone.html';
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border-4 border-emerald-400 max-w-lg w-full shadow-2xl relative p-6 text-center">
        {/* Close Button */}
        <button
          onClick={() => {
            sounds.playPop();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
          aria-label="Tutup Jendela Unduh"
        >
          <X size={20} />
        </button>

        <div className="w-16 h-16 mx-auto bg-emerald-100 text-emerald-700 rounded-3xl flex items-center justify-center mb-3 border-2 border-emerald-300">
          <FileCode size={32} />
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-amber-950 mb-1">
          Unduh File HTML Tunggal Mandiri
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 font-bold mb-6">
          File tunggal (Single HTML File) yang menggabungkan HTML5, CSS3, dan JavaScript Vanilla tanpa perlu koneksi internet. Sangat cocok disimpan di flashdisk atau komputer Saung Pintar Dukuhwaru!
        </p>

        <div className="space-y-3">
          <button
            onClick={handleDownload}
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base rounded-2xl shadow-md border-2 border-emerald-700 flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
          >
            <Download size={20} />
            <span>Unduh File HTML (.html)</span>
          </button>

          <a
            href="/saung_pintar_pecahan_standalone.html"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-sm rounded-2xl border-2 border-amber-300 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <ExternalLink size={16} />
            <span>Buka Versi Standalone di Tab Baru</span>
          </a>

          <button
            onClick={handleCopyUrl}
            className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            <span>{copied ? 'Tautan Berhasil Disalin!' : 'Salin Tautan File Offline'}</span>
          </button>
        </div>

        <p className="text-[11px] text-stone-500 font-semibold mt-5">
          *File ini bisa langsung dibuka dengan klik ganda di Google Chrome, Mozilla Firefox, Microsoft Edge, atau browser HP tanpa instalasi apapun.
        </p>
      </div>
    </div>
  );
};
