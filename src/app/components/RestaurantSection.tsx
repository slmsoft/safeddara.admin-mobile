import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { backendApi } from '../../api/backendApi';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1669018560322-5f98298fd21d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';

interface RestaurantSectionProps {
  onViewMenu?: () => void;
  onCardClick?: (category: string) => void;
}

export function RestaurantSection({ onViewMenu, onCardClick }: RestaurantSectionProps) {
  const [restaurants, setRestaurants] = useState<Array<{ id: string; image: string; title: string; price: number; category: string }>>([]);

  useEffect(() => {
    backendApi.getRestaurantCategories()
      .then((res) => {
        if (res.success && res.data?.categories) {
          const items = res.data.categories.flatMap((c) =>
            c.items.map((i) => ({
              id: i.id,
              image: i.image || DEFAULT_IMAGE,
              title: i.name,
              price: i.price,
              category: c.title,
            }))
          );
          setRestaurants(items.slice(0, 4));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="mt-16 px-1 sm:px-2 lg:px-0">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Рестораны</h2>
        {onViewMenu && (
          <button 
            onClick={onViewMenu}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#71bcf0] transition-colors group"
          >
            <span className="font-medium">Смотреть все</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>

      {/* Restaurants grid - 2 cols on mobile, 4 cols on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className="group bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={() => onCardClick && onCardClick(restaurant.category)}
          >
            {/* Image */}
            <div className="relative h-36 lg:h-64 overflow-hidden bg-gray-100">
              <img
                alt={restaurant.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                src={restaurant.image}
              />
            </div>

            {/* Content */}
            <div className="p-4 lg:p-5">
              <p className="text-sm lg:text-base text-gray-800 leading-relaxed line-clamp-2 mb-3 font-medium">
                {restaurant.title}
              </p>
              
              {/* Price */}
              <div className="flex items-center justify-between">
                <span className="text-lg lg:text-xl font-bold text-gray-900">{restaurant.price} смн</span>
                <span className="text-xs lg:text-sm text-gray-500">{restaurant.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}