import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, MountainSnow, PersonStanding, Snowflake, CableCar, Baby, PartyPopper, Mountain, GraduationCap, Calendar } from 'lucide-react';
import { ModernHeader } from './ModernHeader';
import { TariffDetailPage } from './TariffDetailPage';
import { WebTariffDetailPage } from './WebTariffDetailPage';
import { useScrollPosition } from '../contexts/ScrollPositionContext';
import rentalImage from '../../assets/fe0728ce981dc79a4a5110574b2e9e6a3fe9268e.png';
import cableCarImage from '../../assets/d20644f0d94a0312b2560de3d37874eea4a562c1.png';
import activeRestImage from '../../assets/646f340a806886832b484c6e58d113275ee1e7e4.png';
import iceRinkImage from '../../assets/7d927dbf5a3274aa82a65d8d9c4db5a97785f987.png';

interface TariffItem {
  id: string;
  name: string;
  description: string;
  price: string;
  priceAdult?: number; // Цена для взрослых
  priceChild?: number; // Цена для детей
  time: string;
  image: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  items: TariffItem[];
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

  const categories: Category[] = [
    {
      id: 'rental',
      name: 'Прокат',
      icon: 'ski',
      items: [
        {
          id: 'rental-1',
          name: 'Лыжи',
          description: 'Прокат лыж для взрослых и детей',
          price: '125 смн',
          priceAdult: 125,
          priceChild: 75,
          time: 'Взрослы��: 125 смн | Детский: 75 смн',
          image: rentalImage
        },
        {
          id: 'rental-2',
          name: 'Сноуборд',
          description: 'Прокат сноуборда для взрослых и детей',
          price: '115 смн',
          priceAdult: 115,
          priceChild: 65,
          time: 'Взрослый: 115 смн | Детский: 65 смн',
          image: 'https://images.unsplash.com/photo-1610233426515-9e231999845d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
        },
        {
          id: 'rental-3',
          name: 'Экипировка',
          description: 'Полный комплект экипировки для катания',
          price: '160 смн',
          priceAdult: 160,
          priceChild: 70,
          time: 'Взрослый: 160 смн | Детский: 70 смн',
          image: 'https://images.unsplash.com/photo-1645999140947-db7546fecb30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
        },
        {
          id: 'rental-4',
          name: 'Экипировка + Лыжи',
          description: 'Комплект экипировки вместе с лыжами',
          price: '250 смн',
          priceAdult: 250,
          priceChild: 110,
          time: 'Взрослый: 250 смн | Детский: 110 смн',
          image: 'https://images.unsplash.com/photo-1761604227291-db2c1a000f34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
        },
        {
          id: 'rental-5',
          name: 'Экипировка + Сноуборд',
          description: 'Комплект экипировки вместе со сноубордом',
          price: '220 смн',
          priceAdult: 220,
          priceChild: 95,
          time: 'Взрослый: 220 смн | Детский: 95 смн',
          image: 'https://images.unsplash.com/photo-1610233426515-9e231999845d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
        },
        {
          id: 'rental-6',
          name: 'Каска',
          description: 'Защитный шлем для безопасного катания',
          price: '40 смн',
          priceAdult: 40,
          priceChild: 30,
          time: 'Взрослый: 40 смн | Детский: 30 смн',
          image: 'https://images.unsplash.com/photo-1606677334231-851a5eb1eabc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
        },
        {
          id: 'rental-7',
          name: 'Очки',
          description: 'Защитные очки для катания',
          price: '40 смн',
          priceAdult: 40,
          priceChild: 30,
          time: 'Взрослый: 40 смн | Детский: 30 смн',
          image: 'https://images.unsplash.com/photo-1606677334231-851a5eb1eabc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
        },
        {
          id: 'rental-8',
          name: 'Деревянные санки',
          description: 'Традиционные деревянные санки для детей',
          price: '50 смн',
          priceChild: 50,
          time: 'Только для детей',
          image: 'https://images.unsplash.com/photo-1613392083882-2dffe23482a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
        },
        {
          id: 'rental-9',
          name: 'Коляска',
          description: 'Коляска для удобной прогулки с малышами',
          price: '50 смн',
          priceChild: 50,
          time: 'Только для детей',
          image: 'https://images.unsplash.com/photo-1613392083882-2dffe23482a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
        }
      ]
    },
    {
      id: 'season-pass',
      name: 'Канатные дороги и каток',
      icon: 'ski',
      items: [
        {
          id: 'season-1',
          name: 'Каток',
          description: 'Аренда катка на открытом воздухе с прекрасным видом на горы',
          price: '55 смн',
          priceAdult: 55,
          priceChild: 55,
          time: 'Взрослый: 55 смн | Детский: 55 смн',
          image: iceRinkImage
        },
        {
          id: 'season-2',
          name: 'Канатная дорога 1 (разовый подъём)',
          description: 'Подъем по канатной дороге на вершину горы',
          price: '55 смн',
          priceAdult: 55,
          priceChild: 45,
          time: 'Взрослый: 55 смн | Детский: 45 смн',
          image: 'https://images.unsplash.com/photo-1577628208759-4ee69c26dadc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
        },
        {
          id: 'season-3',
          name: 'Канатная дорога 2 (разовый подъём)',
          description: 'Вторая канатная дорога для доступа к верхним склонам',
          price: '55 смн',
          priceAdult: 55,
          priceChild: 45,
          time: 'Взрослый: 55 смн | Детский: 45 смн',
          image: 'https://images.unsplash.com/photo-1629161584010-4b1babd5ebeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
        }
      ]
    },
    {
      id: 'walking-tourists',
      name: 'Активный отдых',
      icon: 'user',
      items: [
        {
          id: 'walk-1',
          name: 'Alpine Coaster',
          description: 'Захватывающий спуск на горных санях по специальной трассе',
          price: '80 смн',
          priceAdult: 80,
          priceChild: 70,
          time: 'Взрослый: 80 смн | Детский: 70 смн',
          image: 'https://images.unsplash.com/photo-1621650784628-77c530d43786?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
        },
        {
          id: 'walk-2',
          name: 'Сноутюбинг 1',
          description: 'Катание на надувных санях, первая трасса',
          price: '60 смн',
          priceAdult: 60,
          priceChild: 60,
          time: 'Взрослый: 60 смн | Детский: 60 смн',
          image: 'https://images.unsplash.com/photo-1641933002641-fa12b61845af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
        },
        {
          id: 'walk-3',
          name: 'Сноутюбинг 2',
          description: 'Катание на надувных санях, вторая трасса',
          price: '60 смн',
          priceAdult: 60,
          priceChild: 60,
          time: 'Взрослый: 60 смн | Детский: 60 смн',
          image: 'https://images.unsplash.com/photo-1641933002641-fa12b61845af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
        },
        {
          id: 'walk-4',
          name: 'Снегоход / 5 км',
          description: 'Прогулка на снегоходе по живописным горным маршрутам',
          price: '260 смн',
          priceAdult: 260,
          time: 'Только для взрослых',
          image: 'https://images.unsplash.com/photo-1548978195-7f88c6193862?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
        },
        {
          id: 'walk-5',
          name: 'Детский снегоход (1 круг)',
          description: 'Безопасная прогулка для детей на детском снегоходе',
          price: '40 смн',
          priceChild: 40,
          time: 'Только для детей',
          image: 'https://images.unsplash.com/photo-1548978195-7f88c6193862?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
        }
      ]
    },
    {
      id: 'riders',
      name: 'Дополнительные услуги',
      icon: 'snowflake',
      items: [
        {
          id: 'rider-1',
          name: 'Зип-лайн (спуск)',
          description: 'Экстремальный спуск по тросу над горными склонами',
          price: '100 смн',
          priceAdult: 100,
          time: 'Только для взрослх',
          image: 'https://images.unsplash.com/photo-1550310349-1ddd397b3ff1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
        },
        {
          id: 'rider-2',
          name: 'Лошадь (1 круг)',
          description: 'Конная рогулка по живописным горным тропам',
          price: '25 смн',
          priceAdult: 25,
          priceChild: 25,
          time: 'Взрослый: 25 смн | Детский: 25 смн',
          image: 'https://images.unsplash.com/photo-1654139800156-65f9afb0fa01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
        },
        {
          id: 'rider-3',
          name: 'Пони (1 круг)',
          description: 'Прогулка на пони для маленьких детей',
          price: '15 смн',
          priceChild: 15,
          time: 'Только для детей',
          image: 'https://images.unsplash.com/photo-1709052566673-b84f4bdd9980?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
        },
        {
          id: 'rider-4',
          name: 'Заезд автомобиля на территорию комплекса',
          description: 'Разовый пропуск для въезда автомобиля на территрию',
          price: '10 смн',
          priceAdult: 10,
          time: 'За один въезд',
          image: 'https://images.unsplash.com/photo-1642167867106-bb25831de3cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
        }
      ]
    }
  ];

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

