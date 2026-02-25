import { useState } from 'react';
import { ChevronLeft, Navigation, MapPin } from 'lucide-react';
import { ModernHeader } from './ModernHeader';

interface AddressPageProps {
  onWeatherClick?: () => void;
  onLiveClick?: () => void;
  onBack?: () => void;
}

export function AddressPage({ onWeatherClick, onLiveClick, onBack }: AddressPageProps) {
  const [selectedAction, setSelectedAction] = useState<'route' | '2gis' | 'taxi' | 'bus'>('taxi');
  const [mapError, setMapError] = useState(false);
  
  // Координаты Сафеддара
  const latitude = 38.857972;
  const longitude = 68.998144;
  const address = "Гиссарский хребет, 53 км от Душанбе";
  const locationName = "Safedara Resort";

  // Функция построения маршрута
  const handleBuildRoute = () => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
    window.open(googleMapsUrl, '_blank');
  };

  // URLs для открытия в картографических сервисах
  const mapLinks = {
    google: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
    yandex: `https://yandex.ru/maps/?pt=${longitude},${latitude}&z=15&l=map`,
    twoGis: `https://2gis.tj/dushanbe?m=${longitude},${latitude}/15`
  };

  return (
    <div className="min-h-screen bg-white">
      <ModernHeader onWeatherClick={onWeatherClick} onLiveClick={onLiveClick} />
      
      {/* Container — как в Гостинице и Ресторане: max-w-[402px] на мобильном */}
      <div className="w-full max-w-[402px] lg:max-w-[1400px] mx-auto px-5 lg:px-8">
        {/* Header */}
        <div className="pt-4 pb-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onBack && onBack()}
              className="transition-all active:scale-95"
              type="button"
            >
              <ChevronLeft className="w-6 h-6 text-[#71bcf0]" />
            </button>
            
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Адрес</h1>
          </div>
        </div>

        {/* Content */}
        <div className="pb-6">
          <div className="space-y-4">
            {/* Address Header with Navigation — стиль как у карточек Гостиницы/Ресторана */}
            <div className="bg-[#71bcf0]/12 rounded-2xl p-4 border border-[#71bcf0]/20">
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="w-6 h-6 text-[#71bcf0] flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-gray-900">{address}</h2>
                </div>
              </div>
              
              {/* Action Buttons - Mobile — как вкладки Гостиницы: белые, при выборе синие. Порядок: Такси, Автобус, Маршрут, 2GIS */}
              <div className="lg:hidden flex gap-2 overflow-x-auto no-scrollbar mb-3 pb-1 -mx-1">
                <button
                  onClick={() => setSelectedAction('taxi')}
                  className={`
                    flex items-center justify-center gap-2 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0
                    transition-all duration-300
                    ${selectedAction === 'taxi' ? 'bg-[#71bcf0] text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200 hover:border-[#71bcf0]'}
                  `}
                  type="button"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
                  </svg>
                  Такси
                </button>
                
                <button
                  onClick={() => setSelectedAction('bus')}
                  className={`
                    flex items-center justify-center gap-2 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0
                    transition-all duration-300
                    ${selectedAction === 'bus' ? 'bg-[#71bcf0] text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200 hover:border-[#71bcf0]'}
                  `}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
                  </svg>
                  Автобус
                </button>
                
                <button
                  onClick={() => { setSelectedAction('route'); handleBuildRoute(); }}
                  className={`
                    flex items-center justify-center gap-2 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0
                    transition-all duration-300
                    ${selectedAction === 'route' ? 'bg-[#71bcf0] text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200 hover:border-[#71bcf0]'}
                  `}
                  type="button"
                >
                  <Navigation className="w-4 h-4" />
                  Маршрут
                </button>
                
                <button
                  onClick={() => { setSelectedAction('2gis'); window.open(mapLinks.twoGis, '_blank'); }}
                  className={`
                    flex items-center justify-center gap-2 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0
                    transition-all duration-300
                    ${selectedAction === '2gis' ? 'bg-[#71bcf0] text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200 hover:border-[#71bcf0]'}
                  `}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  2GIS
                </button>
              </div>

              {/* Long Toggle Switch for 4 Actions - Desktop only. Порядок: Такси, Автобус, Маршрут, 2GIS */}
              <div className="hidden lg:block relative w-full h-12 bg-gray-200 rounded-full p-1 mb-3">
                <div 
                  className={`absolute top-1 bottom-1 bg-[#71bcf0] rounded-full shadow-md transition-all duration-300 ease-in-out ${
                    selectedAction === 'taxi' ? 'left-1 w-[calc(25%-4px)]' :
                    selectedAction === 'bus' ? 'left-[calc(25%+1px)] w-[calc(25%-4px)]' :
                    selectedAction === 'route' ? 'left-[calc(50%+1px)] w-[calc(25%-4px)]' :
                    'left-[calc(75%+1px)] w-[calc(25%-4px)]'
                  }`}
                />
                <div className="relative flex h-full">
                  <button
                    onClick={() => setSelectedAction('taxi')}
                    className={`flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold transition-colors duration-300 ${
                      selectedAction === 'taxi' ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
                    </svg>
                    Такси
                  </button>
                  <button
                    onClick={() => setSelectedAction('bus')}
                    className={`flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold transition-colors duration-300 ${
                      selectedAction === 'bus' ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
                    </svg>
                    Автобус
                  </button>
                  <button
                    onClick={() => {
                      setSelectedAction('route');
                      handleBuildRoute();
                    }}
                    className={`flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold transition-colors duration-300 ${
                      selectedAction === 'route' ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    <Navigation className="w-4 h-4" />
                    Маршрут
                  </button>
                  <button
                    onClick={() => {
                      setSelectedAction('2gis');
                      window.open(mapLinks.twoGis, '_blank');
                    }}
                    className={`flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold transition-colors duration-300 ${
                      selectedAction === '2gis' ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    2GIS
                  </button>
                </div>
              </div>
              
              {/* Transport Info */}
              {selectedAction === 'taxi' && (
                <div className="mt-3 p-3 bg-white rounded-xl text-xs text-gray-700 leading-relaxed border border-[#71bcf0]/20">
                  <p className="mb-2">
                    <span className="font-semibold">Jura Taxi</span> → введите «Сафед-Дара» → подтвердите заказ
                  </p>
                  <p className="mb-2">
                    <span className="font-semibold">Время:</span> 60–70 км • 1–1,2 часа
                  </p>
                  <p>
                    <span className="font-semibold">Цена:</span> $11–14 (120–150 смн)
                  </p>
                </div>
              )}

              {selectedAction === 'bus' && (
                <div className="mt-3 p-3 bg-white rounded-xl text-xs text-gray-700 leading-relaxed border border-[#71bcf0]/20">
                  <p className="mb-2">
                    Автовокзал <span className="font-semibold">Asian Express</span> → билет на Сафед-Дара (через Хушери)
                  </p>
                  <p className="mb-2">
                    <span className="font-semibold">Время:</span> 60–70 км • 1,5–2 часа
                  </p>
                  <p className="mb-2">
                    <span className="font-semibold">Цена:</span> 20–30 смн
                  </p>
                  <p className="text-gray-500">
                    Перевозки: Asian Express
                  </p>
                </div>
              )}
            </div>

            {/* Map */}
            <div className="bg-[#71bcf0]/12 rounded-2xl overflow-hidden border border-[#71bcf0]/20">
              <div className="relative h-[280px] lg:h-[450px]">
                <iframe
                  src={`https://maps.google.com/maps?q=${latitude},${longitude}&hl=ru&z=14&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Safedara Location Map"
                  onError={() => setMapError(true)}
                />
                {mapError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <p className="text-sm text-gray-500">Не удалось загрузить карту</p>
                  </div>
                )}
              </div>

              {/* Map Service Buttons — стиль как у карточек */}
              <div className="p-4 border-t border-[#71bcf0]/20 bg-white">
                <div className="flex items-center gap-2">
                  <a
                    href={mapLinks.google}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-white rounded-xl border border-[#71bcf0]/20 hover:bg-[#71bcf0]/12 hover:border-[#71bcf0]/40 transition-all group"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path fill="#4285F4" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    <span className="text-xs font-semibold text-gray-700 group-hover:text-[#71bcf0]">Google</span>
                  </a>

                  <a
                    href={mapLinks.yandex}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-white rounded-xl border border-[#71bcf0]/20 hover:bg-[#71bcf0]/12 hover:border-[#71bcf0]/40 transition-all group"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-600 group-hover:text-[#71bcf0] transition-colors">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    <span className="text-xs font-semibold text-gray-700 group-hover:text-[#71bcf0]">Yandex</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}