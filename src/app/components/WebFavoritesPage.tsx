import { ChevronLeft, Heart } from 'lucide-react';

interface FavoriteItem {
  id: string;
  title: string;
  capacity: string;
  price: number;
  images: string[];
}

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
          /* Favorites Grid */
          <div className="grid grid-cols-4 gap-6">
            {favorites.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <div className="relative" onClick={() => onItemClick(item)}>
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFavorite(item.id);
                    }}
                    className="absolute top-3 right-3 w-9 h-9 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-md"
                  >
                    <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                  </button>
                </div>
                
                <div className="p-4" onClick={() => onItemClick(item)}>
                  <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">{item.capacity}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">
                      {item.price.toLocaleString('ru-RU')} смн
                    </span>
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
