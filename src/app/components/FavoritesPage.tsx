import { ChevronLeft } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { FavoriteIcon } from './ProfileIcons';

type FavoriteItem =
  | { type: 'hotel'; id: string; title: string; capacity: number; price: number; images: string[] }
  | { type: 'restaurant'; id: string; title: string; price: number; images: string[]; category?: string };

interface FavoritesPageProps {
  onBack?: () => void;
  favorites?: FavoriteItem[];
  onItemClick?: (item: FavoriteItem) => void;
  onRemoveFavorite?: (itemId: string, itemType?: 'hotel' | 'restaurant') => void;
}

export function FavoritesPage({ onBack, favorites = [], onItemClick, onRemoveFavorite }: FavoritesPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10">
        <div className="px-5 py-4 max-w-[402px] mx-auto">
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

      {/* Content — карточки как в меню ресторана */}
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
        <div className="px-5 pb-24 max-w-[402px] mx-auto">
          <div className="grid grid-cols-2 gap-4">
            {favorites.map((item, index) => (
              <div
                key={`${item.type}-${item.id}`}
                className="bg-[#71bcf0]/12 rounded-2xl shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col border border-[#71bcf0]/20"
                style={{
                  animation: `fadeInUp 0.4s ease-out ${index * 0.05}s backwards`
                }}
              >
                {/* Круглое фото + сердечко (как в меню ресторана) */}
                <div className="relative pt-4 px-4 flex justify-center">
                  <button
                    type="button"
                    className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFavorite && onRemoveFavorite(item.id, item.type);
                    }}
                    aria-label="Убрать из избранного"
                  >
                    <FavoriteIcon className="w-4 h-4 fill-red-500 text-red-500" />
                  </button>
                  <div
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 cursor-pointer"
                    onClick={() => onItemClick && onItemClick(item)}
                  >
                    <ImageWithFallback
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Название, цена, кнопка */}
                <div className="p-3 pt-2 flex-1 flex flex-col">
                  <h3
                    className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2 mb-0.5 cursor-pointer"
                    onClick={() => onItemClick && onItemClick(item)}
                  >
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">{item.price} смн</p>
                  <div className="mt-auto flex justify-end">
                    <button
                      type="button"
                      className="px-4 py-2 rounded-full bg-[#71bcf0] text-white text-xs font-medium hover:bg-[#5aa8dc] active:scale-95 transition-all shadow-md"
                      onClick={() => onItemClick && onItemClick(item)}
                    >
                      {item.type === 'hotel' ? 'Забронировать' : 'В меню'}
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