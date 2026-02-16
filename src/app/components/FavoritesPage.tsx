import { ChevronLeft, Users } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { FavoriteIcon } from './ProfileIcons';

interface FavoriteItem {
  id: string;
  title: string;
  capacity: number;
  price: number;
  images: string[];
}

interface FavoritesPageProps {
  onBack?: () => void;
  favorites?: FavoriteItem[];
  onItemClick?: (item: FavoriteItem) => void;
  onRemoveFavorite?: (itemId: string) => void;
}

export function FavoritesPage({ onBack, favorites = [], onItemClick, onRemoveFavorite }: FavoritesPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10">
        <div className="px-5 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onBack?.()}
              className="transition-all active:scale-95 flex-shrink-0 z-10 relative"
              type="button"
            >
              <ChevronLeft className="w-5 h-5 text-[#71bcf0]" />
            </button>
            <div className="flex-1 text-center -ml-11 pointer-events-none">
              <h1 className="text-base font-semibold text-gray-900">Избранное</h1>
              <p className="text-sm text-gray-400">{favorites.length} {favorites.length === 1 ? 'товар' : favorites.length > 1 && favorites.length < 5 ? 'товара' : 'товаров'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-5 pt-48">
          <h2 className="font-bold text-gray-900 mb-2 text-center">
            Список избранных пуст :(
          </h2>
          <p className="text-sm text-gray-500 text-center leading-relaxed">
            Добавляйте товары в избранное,<br />
            чтобы увидеть их здесь
          </p>
        </div>
      ) : (
        <div className="px-5 pb-24">
          <div className="space-y-4">
            {favorites.map((item, index) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                style={{
                  animation: `fadeInUp 0.4s ease-out ${index * 0.1}s backwards`
                }}
              >
                {/* Image */}
                <div 
                  className="relative h-48 overflow-hidden cursor-pointer"
                  onClick={() => onItemClick && onItemClick(item)}
                >
                  <ImageWithFallback
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Remove from favorites button */}
                  <button
                    className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full p-2 shadow-md hover:scale-110 transition-transform z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFavorite && onRemoveFavorite(item.id);
                    }}
                  >
                    <FavoriteIcon className="w-5 h-5 fill-red-500 text-red-500" />
                  </button>
                  
                  {/* Capacity badge */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-md">
                    <Users className="w-4 h-4 text-[#71bcf0]" />
                    <span className="text-sm font-semibold text-gray-700">{item.capacity}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-base font-bold text-gray-900 mb-3">{item.title}</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500 mb-1">Цена за ночь</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-[#71bcf0]">
                          {item.price.toLocaleString('ru-RU')}
                        </span>
                        <span className="text-sm text-gray-600">смн</span>
                      </div>
                    </div>
                    
                    <button
                      className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-semibold text-sm hover:shadow-lg transition-all duration-300 hover:scale-105"
                      onClick={() => onItemClick && onItemClick(item)}
                    >
                      Забронировать
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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