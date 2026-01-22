import { useState } from 'react';
import { ChevronLeft, Plus } from 'lucide-react';
import { ModernHeader } from './ModernHeader';

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
  initialCategory?: string; // Добавляем поддержку начальной категории
}

export function RestaurantMenuPage({ onBack, onWeatherClick, onLiveClick, initialCategory }: RestaurantMenuPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'Все');

  const categories = ['Все', 'Завтрак', 'Обед', 'Ужин', 'Напитки', 'Десерты'];

  const menuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Завтрак континентальный',
      description: 'Яичница, тосты, джем, масло, кофе или чай',
      price: 45,
      image: 'https://images.unsplash.com/photo-1716667283099-c239f254182e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      category: 'Завтрак'
    },
    {
      id: '2',
      name: 'Омлет с овощами',
      description: 'Свежие овощи, зелень, сыр',
      price: 38,
      image: 'https://images.unsplash.com/photo-1716667283099-c239f254182e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      category: 'Завтрак'
    },
    {
      id: 'lagman',
      name: 'Лагман',
      description: 'Горячий лагман с дымком — согрейся вкусно после прогулки',
      price: 60,
      image: 'https://images.unsplash.com/photo-1669018560322-5f98298fd21d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMHRhamlrJTIwZm9vZCUyMGxhZ21hbnxlbnwxfHx8fDE3Njc1MzE1NjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'Обед'
    },
    {
      id: 'shashlik',
      name: 'Шашлык',
      description: 'Душанбинская классика — шашлык на углях с видом на горы',
      price: 85,
      image: 'https://images.unsplash.com/photo-1642497394080-b01ac324edc8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwa2ViYWIlMjBzaGFzaGxpa3xlbnwxfHx8fDE3Njc1MzE1NjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'Обед'
    },
    {
      id: '3',
      name: 'Плов традиционный',
      description: 'Баранина, морковь, рис, специи',
      price: 65,
      image: 'https://images.unsplash.com/photo-1723962807917-ffab0600929c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      category: 'Обед'
    },
    {
      id: '4',
      name: 'Шурпа',
      description: 'Традиционный суп с бараниной и овощами',
      price: 55,
      image: 'https://images.unsplash.com/photo-1723962807917-ffab0600929c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      category: 'Обед'
    },
    {
      id: '5',
      name: 'Салат овощной',
      description: 'Свежие помидоры, огурцы, зелень, оливковое масло',
      price: 32,
      image: 'https://images.unsplash.com/photo-1692780941266-96892bb6c9df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      category: 'Обед'
    },
    {
      id: '6',
      name: 'Стейк из говядины',
      description: 'Премиум стейк с овощами гриль',
      price: 125,
      image: 'https://images.unsplash.com/photo-1555105269-2a294dddf6b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      category: 'Ужин'
    },
    {
      id: '7',
      name: 'Рыба на гриле',
      description: 'Форель с лимоном и зеленью',
      price: 95,
      image: 'https://images.unsplash.com/photo-1555105269-2a294dddf6b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      category: 'Ужин'
    },
    {
      id: '8',
      name: 'Кофе эспрессо',
      description: 'Классический итальянский кофе',
      price: 15,
      image: 'https://images.unsplash.com/photo-1618263616142-7b8815503d05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      category: 'Напитки'
    },
    {
      id: '9',
      name: 'Капучино',
      description: 'Кофе с молочной пенкой',
      price: 18,
      image: 'https://images.unsplash.com/photo-1618263616142-7b8815503d05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      category: 'Напитки'
    },
    {
      id: '10',
      name: 'Зелёный чай',
      description: 'Свежезаваренный зелёный чай',
      price: 12,
      image: 'https://images.unsplash.com/photo-1618263616142-7b8815503d05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      category: 'Напитки'
    },
    {
      id: '11',
      name: 'Тирамису',
      description: 'Классический итальянский десерт',
      price: 42,
      image: 'https://images.unsplash.com/photo-1679942262057-d5732f732841?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      category: 'Десерты'
    },
    {
      id: '12',
      name: 'Наполеон',
      description: 'Слоёный торт с кремом',
      price: 38,
      image: 'https://images.unsplash.com/photo-1679942262057-d5732f732841?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      category: 'Десерты'
    }
  ];

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
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                    transition-all duration-300
                    ${selectedCategory === category
                      ? 'bg-[#71bcf0] text-white shadow-lg'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-[#71bcf0]'
                    }
                  `}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Items - Grid layout */}
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