import { useEffect } from 'react';

interface IntroScreenProps {
  onComplete: () => void;
}

export function IntroScreen({ onComplete }: IntroScreenProps) {
  useEffect(() => {
    // Автоматически переходим к регистрации через небольшую задержку
    const timer = setTimeout(() => {
      onComplete();
    }, 2000); // 2 секунды показа интро экрана

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[10000] bg-gradient-to-br from-blue-600 via-blue-800 to-indigo-900 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-4xl lg:text-6xl font-bold mb-4">Safeddara</h1>
        <p className="text-lg lg:text-xl opacity-90">Горнолыжный курорт</p>
      </div>
    </div>
  );
}
