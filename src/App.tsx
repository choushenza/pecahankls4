/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LevelMap } from './components/LevelMap';
import { Level1Martabak } from './components/Level1Martabak';
import { Level2Pizza } from './components/Level2Pizza';
import { Level3Chocolate } from './components/Level3Chocolate';
import { Level4Decimal } from './components/Level4Decimal';
import { Level5Percent } from './components/Level5Percent';
import { QuizView } from './components/QuizView';
import { BadgeModal } from './components/BadgeModal';
import { HelpModal } from './components/HelpModal';
import { ConfettiStars } from './components/ConfettiStars';
import { sounds } from './utils/soundEffects';

export default function App() {
  const [currentLevel, setCurrentLevel] = useState<number>(0);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  // Modals
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState<boolean>(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);

  // Load persistence
  useEffect(() => {
    try {
      const savedLevels = localStorage.getItem('saung_pintar_completed_levels');
      if (savedLevels) {
        setCompletedLevels(JSON.parse(savedLevels));
      }
      const savedMute = localStorage.getItem('saung_pintar_muted');
      if (savedMute) {
        const val = JSON.parse(savedMute);
        setIsMuted(val);
        sounds.setMuted(val);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const handleToggleMute = () => {
    const nextVal = !isMuted;
    setIsMuted(nextVal);
    sounds.setMuted(nextVal);
    try {
      localStorage.setItem('saung_pintar_muted', JSON.stringify(nextVal));
    } catch {
      // Ignore
    }
  };

  const markLevelComplete = (levelNum: number) => {
    if (!completedLevels.includes(levelNum)) {
      const updated = [...completedLevels, levelNum];
      setCompletedLevels(updated);
      try {
        localStorage.setItem('saung_pintar_completed_levels', JSON.stringify(updated));
      } catch {
        // Ignore
      }
    }
    setShowConfetti(true);
    sounds.playFanfare();
  };

  const [lockedNotification, setLockedNotification] = useState<string | null>(null);

  const handleSelectLevel = (lvl: number) => {
    // Check if level is locked (levels 2-5 require previous level to be completed with 5/5)
    if (lvl >= 2 && lvl <= 5 && !completedLevels.includes(lvl - 1)) {
      sounds.playEncouragement();
      setLockedNotification(
        `🔒 Level ${lvl} Masih Terkunci! Kamu harus menjawab benar SEMUA 5 SOAL TANTANGAN (5/5) di Level ${lvl - 1} terlebih dahulu ya!`
      );
      setTimeout(() => {
        setLockedNotification(null);
      }, 5000);
      return;
    }

    setLockedNotification(null);
    setCurrentLevel(lvl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-amber-50/40 text-stone-900 font-sans flex flex-col selection:bg-amber-200">
      {/* Visual Celebration Confetti */}
      <ConfettiStars active={showConfetti} onFinish={() => setShowConfetti(false)} />

      {/* Main Top Header */}
      <Header
        currentLevel={currentLevel}
        onSelectLevel={handleSelectLevel}
        completedLevels={completedLevels}
        earnedBadgesCount={completedLevels.length}
        onOpenBadges={() => setIsBadgeModalOpen(true)}
        onOpenHelp={() => setIsHelpModalOpen(true)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Locked Level Toast Notification */}
      {lockedNotification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-lg w-[92%] bg-amber-900 text-white font-black text-xs sm:text-sm p-4 rounded-2xl shadow-2xl border-2 border-amber-400 flex items-center justify-between gap-3 animate-bounce">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔒</span>
            <span>{lockedNotification}</span>
          </div>
          <button
            onClick={() => setLockedNotification(null)}
            className="text-white hover:text-amber-200 font-black text-base px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Content Canvas */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 md:p-8">
        {currentLevel === 0 && (
          <LevelMap
            onSelectLevel={handleSelectLevel}
            completedLevels={completedLevels}
          />
        )}

        {currentLevel === 1 && (
          <Level1Martabak
            onCompleteLevel={() => markLevelComplete(1)}
            isCompleted={completedLevels.includes(1)}
            onNextLevel={() => handleSelectLevel(2)}
          />
        )}

        {currentLevel === 2 && (
          <Level2Pizza
            onCompleteLevel={() => markLevelComplete(2)}
            isCompleted={completedLevels.includes(2)}
            onNextLevel={() => handleSelectLevel(3)}
          />
        )}

        {currentLevel === 3 && (
          <Level3Chocolate
            onCompleteLevel={() => markLevelComplete(3)}
            isCompleted={completedLevels.includes(3)}
            onNextLevel={() => handleSelectLevel(4)}
          />
        )}

        {currentLevel === 4 && (
          <Level4Decimal
            onCompleteLevel={() => markLevelComplete(4)}
            isCompleted={completedLevels.includes(4)}
            onNextLevel={() => handleSelectLevel(5)}
          />
        )}

        {currentLevel === 5 && (
          <Level5Percent
            onCompleteLevel={() => markLevelComplete(5)}
            isCompleted={completedLevels.includes(5)}
            onOpenBadges={() => setIsBadgeModalOpen(true)}
          />
        )}

        {currentLevel === 6 && (
          <QuizView
            onBackToHome={() => handleSelectLevel(0)}
            onConfetti={() => setShowConfetti(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-amber-100/70 border-t-2 border-amber-300 py-6 px-4 text-center text-xs font-bold text-stone-600">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="flex items-center gap-1.5 justify-center">
            <span>🏡</span>
            <strong>Saung Pintar Dukuhwaru</strong> • Media Pembelajaran Matematika Inklusif Anak Kelas 4 SD
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sounds.playPop();
                setIsHelpModalOpen(true);
              }}
              className="text-amber-900 hover:underline cursor-pointer"
            >
              Pedagogi & Profil
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <BadgeModal
        isOpen={isBadgeModalOpen}
        onClose={() => setIsBadgeModalOpen(false)}
        completedLevels={completedLevels}
        onSelectLevel={handleSelectLevel}
      />

      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />
    </div>
  );
}
