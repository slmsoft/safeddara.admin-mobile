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

      {/* Сетка карточек — как в разделе Прокат */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer active:scale-[0.99]"
            onClick={() => onCardClick && onCardClick(service.categoryKey)}
          >
            {/* Изображение сверху */}
            <div className="relative h-36 lg:h-48 overflow-hidden bg-gray-100">
              <img
                alt={service.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                src={service.image}
              />
            </div>

            {/* Контент */}
            <div className="p-4 lg:p-5">
              <p className="text-xs text-gray-500 mb-0.5">{service.category}</p>
              <p className="text-sm lg:text-base text-gray-800 leading-relaxed line-clamp-2 mb-3 font-medium">
                {service.title}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-lg lg:text-xl font-bold text-gray-900">{service.price} смн</span>
                <span className="text-xs lg:text-sm text-gray-500">{service.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}