import { useState } from 'react';
import { ChevronLeft, Calendar, Users, Minus, Plus, ChevronRight, Wifi, Coffee, Tv, Wind, ShowerHead, UtensilsCrossed } from 'lucide-react';
import { ModernHeader } from './ModernHeader';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface HotelBookingPageProps {
  room: {
    id: string;
    name: string;
    category: string;
    area: number;
    beds: number;
    price: number;
    image: string;
  };
  onBack: () => void;
  onContinue: (booking: BookingData) => void;
  onWeatherClick?: () => void;
  onLiveClick?: () => void;
}

export interface BookingData {
  room: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  checkIn: Date;
  checkOut: Date;
  guests: number;
  nights: number;
  totalPrice: number;
  guestName: string;
  guestEmail: string;
}

export function HotelBookingPage({ room, onBack, onContinue, onWeatherClick, onLiveClick }: HotelBookingPageProps) {
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState(1);
  const [isSelectingCheckIn, setIsSelectingCheckIn] = useState(true);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Рассчитываем количество ночей и общую стоимость
  const nights = checkIn && checkOut ? Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const totalPrice = nights * room.price;

  const handleDateSelect = (date: Date) => {
    if (isSelectingCheckIn) {
      setCheckIn(date);
      setCheckOut(null);
      setIsSelectingCheckIn(false);
    } else {
      if (checkIn && date > checkIn) {
        setCheckOut(date);
      }
    }
  };

  const handleContinue = () => {
    if (checkIn && checkOut && guests > 0 && guestName.trim() && guestEmail.trim()) {
      onContinue({
        room: {
          id: room.id,
          name: room.name,
          price: room.price,
          image: room.image
        },
        checkIn,
        checkOut,
        guests,
        nights,
        totalPrice,
        guestName: guestName.trim(),
        guestEmail: guestEmail.trim()
      });
    }
  };

  const canContinue = checkIn && checkOut && guests > 0 && guestName.trim().length > 0 && guestEmail.trim().length > 0;

  // Gallery images for the room
  const roomImages = [
    room.image,
    'https://images.unsplash.com/photo-1611892440504-42a792e24d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    'https://images.unsplash.com/photo-1540518614846-7eded433c457?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  ];

  const amenities = [
    { icon: Wifi, label: 'Wi-Fi' },
    { icon: Tv, label: 'ТВ' },
    { icon: Wind, label: 'Кондиционер' },
    { icon: Coffee, label: 'Кофе/Чай' },
    { icon: ShowerHead, label: 'Душ' },
    { icon: UtensilsCrossed, label: 'Завтрак' },
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    arrows: false,
    dotsClass: 'slick-dots custom-dots',
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-8">
      {/* Header */}
      <ModernHeader onWeatherClick={onWeatherClick} onLiveClick={onLiveClick} />

      {/* Back Button Header */}
      <div className="bg-white">
        {/* Mobile Header */}
        <div className="lg:hidden border-b border-gray-200 sticky top-[72px] z-30">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => onBack && onBack()}
              className="transition-all active:scale-95 z-10"
              type="button"
            >
              <ChevronLeft className="w-6 h-6 text-[#71bcf0]" />
            </button>
            <h1 className="absolute left-0 right-0 text-center text-base font-semibold text-gray-900 pointer-events-none">Бронирование</h1>
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
              <h1 className="text-4xl font-bold text-gray-900">Бронирование</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content - Mobile: Single Column, Desktop: Two Columns */}
      <div className="max-w-[402px] lg:max-w-[1400px] mx-auto px-4 lg:px-8 pt-4 lg:pt-8 pb-32 lg:pb-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          
          {/* Left Column - Room Details */}
          <div className="space-y-4">
            {/* Photo Gallery */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="room-gallery">
                <Slider {...sliderSettings}>
                  {roomImages.map((image, index) => (
                    <div key={index} className="slider-item">
                      <div className="h-64 lg:h-96 w-full">
                        <img
                          src={image}
                          alt={`${room.name} - фото ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
              
              {/* Room Details */}
              <div className="p-4 lg:p-6">
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">{room.name}</h2>
                
                {/* Room Stats */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <span className="text-sm font-medium">{room.area} м²</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <span className="text-sm font-medium">До {room.beds} гостей</span>
                  </div>
                </div>

                {/* Amenities */}
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Удобства</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {amenities.map((amenity, index) => {
                      const Icon = amenity.icon;
                      return (
                        <div key={index} className="flex flex-col items-center gap-1.5 bg-gray-50 rounded-xl p-2">
                          <Icon className="w-5 h-5 text-[#71bcf0]" />
                          <span className="text-xs text-gray-600 text-center">{amenity.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Описание</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Уютный номер с современным дизайном и всеми необходимыми удобствами. 
                    Идеально подходит для комфортного отдыха в горах. Из окон открывается 
                    красивый вид на горы.
                  </p>
                </div>

                {/* Price */}
                <div className="bg-gradient-to-r from-[#71bcf0]/10 to-[#5aa8dc]/10 rounded-2xl p-4">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Цена за ночь</p>
                      <p className="text-3xl font-bold text-[#71bcf0]">
                        {room.price} <span className="text-sm font-medium text-gray-500">смн</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">НДС включен</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Form */}
          <div className="space-y-4 lg:mt-0 mt-4">
            {/* Date Selection */}
            <div className="bg-white rounded-2xl shadow-sm p-4 lg:p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#71bcf0]" />
                Выберите даты
              </h2>

              {/* Date Selection Tabs */}
              <div className="bg-gray-100 rounded-full p-1 flex gap-1">
                <button
                  onClick={() => setIsSelectingCheckIn(true)}
                  className={`flex-1 py-2.5 px-4 rounded-full text-sm font-semibold transition-all ${
                    isSelectingCheckIn
                      ? 'bg-[#71bcf0] text-white shadow-sm'
                      : 'bg-transparent text-gray-600'
                  }`}
                >
                  Заезд
                </button>
                <button
                  onClick={() => {
                    if (checkIn) setIsSelectingCheckIn(false);
                  }}
                  className={`flex-1 py-2.5 px-4 rounded-full text-sm font-semibold transition-all ${
                    !isSelectingCheckIn && checkIn
                      ? 'bg-[#71bcf0] text-white shadow-sm'
                      : 'bg-transparent text-gray-600'
                  }`}
                  disabled={!checkIn}
                >
                  Выезд
                </button>
              </div>

              {/* Selected Dates Display */}
              {(checkIn || checkOut) && (
                <div className="flex gap-3 mt-3">
                  {checkIn && (
                    <div className="flex-1 bg-blue-50 rounded-xl p-3 text-center">
                      <div className="text-xs text-gray-600 mb-1">Заезд</div>
                      <div className="text-sm font-bold text-[#71bcf0]">
                        {checkIn.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                  )}
                  {checkOut && (
                    <div className="flex-1 bg-blue-50 rounded-xl p-3 text-center">
                      <div className="text-xs text-gray-600 mb-1">Выезд</div>
                      <div className="text-sm font-bold text-[#71bcf0]">
                        {checkOut.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Calendar */}
              <div className="mt-4">
                <CalendarView
                  selectedDate={isSelectingCheckIn ? checkIn : checkOut}
                  minDate={isSelectingCheckIn ? today : checkIn || today}
                  onDateSelect={handleDateSelect}
                  checkInDate={checkIn}
                  checkOutDate={checkOut}
                />
              </div>

              {/* Nights Display */}
              {nights > 0 && (
                <div className="mt-4 bg-blue-50 rounded-xl p-3 text-center">
                  <p className="text-sm text-gray-700">
                    Количество ночей: <span className="font-bold text-[#71bcf0]">{nights}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Guests Selection */}
            <div className="bg-white rounded-2xl shadow-sm p-4 lg:p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#71bcf0]" />
                Количество гостей
              </h2>

              <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4 mb-4">
                <div>
                  <p className="font-semibold text-gray-900">Гости</p>
                  <p className="text-sm text-gray-600">Максимум {room.beds} человек</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    disabled={guests <= 1}
                    className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4 text-gray-700" />
                  </button>
                  <span className="text-lg font-bold text-gray-900 w-8 text-center">{guests}</span>
                  <button
                    onClick={() => setGuests(Math.min(room.beds, guests + 1))}
                    disabled={guests >= room.beds}
                    className="w-10 h-10 rounded-full bg-[#71bcf0] flex items-center justify-center active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Guest Name Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Имя гостя
                </label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Введите ваше имя"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#71bcf0] focus:border-transparent transition-all"
                />
              </div>
              {/* Guest Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="example@mail.com"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#71bcf0] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Price Summary */}
            {nights > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-4 lg:p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
                <h2 className="font-semibold text-gray-900 mb-4">Детали бронирования</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{room.price} смн × {nights} ночей</span>
                    <span className="font-semibold text-gray-900">{room.price * nights} смн</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">Итого</span>
                      <span className="text-2xl font-bold text-[#71bcf0]">{totalPrice} смн</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Continue Button - Desktop */}
            <div className="hidden lg:block">
              <button
                onClick={handleContinue}
                disabled={!canContinue}
                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
                  canContinue
                    ? 'bg-[#71bcf0] text-white hover:bg-[#5aa8dc] shadow-lg'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Продолжить
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button - Mobile Only */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 z-40">
        <div className="max-w-[402px] mx-auto">
          <button
            onClick={handleContinue}
            disabled={!canContinue}
            className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
              canContinue
                ? 'bg-[#71bcf0] text-white active:scale-95 shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Продолжить
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-in-from-bottom-4 {
          from { transform: translateY(16px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-in {
          animation-fill-mode: both;
        }
        
        /* Slider Styles */
        .room-gallery .slick-slider {
          position: relative;
        }
        
        .room-gallery .slick-dots {
          bottom: 15px;
          z-index: 10;
        }
        
        .room-gallery .slick-dots li {
          margin: 0 3px;
        }
        
        .room-gallery .slick-dots li button:before {
          font-size: 10px;
          color: white;
          opacity: 0.5;
        }
        
        .room-gallery .slick-dots li.slick-active button:before {
          opacity: 1;
          color: #71bcf0;
        }
        
        .slider-item {
          outline: none;
        }
      `}</style>
    </div>
  );
}

// Calendar Component
interface CalendarViewProps {
  selectedDate: Date | null;
  minDate: Date;
  onDateSelect: (date: Date) => void;
  checkInDate: Date | null;
  checkOutDate: Date | null;
}

function CalendarView({ selectedDate, minDate, onDateSelect, checkInDate, checkOutDate }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const isDateDisabled = (date: Date) => {
    return date < minDate;
  };

  const isDateInRange = (date: Date) => {
    if (!checkInDate || !checkOutDate) return false;
    return date > checkInDate && date < checkOutDate;
  };

  const isDateSelected = (date: Date) => {
    if (checkInDate && date.getTime() === checkInDate.getTime()) return true;
    if (checkOutDate && date.getTime() === checkOutDate.getTime()) return true;
    return false;
  };

  const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
  const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  return (
    <div>
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center active:scale-95 transition-all"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h3 className="font-semibold text-gray-900">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button
          onClick={nextMonth}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center active:scale-95 transition-all"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: adjustedFirstDay }).map((_, index) => (
          <div key={`empty-${index}`} />
        ))}
        
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
          date.setHours(0, 0, 0, 0);
          
          const disabled = isDateDisabled(date);
          const selected = isDateSelected(date);
          const inRange = isDateInRange(date);

          return (
            <button
              key={day}
              onClick={() => !disabled && onDateSelect(date)}
              disabled={disabled}
              className={`
                aspect-square rounded-lg text-sm font-medium transition-all
                ${disabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}
                ${selected ? 'bg-[#71bcf0] text-white hover:bg-[#5aa8dc]' : ''}
                ${inRange ? 'bg-blue-50' : ''}
                ${!disabled && !selected ? 'active:scale-95' : ''}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}