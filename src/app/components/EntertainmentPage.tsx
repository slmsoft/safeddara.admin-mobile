import { ChevronLeft } from 'lucide-react';
import { ModernHeader } from './ModernHeader';

interface EntertainmentPageProps {
  onBack: () => void;
  onWeatherClick?: () => void;
  onLiveClick?: () => void;
}

const entertainmentItems = [
  {
    id: 1,
    title: 'Катание на тюбингах',
    image: 'https://images.unsplash.com/photo-1641933002641-fa12b61845af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    id: 2,
    title: 'Каток',
    image: 'https://images.unsplash.com/photo-1767049147089-1ff2760d5a6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    id: 3,
    title: 'Снегоходы',
    image: 'https://images.unsplash.com/photo-1547494668-69e7cca0af05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    id: 4,
    title: 'Зип-лайн',
    image: 'https://images.unsplash.com/photo-1546403761-997019b3898a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    id: 5,
    title: 'Санные трассы',
    image: 'https://images.unsplash.com/photo-1602096335119-4af50e6fad95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    id: 6,
    title: 'Активный отдых',
    image: 'https://images.unsplash.com/photo-1765960996358-b2adecea8dde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    id: 7,
    title: 'Зимние мероприятия',
    image: 'https://images.unsplash.com/photo-1768054186550-4bdbb8f2640e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    id: 8,
    title: 'Горные лыжи',
    image: 'https://images.unsplash.com/photo-1579984078262-cdbb7ac6bd2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    id: 9,
    title: 'Семейные санки',
    image: 'https://images.unsplash.com/photo-1767798426108-215be29507cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    id: 10,
    title: 'Сноуборд',
    image: 'https://images.unsplash.com/photo-1612723453274-1939fb288856?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    id: 11,
    title: 'Ледолазание',
    image: 'https://images.unsplash.com/photo-1709517659952-263e00150b65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    id: 12,
    title: 'Парапланеризм',
    image: 'https://images.unsplash.com/photo-1616511384128-899bbf5ce275?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
];

export function EntertainmentPage({ onBack, onWeatherClick, onLiveClick }: EntertainmentPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Header */}
      <div className="lg:hidden">
        <ModernHeader
          onWeatherClick={onWeatherClick}
          onLiveClick={onLiveClick}
        />
      </div>

      {/* Desktop - Full Page Layout */}
      <div className="hidden lg:block min-h-screen">
        <div className="max-w-[1400px] mx-auto px-8 py-8">
          {/* Header with back button */}
          <div className="flex items-center mb-8">
            <button
              onClick={() => onBack && onBack()}
              className="transition-all active:scale-95"
              type="button"
            >
              <ChevronLeft className="w-7 h-7 text-gray-600" strokeWidth={2} />
            </button>
            <h1 className="text-4xl font-bold text-gray-900 ml-4">Развлечение</h1>
          </div>

          {/* Gallery Grid - 4 columns */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {entertainmentItems.map((item) => (
              <div
                key={item.id}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                {/* Overlay with title */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-semibold text-lg">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile - Scrollable Gallery */}
      <div className="lg:hidden">
        <div className="px-4 pb-24">
          {/* Mobile Header */}
          <div className="flex items-center mb-6">
            <button
              onClick={() => onBack && onBack()}
              className="transition-all active:scale-95"
              type="button"
            >
              <ChevronLeft className="w-6 h-6 text-gray-900" strokeWidth={2} />
            </button>
            <h1 className="text-base font-semibold text-gray-900 ml-2">Развлечение</h1>
          </div>

          {/* Cards Grid - 2 columns on mobile */}
          <div className="grid grid-cols-2 gap-4">
            {entertainmentItems.map((item) => (
              <div
                key={item.id}
                className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-md"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                {/* Title overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-white font-semibold text-sm">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}