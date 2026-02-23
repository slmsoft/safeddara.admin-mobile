import { useState, useEffect } from 'react';
import { ChevronLeft, Minus, Plus, ChevronRight } from 'lucide-react';

interface TariffOption {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface TariffDetailPageProps {
  tariff: {
    id: string;
    name: string;
    description: string;
    price: string;
    priceAdult?: number;
    priceChild?: number;
    time: string;
    image: string;
    productId?: number; // Real productId from API
    categoryId?: number; // Real categoryId from API
  };
  onBack: () => void;
  onAddToCart: (items: TariffOption[], date: string) => void;
  onGoToCart?: () => void;
  cartItemsCount?: number;
  cartTotal?: number;
}

export function TariffDetailPage({ tariff, onBack, onAddToCart, onGoToCart, cartItemsCount = 0, cartTotal = 0 }: TariffDetailPageProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState('09.01.2026');
  const [calendarMonth, setCalendarMonth] = useState(0);
  
  // Создаем опции тарифов на основе доступных цен
  const createTariffOptions = (): TariffOption[] => {
    const options: TariffOption[] = [];
    
    if (tariff.priceChild !== undefined) {
      options.push({
        id: 'child',
        name: 'Детский (от 6 до 14 лет)',
        price: tariff.priceChild,
        quantity: 0
      });
    }
    
    if (tariff.priceAdult !== undefined) {
      options.push({
        id: 'adult',
        name: 'Взрослый (от 15 лет)',
        price: tariff.priceAdult,
        quantity: 0
      });
    }
    
    return options;
  };

  const [tariffOptions, setTariffOptions] = useState<TariffOption[]>(createTariffOptions());
  const [showButton, setShowButton] = useState(false);

  const getTotalItems = () => {
    return tariffOptions.reduce((sum, option) => sum + option.quantity, 0);
  };

  const getCurrentTotal = () => {
    return tariffOptions.reduce((sum, option) => sum + (option.price * option.quantity), 0);
  };

  // Отслеживаем изменения и обновляем видимость кнопки
  useEffect(() => {
    const totalItems = getTotalItems();
    const shouldShow = cartItemsCount > 0 || totalItems > 0;
    setShowButton(shouldShow);
  }, [tariffOptions, cartItemsCount, cartTotal]);

  const handleIncrement = (optionId: string) => {
    const updatedOptions = tariffOptions.map(option =>
      option.id === optionId
        ? { ...option, quantity: option.quantity + 1 }
        : option
    );
    setTariffOptions(updatedOptions);
    
    // Сразу добавляем в корзину при каждом нажатии на +
    // НО НЕ переходим на другую страницу - пользователь остается здесь
    onAddToCart(updatedOptions, selectedDate);
  };

  const handleDecrement = (optionId: string) => {
    const updatedOptions = tariffOptions.map(option =>
      option.id === optionId && option.quantity > 0
        ? { ...option, quantity: option.quantity - 1 }
        : option
    );
    setTariffOptions(updatedOptions);
    
    // Обновляем корзину при уменьшении
    // Пользователь остается на той же странице
    onAddToCart(updatedOptions, selectedDate);
  };

  const handleGoToCart = () => {
    if (onGoToCart) {
      onGoToCart();
    }
  };

  // Calendar logic
  const months = [
    'январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
    'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'
  ];

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const currentYear = 2026;
  const currentMonth = calendarMonth;
  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const handleDateSelect = (day: number) => {
    const formattedDate = `${String(day).padStart(2, '0')}.${String(currentMonth + 1).padStart(2, '0')}.${currentYear}`;
    setSelectedDate(formattedDate);
    setShowCalendar(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header — только кнопка «Назад», название на изображении */}
      <div className="bg-white px-5 py-4 flex items-center sticky top-0 z-40 shadow-sm">
        <button
          onClick={() => onBack && onBack()}
          className="transition-all active:scale-95"
          type="button"
        >
          <ChevronLeft className="w-6 h-6 text-[#71bcf0]" strokeWidth={2.5} />
        </button>
      </div>

      {/* Hero Section with Image */}
      <div 
        className="relative h-64 bg-cover bg-center"
        style={{
          backgroundImage: `url(${tariff.image})`,
          backgroundColor: '#ddd'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/50"></div>
        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">{tariff.name}</h2>
          <p className="text-white/90 text-sm leading-relaxed">{tariff.description}</p>
        </div>
      </div>

      {/* Tariff Options */}
      <div className="px-5 pt-6 space-y-4">
        {tariffOptions.map((option) => (
          <div key={option.id} className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-1">Тариф:</p>
              <p className="font-semibold text-gray-900">{option.name}</p>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">Количество</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDecrement(option.id)}
                  disabled={option.quantity === 0}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    option.quantity === 0
                      ? 'bg-gray-100 text-gray-400'
                      : 'bg-gray-200 text-gray-700 active:scale-95'
                  }`}
                >
                  <Minus size={20} />
                </button>
                <span className="w-12 text-center font-semibold text-xl text-gray-900">
                  {option.quantity}
                </span>
                <button
                  onClick={() => handleIncrement(option.id)}
                  className="w-10 h-10 rounded-xl bg-[#71bcf0] text-white flex items-center justify-center active:scale-95 transition-all"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            {option.quantity > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Цена за единицу:</span>
                  <span className="font-semibold text-gray-900">{option.price.toLocaleString()} смн</span>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Date Selection */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-gray-500 mb-2">Дата посещения:</p>
          <button
            onClick={() => setShowCalendar(true)}
            className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <span className="font-semibold text-gray-900">{selectedDate}</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Checkout Button - показывается, когда в корзине есть товары */}
      {showButton && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[9999] shadow-[0_-4px_20px_rgba(0,0,0,0.1)] lg:px-5">
          <div className="max-w-[402px] mx-auto px-5 lg:px-0 py-3">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-gray-500">Итого</p>
                <p className="text-xl font-bold text-gray-900">{(cartTotal > 0 ? cartTotal : getCurrentTotal()).toLocaleString()} смн</p>
              </div>
              <button
                onClick={handleGoToCart}
                className="px-8 py-3 bg-[#3d5a80] text-white rounded-2xl font-semibold active:scale-98 transition-all"
              >
                Оформить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Modal */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white rounded-t-3xl w-full p-6 pb-8 animate-slide-up max-w-[402px] mx-auto">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setCalendarMonth(prev => Math.max(0, prev - 1))}
                className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center active:scale-95 transition-all"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h3 className="font-semibold text-gray-900">
                {months[currentMonth]} {currentYear} г.
              </h3>
              <button
                onClick={() => setCalendarMonth(prev => Math.min(11, prev + 1))}
                className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center active:scale-95 transition-all"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Week days */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'].map(day => (
                <div key={day} className="text-center text-xs text-gray-500 font-medium py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-2 mb-6">
              {days.map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} />;
                }
                
                const isToday = day === 9 && currentMonth === 0;
                const isPast = currentMonth === 0 && day < 9;

                return (
                  <button
                    key={day}
                    onClick={() => !isPast && handleDateSelect(day)}
                    disabled={isPast}
                    className={`
                      aspect-square rounded-xl flex items-center justify-center text-sm font-medium transition-all
                      ${isToday ? 'bg-[#71bcf0] text-white' : ''}
                      ${!isToday && !isPast ? 'hover:bg-gray-100 text-gray-900' : ''}
                      ${isPast ? 'text-gray-300 cursor-not-allowed' : ''}
                      ${!isPast ? 'active:scale-95' : ''}
                    `}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Close button */}
            <button
              onClick={() => setShowCalendar(false)}
              className="w-full py-3 bg-gray-100 rounded-xl font-medium text-gray-700 active:scale-98 transition-all"
            >
              Выбрать день
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}