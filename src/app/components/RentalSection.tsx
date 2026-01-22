import { ChevronRight } from 'lucide-react';

const rentals = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1761604227291-db2c1a000f34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2klMjBlcXVpcG1lbnQlMjByZW50YWx8ZW58MXx8fHwxNzY4MjA2MDQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Лыжи профессиональные — готовы покорять склоны с лучшим оборудованием!',
    price: '125',
    category: 'rental',
    tariffId: 'rental-1', // ID тарифа "Лыжи"
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1681680560040-cb748bd79db4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbm93Ym9hcmQlMjBlcXVpcG1lbnR8ZW58MXx8fHwxNzY4MjA2MDQ3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Сноуборд и полный комплект экипировки для незабываемого спуска!',
    price: '115',
    category: 'rental',
    tariffId: 'rental-2', // ID тарифа "Сноуборд"
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1727582921373-9d19faeac630?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2klMjBib290c3xlbnwxfHx8fDE3NjgyMDYwNDd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Горнолыжные ботинки премиум класса — комфорт и безопасность на склонах',
    price: '160',
    category: 'rental',
    tariffId: 'rental-3', // ID тарифа "Экипировка"
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1767487018490-b3e884fc8c3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW50ZXIlMjBzcG9ydHMlMjBnZWFyfGVufDF8fHx8MTc2ODIwNjA0N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Защитная экипировка и шлемы — катайся безопасно и стильно!',
    price: '250',
    category: 'rental',
    tariffId: 'rental-4', // ID тарифа "Экипировка + Лыжи"
  },
];

interface RentalSectionProps {
  onViewAll?: () => void;
  onCardClick?: (tariffId: string) => void;
}

export function RentalSection({ onViewAll, onCardClick }: RentalSectionProps) {
  return (
    <section className="mt-16 px-1 sm:px-2 lg:px-0">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Прокат</h2>
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

      {/* Rentals grid - 2 cols on mobile, 4 cols on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {rentals.map((rental) => (
          <div
            key={rental.id}
            className="group bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={() => onCardClick && onCardClick(rental.tariffId)}
          >
            {/* Image */}
            <div className="relative h-36 lg:h-64 overflow-hidden bg-gray-100">
              <img
                alt={rental.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                src={rental.image}
              />
            </div>

            {/* Content */}
            <div className="p-4 lg:p-5">
              <p className="text-sm lg:text-base text-gray-800 leading-relaxed line-clamp-2 mb-3 font-medium">
                {rental.title}
              </p>
              
              {/* Price */}
              <div className="flex items-center justify-between">
                <span className="text-lg lg:text-xl font-bold text-gray-900">{rental.price} смн</span>
                <span className="text-xs lg:text-sm text-gray-500">в день</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}