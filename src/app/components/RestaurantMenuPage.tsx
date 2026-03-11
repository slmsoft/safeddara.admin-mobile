import { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Heart } from 'lucide-react';
import { ModernHeader } from './ModernHeader';
import { backendApi } from '../../api/backendApi';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1716667283099-c239f254182e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

interface RestaurantMenuPageProps {
  onBack?: () => void;
  onWeatherClick?: () => void;
  onLiveClick?: () => void;
  initialCategory?: string;
  favoriteIds?: string[];
  onToggleFavorite?: (item: { id: string; name: string; price: number; image: string; category: string }) => void;
}

export function RestaurantMenuPage({ onBack, onWeatherClick, onLiveClick, initialCategory, favoriteIds = [], onToggleFavorite }: RestaurantMenuPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<{ id: string; title: string }[]>([{ id: 'all', title: 'Все' }]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    backendApi.getRestaurantCategories()
      .then((res) => {
        if (res.success && res.data?.categories) {
          const cats = res.data.categories;
          // Убираем дубликаты по названию (без учёта регистра)
          const seen = new Set<string>();
          const uniqueCats = cats.filter((c) => {
            const key = c.title.trim().toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
          const catList = [{ id: 'all', title: 'Все' }, ...uniqueCats.map((c) => ({ id: `cat-${c.id}`, title: c.title }))];
          setCategories(catList);
          const items: MenuItem[] = cats.flatMap((c) =>
            c.items.map((i) => ({
              id: i.id,
              name: i.name,
              description: i.name,
              price: i.price,
              image: i.image || DEFAULT_IMAGE,
              category: c.title,
            }))
          );
          setMenuItems(items);
          if (initialCategory && catList.some((c) => c.title === initialCategory)) {
            setSelectedCategory(initialCategory);
          }
        }
      })
      .catch((err) => console.warn('Restaurant load failed:', err))
      .finally(() => setLoading(false));
  }, [initialCategory]);

  const filteredItems = selectedCategory === 'Все'
    ? menuItems
    : menuItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white pb-24 lg:pb-0 w-full overflow-x-hidden">
      <ModernHeader onWeatherClick={onWeatherClick} onLiveClick={onLiveClick} />

      {/* Page Header with Categories — как в Гостинице */}
      <div className="lg:hidden w-full overflow-x-hidden">
        {/* Header Row with Back Button and Title */}
        <div className="w-full max-w-[402px] mx-auto px-5 pt-5 pb-3 box-border">
          <div className="flex items-center gap-3 w-full">
            <button
              onClick={() => onBack && onBack()}
              className="transition-all active:scale-95 flex-shrink-0"
              type="button"
            >
              <ChevronLeft className="w-6 h-6 text-[#71bcf0]" />
            </button>
            <h1 className="text-base font-semibold text-gray-900 flex-shrink-0">Меню ресторана</h1>
          </div>
        </div>

        {/* Categories — выравнивание с карточками, как в Гостинице */}
        <div className="w-full max-w-[402px] mx-auto px-5 pb-3 overflow-x-hidden box-border">
          <div className="flex gap-2 overflow-x-auto no-scrollbar w-full">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.title)}
                className={`
                  px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0
                  transition-all duration-300
                  ${selectedCategory === cat.title
                    ? 'bg-[#71bcf0] text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-[#71bcf0]'
                  }
                `}
              >
                {cat.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block w-full">
        <div className="max-w-[1400px] mx-auto px-8 w-full">
          <div className="flex items-center gap-3 py-8 w-full">
            <button
              onClick={() => onBack && onBack()}
              className="flex items-center justify-center text-gray-600 hover:text-[#71bcf0] transition-colors flex-shrink-0"
            >
              <ChevronLeft className="w-7 h-7" strokeWidth={2} />
            </button>
            <h1 className="text-4xl font-bold text-gray-900">Меню ресторана</h1>
          </div>
        </div>
        <div className="px-8 py-4 w-full overflow-x-hidden">
          <div className="max-w-[1400px] mx-auto flex gap-2 w-full">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.title)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                  transition-all duration-300
                  ${selectedCategory === cat.title
                    ? 'bg-[#71bcf0] text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-[#71bcf0]'
                  }
                `}
              >
                {cat.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content — как в Гостинице: max-w-[402px], px-5 */}
      <div className="w-full max-w-[402px] lg:max-w-[1400px] mx-auto overflow-x-hidden">
        <div className="px-5 lg:px-8 py-6 lg:py-8 w-full box-border">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin w-10 h-10 border-2 border-[#71bcf0] border-t-transparent rounded-full" />
            </div>
          ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 w-full">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="bg-[#71bcf0]/12 rounded-2xl shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col border border-[#71bcf0]/20"
              style={{
                animation: `fadeInUp 0.4s ease-out ${index * 0.05}s backwards`
              }}
            >
              {/* Круглое фото сверху + иконка избранного */}
              <div className="relative pt-4 px-4 flex justify-center">
                <div className="absolute top-2 right-2 z-10">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite?.({ id: item.id, name: item.name, price: item.price, image: item.image, category: item.category });
                    }}
                    className={`w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center transition-colors ${
                      favoriteIds.includes(item.id) ? '' : 'text-gray-400 hover:text-[#71bcf0]'
                    }`}
                    aria-label="В избранное"
                  >
                    <Heart
                      className="w-4 h-4"
                      fill={favoriteIds.includes(item.id) ? '#ef4444' : 'none'}
                      strokeWidth={favoriteIds.includes(item.id) ? 0 : 2}
                      stroke={favoriteIds.includes(item.id) ? 'none' : 'currentColor'}
                    />
                  </button>
                </div>
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Название, цена, кнопка + */}
              <div className="p-3 pt-2 flex-1 flex flex-col">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2 mb-0.5">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{item.price} смн</p>
                <div className="mt-auto flex justify-end">
                  <button
                    type="button"
                    className="w-9 h-9 rounded-full bg-[#71bcf0] flex items-center justify-center text-white hover:bg-[#5aa8dc] active:scale-95 transition-all shadow-md"
                    aria-label="В корзину"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}