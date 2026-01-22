import { useState } from 'react';
import { 
  Info,
  Clock,
  Newspaper,
  CircleHelp,
  Phone,
  Globe
} from 'lucide-react';
import { ModernHeader } from './ModernHeader';
import { usePageScroll } from '../hooks/usePageScroll';
import { HotelIcon } from './icons/HotelIcon';
import { RestaurantIcon } from './icons/RestaurantIcon';
import { EntertainmentIcon } from './icons/EntertainmentIcon';
import { EventsIcon } from './icons/EventsIcon';
import { SchoolIcon } from './icons/SchoolIcon';
import { KidsIcon } from './icons/KidsIcon';
import imgImage3 from "../../assets/ebae83f33e4d2f058e97a8ff6bbe791f72edd7e0.png";
import imgImage4 from "../../assets/fcfce042201db85d1fd639b173bba9d37b60e35c.png";

interface MenuPageProps {
  onWeatherClick?: () => void;
  onLiveClick?: () => void;
  onNewsClick?: () => void;
  onRulesClick?: () => void;
  onAboutClick?: () => void;
  onWorkingHoursClick?: () => void;
  onNavigate?: (page: string) => void;
  onHotelsClick?: () => void;
  onRestaurantClick?: () => void;
  onEventsClick?: () => void;
  onCamerasClick?: () => void;
}

export function MenuPage({ 
  onWeatherClick, 
  onLiveClick, 
  onNewsClick, 
  onRulesClick, 
  onAboutClick, 
  onWorkingHoursClick, 
  onNavigate,
  onHotelsClick,
  onRestaurantClick,
  onEventsClick,
  onCamerasClick
}: MenuPageProps = {}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { containerRef } = usePageScroll('menu-page');

  const mainServices = [
    { id: 'hotels', icon: HotelIcon, label: 'Гостиница' },
    { id: 'restaurants', icon: RestaurantIcon, label: 'Рестораны' },
    { id: 'events', icon: EventsIcon, label: 'Мероприятия' },
    { id: 'school', icon: SchoolIcon, label: 'Школа' },
    { id: 'kids', icon: KidsIcon, label: 'Детям' },
    { id: 'entertainment', icon: EntertainmentIcon, label: 'Развлечения' }
  ];

  const infoServices = [
    { id: 'about', icon: Info, label: 'О Сафедара' },
    { id: 'schedule', icon: Clock, label: 'Режим работы' },
    { id: 'news', icon: Newspaper, label: 'Новости' },
    { id: 'rules', icon: CircleHelp, label: 'Правила' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Same as Main Page */}
      <ModernHeader onWeatherClick={onWeatherClick} onLiveClick={onLiveClick} />

      {/* Main Content */}
      <div className="px-4 pb-24 pt-4" ref={containerRef}>
        {/* Main Services Grid - Blue Theme */}
        <div className="bg-white rounded-3xl p-5 mb-4 shadow-sm">
          <div className="grid grid-cols-3 gap-4">
            {mainServices.map((service, index) => {
              const Icon = service.icon;
              const isHovered = hoveredId === service.id;
              
              return (
                <button
                  key={service.id}
                  onMouseEnter={() => setHoveredId(service.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => {
                    if (service.id === 'hotels') {
                      onHotelsClick?.();
                    } else if (service.id === 'restaurants') {
                      onRestaurantClick?.();
                    } else if (service.id === 'events') {
                      onEventsClick?.();
                    } else {
                      onNavigate?.(service.id);
                    }
                  }}
                  className={`
                    flex flex-col items-center gap-3 transition-all duration-300
                    ${isHovered ? 'scale-105' : ''}
                  `}
                  style={{
                    animation: `fadeInUp 0.5s ease-out ${index * 0.05}s backwards`
                  }}
                >
                  <div className={`
                    w-16 h-16 rounded-2xl flex items-center justify-center
                    transition-all duration-300
                    ${isHovered 
                      ? 'bg-gradient-to-br from-[#71bcf0] to-[#8ea3fe] shadow-lg' 
                      : 'bg-gradient-to-br from-[#e3f2fd] to-[#bbdefb]'
                    }
                  `}>
                    <Icon 
                      className={`transition-colors duration-300 ${isHovered ? 'text-white' : 'text-[#71bcf0]'}`} 
                      size={28} 
                      strokeWidth={2}
                    />
                  </div>
                  <span className="text-xs text-gray-700 text-center font-medium leading-tight">
                    {service.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Info Services Grid - Yellow Theme */}
        <div className="bg-white rounded-3xl p-5 shadow-sm">
          <div className="grid grid-cols-3 gap-4">
            {infoServices.map((service, index) => {
              const Icon = service.icon;
              const isHovered = hoveredId === service.id;
              
              return (
                <button
                  key={service.id}
                  onMouseEnter={() => setHoveredId(service.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => {
                    if (service.id === 'news') {
                      onNewsClick?.();
                    } else if (service.id === 'rules') {
                      onRulesClick?.();
                    } else if (service.id === 'about') {
                      onAboutClick?.();
                    } else if (service.id === 'schedule') {
                      onWorkingHoursClick?.();
                    }
                  }}
                  className={`
                    flex flex-col items-center gap-3 transition-all duration-300
                    ${isHovered ? 'scale-105' : ''}
                  `}
                  style={{
                    animation: `fadeInUp 0.5s ease-out ${(index + 6) * 0.05}s backwards`
                  }}
                >
                  <div className={`
                    w-16 h-16 rounded-2xl flex items-center justify-center
                    transition-all duration-300
                    ${isHovered 
                      ? 'bg-gradient-to-br from-[#ffc107] to-[#ff9800] shadow-lg' 
                      : 'bg-gradient-to-br from-[#fff9e6] to-[#ffe9b3]'
                    }
                  `}>
                    <Icon 
                      className={`transition-colors duration-300 ${isHovered ? 'text-white' : 'text-[#ff9800]'}`} 
                      size={28} 
                      strokeWidth={2}
                    />
                  </div>
                  <span className="text-xs text-gray-700 text-center font-medium leading-tight">
                    {service.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}