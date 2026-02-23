import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, MountainSnow, PersonStanding, Snowflake, CableCar, Baby, PartyPopper, Mountain, GraduationCap, Calendar } from 'lucide-react';
import { ModernHeader } from './ModernHeader';
import { TariffDetailPage } from './TariffDetailPage';
import { WebTariffDetailPage } from './WebTariffDetailPage';
import { useScrollPosition } from '../contexts/ScrollPositionContext';
import { useCategories } from '../hooks/useCategories';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import rentalImage from '../../assets/fe0728ce981dc79a4a5110574b2e9e6a3fe9268e.png';
import cableCarImage from '../../assets/d20644f0d94a0312b2560de3d37874eea4a562c1.png';
import activeRestImage from '../../assets/646f340a806886832b484c6e58d113275ee1e7e4.png';
import iceRinkImage from '../../assets/7d927dbf5a3274aa82a65d8d9c4db5a97785f987.png';

interface TariffItem {
  id: string; // productId from API as string
  name: string;
  description: string;
  price: string;
  priceAdult?: number; // Цена для взрослых
  priceChild?: number; // Цена для детей
  time: string;
  image: string;
  productId: number; // Real productId from API
  categoryId: number; // Real categoryId from API
}

interface Category {
  id: string; // categoryId from API as string
  name: string;
  icon: string;
  items: TariffItem[];
  categoryId: number; // Real categoryId from API
}

interface TariffOption {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface TariffsPageProps {
  onBack: () => void;
  onWeatherClick?: () => void;
  onLiveClick?: () => void;
  onAddToCart?: (categoryName: string, tariff: TariffItem, options: TariffOption[], date: string) => void;
  onDetailViewChange?: (isDetailView: boolean) => void;
  onGoToCart?: () => void;
  cartItemsCount?: number;
  cartTotal?: number;
  initialCategory?: string; // ID категории для автоматического открытия
  initialTariffId?: string; // ID тарифа для автоматического открытия детальной страницы
}

export function TariffsPage({ onBack, onWeatherClick, onLiveClick, onAddToCart, onDetailViewChange, onGoToCart, cartItemsCount = 0, cartTotal = 0, initialCategory, initialTariffId }: TariffsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory || null);
  const [selectedTariff, setSelectedTariff] = useState<TariffItem | null>(null);
  const [lastSelectedCategoryId, setLastSelectedCategoryId] = useState<string | null>(null);
  const categoryRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  
  // Load categories and products from API
  const { categories: apiCategories, isLoading: categoriesLoading, error: categoriesError } = useCategories();

  // Map API categories to TariffsPage format
  const mapApiCategoriesToTariffs = (): Category[] => {
    if (!apiCategories || apiCategories.length === 0) return [];
    
    // Map icon names based on category name or ID
    const getIconForCategory = (categoryName: string, categoryId: number): string => {
      const nameLower = categoryName.toLowerCase();
      if (nameLower.includes('прокат') || nameLower.includes('аренда')) return 'ski';
      if (nameLower.includes('канат') || nameLower.includes('каток')) return 'cable';
      if (nameLower.includes('актив') || nameLower.includes('отдых')) return 'user';
      if (nameLower.includes('дополнит') || nameLower.includes('услуг')) return 'snowflake';
      return 'ski'; // default
    };
    
    return apiCategories.map((apiCat: any) => {
      const categoryId = apiCat.id || apiCat.categoryId || 0;
      const products = apiCat.products || [];
      
      const items: TariffItem[] = products.map((product: any) => {
        const productId = product.id || product.productId || 0;
        const price = product.price || 0;
        
        // Format price string
        const priceStr = `${price} смн`;
        
        // For products, assume single price (can be extended if API provides adult/child prices)
        return {
          id: String(productId), // Use productId as string ID
          name: product.title || product.name || 'Услуга',
          description: product.description || '',
          price: priceStr,
          priceAdult: price,
          priceChild: price, // Default to same price, can be adjusted if API provides
          time: `${price} смн`,
          image: product.image || 'https://images.unsplash.com/photo-1551524559-8af4e6624178?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
          productId: productId,
          categoryId: categoryId,
        };
      });
      
      return {
        id: String(categoryId), // Use categoryId as string ID
        name: apiCat.title || apiCat.name || 'Категория',
        icon: getIconForCategory(apiCat.title || apiCat.name || '', categoryId),
        items: items,
        categoryId: categoryId,
      };
    });
  };

