import { useState, useEffect } from 'react';
import { ChevronLeft, Plus } from 'lucide-react';
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
}

export function RestaurantMenuPage({ onBack, onWeatherClick, onLiveClick, initialCategory }: RestaurantMenuPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'Все');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<{ id: string; title: string }[]>([{ id: 'all', title: 'Все' }]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    backendApi.getRestaurantCategories()
      .then((res) => {
        if (res.success && res.data?.categories) {
          const cats = res.data.categories;
          const catList = [{ id: 'all', title: 'Все' }, ...cats.map((c) => ({ id: `cat-${c.id}`, title: c.title }))];
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
    : menuItems.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <ModernHeader onWeatherClick={onWeatherClick} onLiveClick={onLiveClick} />

      {/* Desktop container */}
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        {/* Page Title with Back Button */}
        <div className="sticky top-[60px] z-30 bg-white border-b border-gray-200 -mx-4 lg:-mx-8 px-4 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <button
              onClick={() => onBack && onBack()}
              className="transition-all active:scale-95 z-10"
              type="button"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            
            <h1 className="absolute left-0 right-0 text-center text-base font-semibold text-gray-900 pointer-events-none">Меню ресторана</h1>
          </div>

          {/* Categories Filter */}
          <div className="pb-3 overflow-x-auto">
            <div className="flex gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.title)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                    transition-all duration-300
                    ${selectedCategory === cat.title
                      ? 'bg-[#71bcf0] text-white shadow-lg'
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

        {/* Menu Items - Grid layout */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin w-10 h-10 border-2 border-[#71bcf0] border-t-transparent rounded-full" />
          </div>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 pb-6">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
              style={{
                animation: `fadeInUp 0.4s ease-out ${index * 0.05}s backwards`
              }}
            >
              {/* Image */}
              <div className="w-full aspect-square overflow-hidden bg-gray-100">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">{item.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-[#71bcf0]">{item.price} смн</span>
                  <button className="w-8 h-8 rounded-full bg-[#71bcf0] flex items-center justify-center active:scale-95 transition-transform shadow-md">
                    <Plus className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
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