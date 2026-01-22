import imgImage3 from "../../assets/ebae83f33e4d2f058e97a8ff6bbe791f72edd7e0.png";
import imgImage4 from "../../assets/fcfce042201db85d1fd639b173bba9d37b60e35c.png";
import Logo from "../../imports/Logo2-26-305";
import { Phone } from 'lucide-react';

interface ModernHeaderProps {
  onWeatherClick?: () => void;
  onLiveClick?: () => void;
}

export function ModernHeader({ 
  onWeatherClick, 
  onLiveClick
}: ModernHeaderProps = {}) {
  return (
    <div className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl lg:hidden overflow-x-hidden">
      <div className="w-full max-w-[402px] mx-auto px-4 py-3">
        {/* Single row - Weather, Logo, Live */}
        <div className="flex items-center justify-between">
          {/* Weather badge */}
          <button 
            onClick={() => onWeatherClick && onWeatherClick()}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-sky-50 px-3 py-1.5 rounded-full border border-blue-100 shadow-sm hover:shadow-md transition-all active:scale-95"
            type="button"
          >
            <div className="w-5 h-5">
              <img alt="weather" className="w-full h-full object-cover" src={imgImage3} />
            </div>
            <span className="text-sm font-medium text-gray-700">25°C</span>
          </button>

          {/* Logo centered */}
          <div className="h-12 w-auto flex-shrink-0">
            <Logo />
          </div>

          {/* Live indicator */}
          <button 
            onClick={() => onLiveClick && onLiveClick()}
            className="flex items-center gap-2 bg-gradient-to-r from-red-50 to-pink-50 px-3 py-1.5 rounded-full border border-red-100 shadow-sm hover:shadow-md transition-all active:scale-95"
            type="button"
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <div className="flex-none rotate-180 scale-y-[-100%]">
                <img alt="live" className="w-5 h-5 object-cover" src={imgImage4} />
              </div>
            </div>
            <span className="text-sm font-semibold text-red-500 animate-pulse">LIVE</span>
          </button>
        </div>
      </div>
    </div>
  );
}