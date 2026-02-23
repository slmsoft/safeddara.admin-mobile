import { ChevronRight } from 'lucide-react';
import cableCarImage from '../../assets/d20644f0d94a0312b2560de3d37874eea4a562c1.png';
import iceRinkImage from '../../assets/7d927dbf5a3274aa82a65d8d9c4db5a97785f987.png';

const services = [
  {
    id: 1,
    image: iceRinkImage,
    title: 'Каток 1 час',
    price: '55',
    category: 'Канатные дороги и каток',
    categoryKey: 'season-pass',
    time: '8:30–17:00',
  },
  {
    id: 2,
    image: cableCarImage,
    title: 'Канатная дорога I',
    price: '55',
    category: 'Канатные дороги и каток',
    categoryKey: 'season-pass',
    time: '8:30–17:00',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2klMjBsaWZ0fGVufDF8fHx8MTc2NzY2MDcyN3ww&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Канатная дорога II',
    price: '75',
    category: 'Канатные дороги и каток',
    categoryKey: 'season-pass',
    time: '8:30–17:00',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    title: 'Прокат лыж',
    price: '120',
    category: 'Прокат инвентаря',
    categoryKey: 'rental',
    time: '8:30–17:00',
  },
];

interface ServicesSectionProps {
  onViewAll?: () => void;
  onCardClick?: (category: string) => void;
}

export function ServicesSection({ onViewAll, onCardClick }: ServicesSectionProps) {
  return (
    <section className="mt-16 px-1 sm:px-2 lg:px-0">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Услуги</h2>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#71bcf0] transition-colors group"
          >
            <span className="font-medium">Смотреть все</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>

      {/* Services grid - 1 col on mobile, 2 cols on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="group flex rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer active:scale-[0.99]"
            onClick={() => onCardClick && onCardClick(service.categoryKey)}
          >
            {/* Image - левая часть ~40% */}
            <div className="relative w-[40%] min-w-[120px] aspect-[4/5] flex-shrink-0 overflow-hidden bg-gray-100">
              <img
                alt={service.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                src={service.image}
              />
            </div>

            {/* Content - правая часть ~60% */}
            <div className="flex-1 min-w-0 p-4 lg:p-5 flex flex-col justify-between text-left">
              <div>
                <p className="text-xs text-gray-500 mb-1">{service.category}</p>
                <h3 className="text-base lg:text-lg font-bold text-gray-900">{service.title}</h3>
              </div>
              
              {/* Bottom row: Время | Цена */}
              <div className="flex justify-between items-end mt-3 pt-3 border-t border-gray-100 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Время</p>
                  <p className="text-sm font-bold text-gray-900">{service.time}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Цена</p>
                  <p className="text-base font-bold text-[#5ba8e0]">{service.price} смн</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}