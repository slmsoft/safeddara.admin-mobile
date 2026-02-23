import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { backendApi } from '../../api/backendApi';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800';

interface NewsSectionProps {
  onNewsClick?: () => void;
  onCardClick?: (newsId: string) => void;
}

export function NewsSection({ onNewsClick, onCardClick }: NewsSectionProps) {
  const [news, setNews] = useState<Array<{ id: string; image: string; title: string }>>([]);

  useEffect(() => {
    backendApi.getNews(4, 0)
      .then((res) => {
        if (res.success && res.data?.news) {
          setNews(res.data.news.slice(0, 4).map((n) => ({
            id: n.id,
            image: n.image || DEFAULT_IMAGE,
            title: n.title,
          })));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="mt-16 px-1 sm:px-2 lg:px-0">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Новости</h2>
        {onNewsClick && (
          <button 
            onClick={onNewsClick}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#71bcf0] transition-colors group"
          >
            <span className="font-medium">Смотреть все</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>

      {/* News grid - 2 cols on mobile, 4 cols on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {news.map((item) => (
          <article
            key={item.id}
            onClick={() => onCardClick?.(item.id)}
            className="group bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            {/* Image */}
            <div className="relative overflow-hidden bg-gray-100 h-36 lg:h-64">
              <img
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                src={item.image}
              />
            </div>

            {/* Content */}
            <div className="p-4 lg:p-5">
              <h3 className="text-sm lg:text-base font-semibold text-gray-900 line-clamp-2">
                {item.title}
              </h3>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}