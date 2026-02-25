import { ChevronLeft, Heart } from 'lucide-react';

type FavoriteItem =
  | { type: 'hotel'; id: string; title: string; capacity: string; price: number; images: string[] }
  | { type: 'restaurant'; id: string; title: string; price: number; images: string[]; category?: string };

interface WebFavoritesPageProps {
  favorites: FavoriteItem[];
  onBack: () => void;
  onItemClick: (item: FavoriteItem) => void;
  onRemoveFavorite: (itemId: string) => void;
}

export function WebFavoritesPage({ favorites, onBack, onItemClick, onRemoveFavorite }: WebFavoritesPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-8 py-8">
        {/* Header with back button */}
        <div className="flex items-center gap-6 mb-8">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" strokeWidth={2.5} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Избранное</h1>
            <p className="text-sm text-gray-400">
              {favorites.length} {favorites.length === 1 ? 'товар' : favorites.length > 1 && favorites.length < 5 ? 'товара' : 'товаров'}
            </p>
          </div>
        </div>

        {/* Content */}
        {favorites.length === 0 ? (
          /* Empty State */
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                <Heart className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Список избранных пуст :(
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                Добавляйте товары в избранное,<br />
                чтобы увидеть их здесь
              </p>
            </div>
          </div>
        ) : (
          /* Favorites Grid — карточки как в меню ресторана */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {favorites.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="bg-[#71bcf0]/12 rounded-2xl shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col border border-[#71bcf0]/20"
              >
                <div className="relative pt-4 px-4 flex justify-center">
                  <button
                    type="button"
                    className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center hover:scale-105 transition-transform"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFavorite(item.id);
                    }}
                    aria-label="Убрать из избранного"
                  >
                    <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                  </button>
                  <div
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 cursor-pointer"
                    onClick={() => onItemClick(item)}
                  >
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="p-3 pt-2 flex-1 flex flex-col">
                  <h3
                    className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2 mb-0.5 cursor-pointer"
                    onClick={() => onItemClick(item)}
                  >
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">{item.price} смн</p>
                  <div className="mt-auto flex justify-end">
                    <button
                      type="button"
                      className="px-4 py-2 rounded-full bg-[#71bcf0] text-white text-xs font-medium hover:bg-[#5aa8dc] transition-all shadow-md"
                      onClick={() => onItemClick(item)}
                    >
                      {item.type === 'hotel' ? 'Забронировать' : 'В меню'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
