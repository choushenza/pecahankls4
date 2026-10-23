import React, { useEffect, useState } from 'react';

interface ConfettiStarsProps {
  active: boolean;
  onFinish?: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  type: 'star' | 'circle' | 'sparkle';
  speedY: number;
  speedX: number;
}

const COLORS = ['#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#FBBF24'];

export const ConfettiStars: React.FC<ConfettiStarsProps> = ({ active, onFinish }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }

    const items: Particle[] = [];
    for (let i = 0; i < 40; i++) {
      items.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * -20 - 5,
        size: Math.floor(Math.random() * 16) + 14,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * 360,
        type: i % 3 === 0 ? 'star' : i % 3 === 1 ? 'sparkle' : 'circle',
        speedY: Math.random() * 2 + 2,
        speedX: (Math.random() - 0.5) * 1.5,
      });
    }
    setParticles(items);

    const timer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 2800);

    return () => clearTimeout(timer);
  }, [active, onFinish]);

  if (!active || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-bounce"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            transform: `rotate(${p.rotation}deg)`,
            animation: `fallingRain 2.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
            animationDelay: `${(p.id % 8) * 0.08}s`,
          }}
        >
          {p.type === 'star' && (
            <svg
              width={p.size}
              height={p.size}
              viewBox="0 0 24 24"
              fill={p.color}
              stroke="#FFF"
              strokeWidth="1.5"
              className="drop-shadow-md"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          )}
          {p.type === 'sparkle' && (
            <svg
              width={p.size}
              height={p.size}
              viewBox="0 0 24 24"
              fill={p.color}
              className="drop-shadow-md"
            >
              <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
            </svg>
          )}
          {p.type === 'circle' && (
            <div
              className="rounded-full drop-shadow-sm border border-white"
              style={{
                width: `${p.size * 0.7}px`,
                height: `${p.size * 0.7}px`,
                backgroundColor: p.color,
              }}
            />
          )}
        </div>
      ))}
      <style>{`
        @keyframes fallingRain {
          0% {
            transform: translateY(0vh) rotate(0deg) scale(0.6);
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: translateY(105vh) rotate(360deg) scale(1.1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
