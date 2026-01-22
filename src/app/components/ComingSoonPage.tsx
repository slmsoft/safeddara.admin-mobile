import { Sparkles } from 'lucide-react';
import { ModernHeader } from './ModernHeader';
import { SafeddaraLogo } from './registration/SafeddaraLogo';

interface ComingSoonPageProps {
  title: string;
  description: string;
  features?: string[];
  backgroundImage?: string;
  onBack?: () => void;
  onWeatherClick?: () => void;
  onLiveClick?: () => void;
}

export function ComingSoonPage({ 
  title, 
  description, 
  features = [], 
  backgroundImage,
  onBack, 
  onWeatherClick, 
  onLiveClick 
}: ComingSoonPageProps) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background - either image or gradient */}
      {backgroundImage ? (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#71bcf0] via-[#5aa8dd] to-[#4a9fd0]" />
      )}
      
      {/* Header */}
      <ModernHeader onWeatherClick={onWeatherClick} onLiveClick={onLiveClick} />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 pt-32 pb-20">
        {/* Logo with Animation - White Logo without background */}
        <div className="relative mb-8 animate-bounce" style={{ width: '90px', height: '90px' }}>
          <SafeddaraLogo />
        </div>
        
        <p className="text-xl text-white/90 mb-8 text-center max-w-md animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '0.2s' }}>
          {title}
        </p>

        {/* Decorative Line */}
        <div className="w-24 h-1 bg-white/50 rounded-full mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: '0.4s' }} />

        {/* Description */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-md border border-white/20 shadow-2xl animate-in fade-in zoom-in-95 duration-700" style={{ animationDelay: '0.6s' }}>
          <p className="text-white/95 text-center leading-relaxed mb-6">
            {description}
          </p>
          
          {/* Features List */}
          {features.length > 0 && (
            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 text-white/90">
                  <div className="w-2 h-2 bg-white rounded-full" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Progress Dots */}
        <div className="flex gap-2 mt-12 animate-in fade-in duration-700" style={{ animationDelay: '0.8s' }}>
          <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" />
          <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>

      {/* Back Button */}
      <div className="fixed bottom-6 left-0 right-0 px-6 z-20 animate-in fade-in slide-in-from-bottom duration-700" style={{ animationDelay: '1s' }}>
        <button
          onClick={onBack}
          className="w-full py-4 bg-white text-[#71bcf0] rounded-2xl font-semibold shadow-2xl hover:shadow-xl active:scale-98 transition-all duration-200"
        >
          Вернуться назад
        </button>
      </div>
    </div>
  );
}