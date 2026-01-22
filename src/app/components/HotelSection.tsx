import { ChevronRight } from 'lucide-react';
import cottageImage from '../../assets/67efe2a08cddf9fa1b091ced4088929ef5af6c58.png';

type TabType = 'safedara' | 'cottages';

const hotels = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJvb218ZW58MXx8fHwxNzY3NjYwNzI3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Проснись с видом на горы — забронируй уютный номер в Сафеддара!',
    price: '950',
    tab: 'safedara' as TabType,
  },
  {
    id: 2,
    image: cottageImage,
    title: 'Идеальный отдых начинается с тёплого приёма — гостиница Сафеддара ждёт тебя!',
    price: '3100',
    tab: 'cottages' as TabType,
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMGJlZHJvb218ZW58MXx8fHwxNzY3NjYwNzI3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Отдохни в наших комфортабельных номерах с современным дизайном',
    price: '1200',
    tab: 'safedara' as TabType,
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    title: 'Комфортные номера с панорамным видом на горы',
    price: '1500',
    tab: 'safedara' as TabType,
  },
];

interface HotelSectionProps {
  onViewAll?: () => void;
  onCardClick?: (tab: TabType) => void;
}

export function HotelSection({ onViewAll, onCardClick }: HotelSectionProps) {
  return (
    <section className="mt-16 px-1 sm:px-2 lg:px-0">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Отели</h2>
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

      {/* Hotels grid - 2 cols on mobile, 4 cols on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {hotels.map((hotel) => (
          <div
            key={hotel.id}
            className="group bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={() => onCardClick && onCardClick(hotel.tab)}
          >
            {/* Image */}
            <div className="relative h-36 lg:h-64 overflow-hidden bg-gray-100">
              <img
                alt={hotel.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                src={hotel.image}
              />
            </div>

            {/* Content */}
            <div className="p-4 lg:p-5">
              <p className="text-sm lg:text-base text-gray-800 leading-relaxed line-clamp-2 mb-3 font-medium">
                {hotel.title}
              </p>
              
              {/* Price */}
              <div className="flex items-center justify-between">
                <span className="text-lg lg:text-xl font-bold text-gray-900">{hotel.price} смн</span>
                <span className="text-xs lg:text-sm text-gray-500">за ночь</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}