  const categories: Category[] = mapApiCategoriesToTariffs();

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      'ski': MountainSnow,
      'user': PersonStanding,
      'snowflake': Snowflake,
      'cable': CableCar,
      'baby': Baby,
      'party': PartyPopper,
      'mountain': Mountain,
      'graduation': GraduationCap
    };
    return icons[iconName] || MountainSnow;
  };

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);

  // Эффект для установки начальной категории (всегда вызывать до любых return — Rules of Hooks)
  useEffect(() => {
    if (initialCategory && initialCategory !== selectedCategory) {
      setSelectedCategory(initialCategory);
      setLastSelectedCategoryId(initialCategory);
    } else if (!initialCategory && selectedCategory) {
      // Если initialCategory не задан, сбрасываем выбор
      setSelectedCategory(null);
      setSelectedTariff(null);
    }
  }, [initialCategory]);

  // Эффект для автоматического открытия конкретного тарифа
  useEffect(() => {
    if (initialTariffId) {
      // Найти тариф по ID во всех категориях
      for (const category of categories) {
        const tariff = category.items.find(item => item.id === initialTariffId);
        if (tariff) {
          setSelectedTariff(tariff);
          if (onDetailViewChange) {
            onDetailViewChange(true);
          }
          // Убеждаемся, что категория установлена
          if (!selectedCategory || selectedCategory !== category.id) {
            setSelectedCategory(category.id);
            setLastSelectedCategoryId(category.id);
          }
          break;
        }
      }
    }
  }, [initialTariffId]);

  // Эффект для скролла к последней выбранной категории
  useEffect(() => {
    if (!selectedCategory && lastSelectedCategoryId && categoryRefs.current[lastSelectedCategoryId]) {
      setTimeout(() => {
        categoryRefs.current[lastSelectedCategoryId]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 100);
    }
  }, [selectedCategory, lastSelectedCategoryId]);

  // Show loading state (после всех хуков — Rules of Hooks)
  if (categoriesLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Show error state
  if (categoriesError) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <ErrorMessage message={categoriesError} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  const handleCategoryClick = (categoryId: string) => {
    setLastSelectedCategoryId(categoryId);
    setSelectedCategory(categoryId);
  };

  const handleTariffSelect = (tariff: TariffItem) => {
    setSelectedTariff(tariff);
    if (onDetailViewChange) {
      onDetailViewChange(true);
    }
  };

  const handleAddToCartFromDetail = (options: TariffOption[], date: string) => {
    if (selectedTariff && selectedCategoryData && onAddToCart) {
      onAddToCart(selectedCategoryData.name, selectedTariff, options, date);
      // НЕ закрываем детальную страницу - пользователь остаётся здесь
      // Он может продолжить добавлять товары или нажать "Назад" сам
    }
  };

  // Если выбран конкретный тариф - показываем детальную страницу
  if (selectedTariff) {
    return (
      <>
        {/* Mobile Version */}
        <div className="lg:hidden">
          <TariffDetailPage
            tariff={selectedTariff}
            onBack={() => {
              setSelectedTariff(null);
              if (onDetailViewChange) {
                onDetailViewChange(false);
              }
            }}
            onAddToCart={handleAddToCartFromDetail}
            onGoToCart={onGoToCart}
            cartItemsCount={cartItemsCount}
            cartTotal={cartTotal}
          />
        </div>

        {/* Desktop Version */}
        <div className="hidden lg:block">
          <WebTariffDetailPage
            tariff={selectedTariff}
            onBack={() => {
              setSelectedTariff(null);
              if (onDetailViewChange) {
                onDetailViewChange(false);
              }
            }}
            onAddToCart={handleAddToCartFromDetail}
            onGoToCart={onGoToCart}
            cartItemsCount={cartItemsCount}
            cartTotal={cartTotal}
          />
        </div>
      </>
    );
  }

  // Если категория не выбрана - показываем список категорий
  if (!selectedCategory) {
    return (
      <div className="min-h-screen bg-white pb-24 lg:pb-0">
        <ModernHeader onWeatherClick={onWeatherClick} onLiveClick={onLiveClick} />

        {/* Page Header - Mobile & Desktop */}
        <div className="">
          {/* Mobile Header */}
          <div className="lg:hidden px-4 pt-5 pb-3">
            <div className="flex items-center justify-between">
              <button
                onClick={() => onBack && onBack()}
                className="flex items-center justify-center transition-all"
                type="button"
              >
                <ChevronLeft className="w-6 h-6 text-[#71bcf0]" />
              </button>
              
              <h1 className="absolute left-0 right-0 text-center text-base font-semibold text-gray-900 pointer-events-none">Услуги</h1>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block">
            <div className="max-w-[1400px] mx-auto px-8">
              <div className="flex items-center gap-3 py-8">
                <button
                  onClick={() => onBack && onBack()}
                  className="flex items-center justify-center text-gray-600 hover:text-[#71bcf0] transition-colors"
                  type="button"
                >
                  <ChevronLeft className="w-7 h-7" strokeWidth={2} />
                </button>
                <h1 className="text-4xl font-bold text-gray-900">Услуги</h1>
              </div>
              
              {/* Tariff Period Text - Desktop */}
              <div className="pb-8">
                <p className="text-gray-500 text-sm">
                  тариф с 05.01.26 по 20.01.26
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tariff Period Text - Mobile Only */}
        <div className="lg:hidden px-5 pt-4 pb-2">
          <p className="text-gray-500 text-xs text-center">
            тариф с 05.01.26 по 20.01.26
          </p>
        </div>

        {/* Categories Grid - Mobile: single column, Desktop: 2 columns */}
        <div className="px-5 lg:px-0 lg:max-w-[1400px] lg:mx-auto lg:px-8 pb-24 lg:pb-16 grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-8">
          {categories.length === 0 ? (
            <div className="col-span-full py-16 text-center text-gray-500">
              <p className="text-lg">Нет доступных услуг</p>
              <p className="text-sm mt-2">Попробуйте обновить страницу</p>
            </div>
          ) : categories.map((category, index) => {
            const IconComponent = getIconComponent(category.icon);
            
            // Фоновые изображения для категорий (по индексу, т.к. API возвращает числовые ID)
            const categoryImageList = [
              rentalImage,
              cableCarImage,
              activeRestImage,
              'https://images.unsplash.com/photo-1619683289294-4f5b923c2a00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
              'https://images.unsplash.com/photo-1577628208759-4ee69c26dadc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
              'https://images.unsplash.com/photo-1656582117878-165d992214f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
              'https://images.unsplash.com/photo-1641933002658-c7f4d2be614a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
              'https://images.unsplash.com/photo-1761604227291-db2c1a000f34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
            ];
            const categoryBgImage = categoryImageList[index % categoryImageList.length];
            
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className="w-full rounded-[28px] lg:rounded-3xl hover:shadow-2xl transition-all duration-500 overflow-hidden active:scale-[0.98] relative h-52 lg:h-80 group"
                style={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.08}s backwards`,
                  boxShadow: '0 8px 16px -2px rgba(113, 188, 240, 0.4)'
                }}
                ref={el => categoryRefs.current[category.id] = el}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img 
                    src={categoryBgImage} 
                    alt={category.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Gradient Overlay - красивый градиент для текста */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  
                  {/* Дополнителный градиент для глубины */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/20 to-black/60" />
                </div>

                {/* Content */}
                <div className="relative h-full flex items-end p-7 lg:p-10">
                  {/* Красивый текст - выровнен слева */}
                  <div className="space-y-3 text-left">
                    <div className="h-1 w-16 lg:w-20 bg-gradient-to-r from-[#71bcf0] to-[#4fa8e0] rounded-full shadow-lg shadow-[#71bcf0]/60 transform group-hover:w-20 lg:group-hover:w-28 transition-all duration-300" />
                    <h3 className="font-extrabold text-white text-2xl lg:text-4xl tracking-tight leading-tight drop-shadow-2xl text-left">
                      {category.name}
                    </h3>
                  </div>
                </div>

                {/* Shine Effect на hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Если категория выбрана - показываем список товаров
  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Header - Mobile only */}
      <div className="lg:hidden">
        <ModernHeader onWeatherClick={onWeatherClick} onLiveClick={onLiveClick} />
      </div>
      
      {/* Desktop: max-w-[1400px], Mobile: max-w-[402px] */}
      <div className="max-w-[402px] lg:max-w-[1400px] mx-auto lg:px-8">
        {/* Header Section - Mobile & Desktop */}
        <div className="bg-white px-5 lg:px-0 py-4 lg:py-8 flex items-center gap-3">
          <button
            onClick={() => setSelectedCategory(null)}
            className="flex items-center justify-center text-[#71bcf0] lg:text-gray-600 hover:text-[#71bcf0] transition-colors"
          >
            <ChevronLeft className="w-5 h-5 lg:w-7 lg:h-7" strokeWidth={2.5} />
          </button>
          <h1 className="lg:hidden absolute left-0 right-0 text-center text-base font-semibold text-gray-900 pointer-events-none">{selectedCategoryData?.name}</h1>
          <h1 className="hidden lg:block text-3xl font-bold text-gray-900">{selectedCategoryData?.name}</h1>
        </div>

        {/* Items Grid - Mobile: 1 col, Desktop: 2 cols */}
        <div className="px-5 lg:px-0 pt-5 lg:pt-8 pb-24 lg:pb-16 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {selectedCategoryData?.items.map((item, index) => (
            <TariffCard key={item.id} item={item} categoryName={selectedCategoryData?.name || ''} index={index} onAddToCart={onAddToCart} onSelect={handleTariffSelect} />
          ))}
        </div>
      </div>
      
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

interface TariffCardProps {
  item: TariffItem;
  categoryName: string;
  index: number;
  onAddToCart?: (categoryName: string, tariff: TariffItem, options: TariffOption[], date: string) => void;
  onSelect?: (tariff: TariffItem) => void;
}

function TariffCard({ item, categoryName, index, onAddToCart, onSelect }: TariffCardProps) {
  return (
    <button
      className="w-full flex rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer active:scale-[0.99] group"
      style={{
        animation: `fadeInUp 0.4s ease-out ${index * 0.05}s backwards`
      }}
      onClick={() => onSelect && onSelect(item)}
    >
      {/* Image - левая часть ~40% */}
      <div className="relative w-[40%] min-w-[120px] aspect-[4/5] flex-shrink-0 overflow-hidden">
        <img
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          src={item.image}
        />
      </div>

      {/* Content - правая часть ~60% */}
      <div className="flex-1 min-w-0 p-4 lg:p-5 flex flex-col justify-between text-left">
        <div>
          <p className="text-xs text-gray-500 mb-1">{categoryName}</p>
          <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-0.5">{item.name}</h3>
          {item.description && item.description !== item.name && (
            <p className="text-sm text-gray-800 line-clamp-2">{item.description}</p>
          )}
        </div>
        
        {/* Bottom row: Время | Цена */}
        <div className="flex justify-between items-end mt-3 pt-3 border-t border-gray-100 gap-4">
          <div>
            <p className="text-xs text-gray-500">Время</p>
            <p className="text-sm font-bold text-gray-900">8:30–17:00</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Цена</p>
            <p className="text-base font-bold text-[#5ba8e0]">{item.price}</p>
          </div>
        </div>
      </div>
    </button>
  );
}