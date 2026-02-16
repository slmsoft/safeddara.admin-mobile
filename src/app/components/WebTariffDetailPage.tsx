import { useState, useEffect } from 'react';
import { ChevronLeft, Minus, Plus, ChevronRight, Calendar } from 'lucide-react';

interface TariffOption {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface WebTariffDetailPageProps {
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

export function WebTariffDetailPage({ tariff, onBack, onAddToCart, onGoToCart, cartItemsCount = 0, cartTotal = 0 }: WebTariffDetailPageProps) {
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
    onAddToCart(updatedOptions, selectedDate);
  };

  const handleDecrement = (optionId: string) => {
    const updatedOptions = tariffOptions.map(option =>
      option.id === optionId && option.quantity > 0
        ? { ...option, quantity: option.quantity - 1 }
        : option
    );
    setTariffOptions(updatedOptions);
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
    <div className="min-h-screen bg-gray-50">
      {/* Header with back button */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-8 py-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center justify-center hover:bg-gray-100 rounded-full p-2 transition-all"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" strokeWidth={2.5} />
          </button>
          <h1 className="text-xl font-bold text-gray-900">{tariff.name}</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-8 py-8">
        <div className="grid grid-cols-2 gap-8">
          {/* Left Column - Image and Description */}
          <div className="space-y-6">
            {/* Hero Image */}
            <div 
              className="relative h-96 bg-cover bg-center rounded-2xl overflow-hidden shadow-xl"
              style={{
                backgroundImage: `url(${tariff.image})`,
                backgroundColor: '#ddd'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                <h2 className="text-3xl font-bold mb-3">{tariff.name}</h2>
                <p className="text-white/95 text-base leading-relaxed">{tariff.description}</p>
              </div>
            </div>

            {/* Date Selection */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <p className="text-sm font-semibold text-gray-700 mb-3">Дата посещения</p>
              <button
                onClick={() => setShowCalendar(true)}
                className="w-full flex items-center justify-between px-5 py-4 bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl hover:shadow-md transition-all border border-blue-100"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[#71bcf0]" />
                  <span className="font-semibold text-gray-900">{selectedDate}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Right Column - Tariff Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Выберите тариф</h3>
            
            {tariffOptions.map((option) => (
              <div key={option.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Тариф</p>
                  <p className="font-bold text-gray-900 text-base">{option.name}</p>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-700 font-semibold">Количество</span>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleDecrement(option.id)}
                      disabled={option.quantity === 0}
                      className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                        option.quantity === 0
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 active:scale-95'
                      }`}
                    >
                      <Minus size={20} />
                    </button>
                    <span className="w-16 text-center font-bold text-2xl text-gray-900">
                      {option.quantity}
                    </span>
                    <button
                      onClick={() => handleIncrement(option.id)}
                      className="w-11 h-11 rounded-xl bg-[#71bcf0] text-white flex items-center justify-center hover:bg-[#5da8d8] active:scale-95 transition-all shadow-md"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>

                {option.quantity > 0 && (
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Цена за единицу:</span>
                      <span className="font-bold text-gray-900 text-base">{option.price.toLocaleString()} смн</span>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Total Summary */}
            {showButton && (
              <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-2xl p-6 border border-blue-100 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Итого к оплате</p>
                    <p className="text-3xl font-bold text-[#71bcf0]">
                      {(cartTotal > 0 ? cartTotal : getCurrentTotal()).toLocaleString()} смн
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleGoToCart}
                  className="w-full px-8 py-4 bg-gradient-to-r from-[#3d5a80] to-[#2c4360] text-white rounded-xl font-bold text-base hover:from-[#2c4360] hover:to-[#1a2940] active:scale-[0.98] transition-all shadow-lg"
                >
                  Оформить заказ
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Calendar Modal - Centered for Desktop */}
      {showCalendar && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            onClick={() => setShowCalendar(false)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md">
            <div className="bg-white rounded-2xl p-6 shadow-2xl animate-fadeInScale">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => setCalendarMonth(prev => Math.max(0, prev - 1))}
                  className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 active:scale-95 transition-all"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h3 className="font-bold text-gray-900 text-lg">
                  {months[currentMonth]} {currentYear} г.
                </h3>
                <button
                  onClick={() => setCalendarMonth(prev => Math.min(11, prev + 1))}
                  className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 active:scale-95 transition-all"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Week days */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'].map(day => (
                  <div key={day} className="text-center text-xs text-gray-500 font-semibold py-2">
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
                        aspect-square rounded-xl flex items-center justify-center text-sm font-semibold transition-all
                        ${isToday ? 'bg-[#71bcf0] text-white shadow-md' : ''}
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
                className="w-full py-3 bg-gray-100 rounded-xl font-semibold text-gray-700 hover:bg-gray-200 active:scale-98 transition-all"
              >
                Выбрать день
              </button>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: translate(-50%, -48%) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        .animate-fadeInScale {
          animation: fadeInScale 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