  // Эффект для установки начальной категории
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
          {categories.map((category, index) => {
            const IconComponent = getIconComponent(category.icon);
            
            // Фоновые изображения для категорий
            const categoryImages: { [key: string]: string } = {
              'rental': rentalImage,
              'season-pass': cableCarImage,
              'walking-tourists': activeRestImage,
              'riders': 'https://images.unsplash.com/photo-1619683289294-4f5b923c2a00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbm93Ym9hcmQlMjByaWRlciUyMGFjdGlvbnxlbnwxfHx8fDE3Njc2MTE5MjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
              'cable-cars': 'https://images.unsplash.com/photo-1577628208759-4ee69c26dadc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2klMjBsaWZ0JTIwY2FibGUlMjBjYXJ8ZW58MXx8fHwxNzY3NjAxNjAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
              'kids': 'https://images.unsplash.com/photo-1656582117878-165d992214f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraWRzJTIwc2tpaW5nJTIwY2hpbGRyZW58ZW58MXx8fHwxNzY3NjExOTIxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
              'entertainment': 'https://images.unsplash.com/photo-1641933002658-c7f4d2be614a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbm93JTIwdHliaW5nJTIwd2ludGVyJTIwZnVufGVufDF8fHx8MTc2NzYxMTkyMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
              'rentals': 'https://images.unsplash.com/photo-1761604227291-db2c1a000f34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2klMjByZW50YWwlMjBlcXVpcG1lbnR8ZW58MXx8fHwxNzY3NjExOTIyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
            };
            
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
                    src={categoryImages[category.id]} 
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

        {/* Items Grid - Mobile: 1 col, Desktop: 4 cols */}
        <div className="px-5 lg:px-0 pt-5 lg:pt-8 pb-24 lg:pb-16 grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
          {selectedCategoryData?.items.map((item, index) => (
            <TariffCard key={item.id} item={item} index={index} onAddToCart={onAddToCart} onSelect={handleTariffSelect} />
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
  index: number;
  onAddToCart?: (categoryName: string, tariff: TariffItem, options: TariffOption[], date: string) => void;
  onSelect?: (tariff: TariffItem) => void;
}

function TariffCard({ item, index, onAddToCart, onSelect }: TariffCardProps) {
  return (
    <button
      className="w-full group bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
      style={{
        animation: `fadeInUp 0.4s ease-out ${index * 0.05}s backwards`
      }}
      onClick={() => onSelect && onSelect(item)}
    >
      {/* Image - вертикальная карточка */}
      <div className="relative h-36 lg:h-48 overflow-hidden bg-gray-100">
        <img
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          src={item.image}
        />
      </div>

      {/* Content */}
      <div className="p-4 lg:p-5">
        <p className="text-sm lg:text-base text-gray-800 leading-relaxed line-clamp-2 mb-3 font-medium text-left">
          {item.name}
        </p>
        
        {/* Price */}
        <div className="flex items-center justify-between">
          <span className="text-lg lg:text-xl font-bold text-[#71bcf0]">{item.price}</span>
          <span className="text-xs lg:text-sm text-gray-500">в день</span>
        </div>
      </div>
    </button>
  );
}