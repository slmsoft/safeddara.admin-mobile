import { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, Cable } from 'lucide-react';
import { ModernHeader } from './ModernHeader';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface AboutPageProps {
  onWeatherClick?: () => void;
  onLiveClick?: () => void;
  onBack?: () => void;
  onRulesClick?: () => void;
}

export function AboutPage({ onWeatherClick, onLiveClick, onBack, onRulesClick }: AboutPageProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const galleryImages = [
    'https://images.unsplash.com/photo-1645648382171-508fd06b9a8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400',
    'https://images.unsplash.com/photo-1666817059354-7074c0907fe5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400',
    'https://images.unsplash.com/photo-1610479201125-a5c7f17370a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400',
    'https://images.unsplash.com/photo-1645677364244-e4f802c72f42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400',
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <div className="min-h-screen bg-white">
      <ModernHeader onWeatherClick={onWeatherClick} onLiveClick={onLiveClick} />
      
      {/* Desktop container */}
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        {/* Back Button - Mobile */}
        <div className="lg:hidden pt-4 pb-3">
          <button
            onClick={() => onBack && onBack()}
            className="transition-all active:scale-95"
            type="button"
          >
            <ChevronLeft className="w-6 h-6 text-[#71bcf0]" />
          </button>
        </div>

        {/* Hero Section */}
        <div className="py-6 lg:py-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  Сафеддара
                </h1>
              </div>

              <p className="text-base lg:text-lg text-gray-600 leading-relaxed">
                Всесезонный горный курорт на живописном плато Гиссарского хребта, всего в 53 км от Душанбе.
              </p>

              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-3 lg:gap-4">
                <div className="bg-white border border-gray-200 rounded-2xl p-4 text-center hover:shadow-md transition-shadow">
                  {/* Users Icon */}
                  <div className="w-12 h-12 mx-auto mb-3 bg-blue-50 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  </div>
                  <div className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">70-80К</div>
                  <div className="text-xs text-gray-500">туристов/год</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-4 text-center hover:shadow-md transition-shadow">
                  {/* Trail Icon */}
                  <div className="w-12 h-12 mx-auto mb-3 bg-blue-50 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14.12 4L12 2 9.88 4 8 6.5 12 11l4-4.5L14.12 4zM8.5 16l-1.12 1.5L5 20l3 2 1.88-2.5L11 17l-2.5-1zM16.5 16L14 17l1.12 2.5L17 22l3-2-2.38-2.5L16.5 16z"/>
                    </svg>
                  </div>
                  <div className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">18 км</div>
                  <div className="text-xs text-gray-500">трасс</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-4 text-center hover:shadow-md transition-shadow">
                  {/* Cable Car Icon */}
                  <div className="w-12 h-12 mx-auto mb-3 bg-blue-50 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10 3h4"/>
                      <rect x="6" y="8" width="12" height="10" rx="2"/>
                      <path d="M6 11h12"/>
                      <circle cx="9" cy="15" r="1"/>
                      <circle cx="15" cy="15" r="1"/>
                      <path d="M12 8V3"/>
                      <path d="M3 3h18"/>
                    </svg>
                  </div>
                  <div className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">3</div>
                  <div className="text-xs text-gray-500">подъемника</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-400 to-blue-500 hover:shadow-lg rounded-xl text-white font-semibold transition-all">
                  Как добраться
                </button>
                <button 
                  onClick={() => onRulesClick && onRulesClick()}
                  className="flex-1 px-6 py-3 bg-white hover:bg-gray-50 border border-gray-300 rounded-xl text-gray-700 font-semibold transition-all"
                  type="button"
                >
                  Правила курорта
                </button>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative aspect-[4/3] lg:aspect-[16/11] rounded-3xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1610479201125-a5c7f17370a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400"
                alt="Сафеддара - горнолыжный курорт"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="py-12 border-t border-gray-200">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 lg:p-10">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">О Сафеддара</h3>
            
            <p className="text-base lg:text-lg text-gray-700 leading-relaxed">
              Зимний отдых. На курорте 18 км трасс: трасса для начинающих (зеленая) протяженностью 1 км, трасса низкого уровня сложности (синяя) - 3,2 км, трасса среднего уровня сложности (красная) - 7,2 км. Синяя и зеленая трассы освещены для вечернего катания. В 2023 г в декабре запустили новую канатную дорогу, которая поднимает туристов на высоту 3020. Это позволяет открыть новые трассы повышенной сложности, крутизна с резкими перепадами высот. И сейчас общая протяженность трасс на курорте составляет 18 км. В настоящее время работает 3 подъемника: гондольная канатная дорога, которая поднимает на высоту с 2200м на высоту 2590 метров, вторая гондольная канатная дорога поднимает с высоты 2590 м на высоту 3020 м над уровнем моря, бугельная канатная дорога протяженностью 1 км. Горнолыжные трассы спускаются со склона на плато, где расположена вся инфраструктура курорта.
            </p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 py-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center">
            <Clock className="w-10 h-10 text-blue-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-900 mb-1">Работаем круглый год</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center">
            <Cable className="w-10 h-10 text-blue-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-900 mb-1">В работе 10 подъемников</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-3">25 км</div>
            <p className="text-sm font-semibold text-gray-900">протяженность трасс</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-3">40 мин.</div>
            <p className="text-sm font-semibold text-gray-900">от аэропорта</p>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="py-12">
          <div className="relative aspect-[16/9] lg:aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl">
            <ImageWithFallback
              src={galleryImages[currentImageIndex]}
              alt={`Галерея изображение ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
            
            {/* Navigation Arrows */}
            <button
              onClick={prevImage}
              className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center shadow-lg transition-all"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center shadow-lg transition-all"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {galleryImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex ? 'bg-white w-8' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* History Section */}
        <div className="py-8 pb-16">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 lg:p-10">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">История</h3>
            
            <p className="text-base lg:text-lg text-gray-700 leading-relaxed">
              Горнолыжная спортивная база «Сафед-Дара» начала свою работу в 1976 года. В то время уже 
              функционировали десять комфортабельных коттеджей, столовая, клуб располагались в начале 
              первого подъемника, далее пешком. Каждый год на базу Сафед-Дара приезжали члены национальных 
              команд по горным лыжам, альпинизму. В конце 1980-х годов было запущено несколько подъемников, 
              на которых осуществлялись подъем и спуск лыжников. С тех пор высокогорный спортивный комплекс 
              стал любимым местом отдыха не только профессиональных спортсменов, но и любителей.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}