import { useState, useEffect, useRef } from 'react';
import safeddaraVideo from '../../assets/safeddara.mp4';

interface IntroScreenProps {
  onComplete: () => void;
}

export function IntroScreen({ onComplete }: IntroScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch((error) => {
        console.error('Error playing video:', error);
      });
    }
  }, []);

  const handleVideoEnd = () => {
    // Переход к регистрации через небольшую задержку
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-black flex items-center justify-center">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnd}
      >
        <source src={safeddaraVideo} type="video/mp4" />
        Ваш браузер не поддерживает видео.
      </video>
    </div>
  );
}
