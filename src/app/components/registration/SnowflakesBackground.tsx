import { useEffect, useState } from 'react';

interface Snowflake {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  drift: number;
}

export function SnowflakesBackground() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    const flakes: Snowflake[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 4 + 1.5,
      duration: Math.random() * 5 + 5, // Быстрее: 5-10 секунд вместо 15-25
      delay: Math.random() * 3,
      opacity: Math.random() * 0.5 + 0.3, // Разная прозрачность 0.3-0.8
      drift: (Math.random() - 0.5) * 30, // Дрейф влево-вправо
    }));
    setSnowflakes(flakes);
  }, []);

  return (
    <>
      <style>{`
        @keyframes snowfall {
          0% {
            transform: translateY(-10px) translateX(0px) rotate(0deg);
          }
          50% {
            transform: translateY(50vh) translateX(var(--drift)) rotate(180deg);
          }
          100% {
            transform: translateY(100vh) translateX(0px) rotate(360deg);
          }
        }
        .animate-snowfall {
          animation: snowfall linear infinite;
        }
      `}</style>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {snowflakes.map((flake) => (
          <div
            key={flake.id}
            className="absolute rounded-full bg-white animate-snowfall"
            style={{
              left: `${flake.left}%`,
              width: `${flake.size}px`,
              height: `${flake.size}px`,
              animationDuration: `${flake.duration}s`,
              animationDelay: `${flake.delay}s`,
              opacity: flake.opacity,
              '--drift': `${flake.drift}px`,
            } as React.CSSProperties}
          />
        ))}
      </div>
    </>
  );
}