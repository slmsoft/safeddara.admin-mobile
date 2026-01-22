import { Calendar, MapPin } from 'lucide-react';

const highlightEvents = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1483366774565-c783b9f70e2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    title: 'Премьер-министр РК провёл рабочую встречу в Сафеддара',
    date: '15.01.2026',
    location: 'Сафеддара',
    description: 'Обсуждение развития туристической инфраструктуры и перспектив горнолыжного курорта'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    title: 'Открытие детского горнолыжного сезона — первые шаги на склонах!',
    date: '20.01.2026',
    location: 'Детский склон',
    description: 'Специальная программа для юных лыжников с профессиональными инструкторами'
  }
];

interface EventsHighlightSectionProps {
  onEventClick?: (eventId: number) => void;
}

export function EventsHighlightSection({ onEventClick }: EventsHighlightSectionProps) {
  return (
    <section className="mt-8 px-1 sm:px-2 lg:px-0">
      {/* Section header */}
      <div className="mb-5">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Датум</h2>
      </div>

      {/* Events grid - 1 col on mobile, 2 cols on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {highlightEvents.map((event) => (
          <article
            key={event.id}
            onClick={() => onEventClick?.(event.id)}
            className="group bg-white rounded-2xl lg:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1 cursor-pointer"
          >
            {/* Image */}
            <div className="relative h-56 lg:h-72 overflow-hidden bg-gray-100">
              <img
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                src={event.image}
              />
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              {/* Date badge */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 flex items-center gap-2 shadow-lg">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-semibold text-gray-900">{event.date}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 lg:p-6">
              <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-3 line-clamp-2 leading-snug">
                {event.title}
              </h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {event.description}
              </p>
              <div className="flex items-center gap-2 text-gray-500">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{event.location}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
