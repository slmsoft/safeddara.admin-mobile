import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, Calendar, Users, Minus, Plus, ChevronRight, Wifi, Coffee, Tv, Wind, ShowerHead, UtensilsCrossed } from 'lucide-react';
import { ModernHeader } from './ModernHeader';
import { backendApi } from '../../api/backendApi';

interface HotelBookingPageProps {
  room: {
    id: string;
    name: string;
    category: string;
    area: number;
    beds: number;
    price: number;
    image: string;
    images?: string[];
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
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [blockedRanges, setBlockedRanges] = useState<Array<{ startDate: string; endDate: string }>>([]);

  useEffect(() => {
    const from = new Date();
    const to = new Date(from.getFullYear() + 1, 11, 31);
    backendApi.getBlockedDates(room.id, from.toISOString().split('T')[0], to.toISOString().split('T')[0])
      .then((res) => {
        if (res.success && res.data?.blockedDates) {
          setBlockedRanges(res.data.blockedDates.map(b => ({ startDate: b.startDate, endDate: b.endDate })));
        }
      })
      .catch(() => setBlockedRanges([]));
  }, [room.id]);

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

  const handleContinue = async () => {
    if (!checkIn || !checkOut || guests <= 0 || !guestName.trim() || !guestEmail.trim()) return;
    const checkInStr = checkIn.toISOString().split('T')[0];
    const checkOutStr = checkOut.toISOString().split('T')[0];
    try {
      const res = await backendApi.checkAvailability(room.id, checkInStr, checkOutStr);
      if (!res.success || !res.data?.available) {
        alert('Выбранные даты недоступны для бронирования. Выберите другие даты.');
        return;
      }
    } catch {
      alert('Не удалось проверить доступность. Попробуйте позже.');
      return;
    }
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
  };

  const canContinue = checkIn && checkOut && guests > 0 && guestName.trim().length > 0 && guestEmail.trim().length > 0;

  // Фото номера: из API или fallback
  const fallbackImages = [
    'https://images.unsplash.com/photo-1611892440504-42a792e24d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    'https://images.unsplash.com/photo-1540518614846-7eded433c457?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  ];
  const roomImages = (room.images && room.images.length > 0)
    ? room.images
    : [room.image, ...fallbackImages];

  const amenities = [
    { icon: Wifi, label: 'Wi-Fi' },
    { icon: Tv, label: 'ТВ' },
    { icon: Wind, label: 'Кондиционер' },
    { icon: Coffee, label: 'Кофе/Чай' },
    { icon: ShowerHead, label: 'Душ' },
    { icon: UtensilsCrossed, label: 'Завтрак' },
  ];

  const remainingCount = roomImages.length > 5 ? roomImages.length - 5 : 0;

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
            {/* Photo Gallery — сетка вместо слайдера */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-6 grid-rows-2 gap-1 p-1">
                {/* Верхний ряд: 2 фото (по 50%) */}
                <button
                  type="button"
                  onClick={() => { setGalleryIndex(0); setGalleryOpen(true); }}
                  className="col-span-3 aspect-[4/3] overflow-hidden rounded-tl-xl cursor-pointer block text-left"
                >
                  <img src={roomImages[0] || room.image} alt={`${room.name} - фото 1`} className="w-full h-full object-cover" />
                </button>
                <button
                  type="button"
                  onClick={() => { setGalleryIndex(1); setGalleryOpen(true); }}
                  className="col-span-3 aspect-[4/3] overflow-hidden rounded-tr-xl cursor-pointer block text-left"
                >
                  <img src={roomImages[1] || room.image} alt={`${room.name} - фото 2`} className="w-full h-full object-cover" />
                </button>
                {/* Нижний ряд: 3 фото (по 33%) */}
                <button
                  type="button"
                  onClick={() => { setGalleryIndex(2); setGalleryOpen(true); }}
                  className="col-span-2 aspect-[4/3] overflow-hidden rounded-bl-xl cursor-pointer block text-left"
                >
                  <img src={roomImages[2] || room.image} alt={`${room.name} - фото 3`} className="w-full h-full object-cover" />
                </button>
                <button
                  type="button"
                  onClick={() => { setGalleryIndex(3); setGalleryOpen(true); }}
                  className="col-span-2 aspect-[4/3] overflow-hidden cursor-pointer block text-left"
                >
                  <img src={roomImages[3] || room.image} alt={`${room.name} - фото 4`} className="w-full h-full object-cover" />
                </button>
                <button
                  type="button"
                  onClick={() => { setGalleryIndex(4); setGalleryOpen(true); }}
                  className="col-span-2 aspect-[4/3] overflow-hidden rounded-br-xl relative cursor-pointer block text-left"
                >
                  <img src={roomImages[4] || room.image} alt={`${room.name} - фото 5`} className="w-full h-full object-cover" />
                  {remainingCount > 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none">
                      <span className="text-2xl font-bold text-white">+{remainingCount}</span>
                    </div>
                  )}
                </button>
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
                  blockedRanges={blockedRanges}
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

            {/* Continue Button - Desktop (скрыт при открытой галерее) */}
            {!galleryOpen && (
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
            )}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button - Mobile Only (скрыт при открытой галерее) */}
      {!galleryOpen && (
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
      )}

      {/* Lightbox — рендер в body, выше всего контента */}
      {galleryOpen && createPortal(
        <ImageGalleryLightbox
          images={roomImages}
          currentIndex={galleryIndex}
          onClose={() => setGalleryOpen(false)}
          onIndexChange={setGalleryIndex}
          roomName={room.name}
        />,
        document.body
      )}

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
      `}</style>
    </div>
  );
}

// Lightbox для полноразмерного просмотра с возможностью слайда
interface ImageGalleryLightboxProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  roomName: string;
}

function ImageGalleryLightbox({ images, currentIndex, onClose, onIndexChange, roomName }: ImageGalleryLightboxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const touchCurrentRef = useRef<{ x: number; y: number } | null>(null);

  const minSwipeDistance = 50;
  const minSwipeDownToClose = 80;

  const goPrev = () => onIndexChange(currentIndex <= 0 ? images.length - 1 : currentIndex - 1);
  const goNext = () => onIndexChange(currentIndex >= images.length - 1 ? 0 : currentIndex + 1);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = { x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY };
    touchCurrentRef.current = { x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY };
  };
  const onTouchMove = (e: React.TouchEvent) => {
    touchCurrentRef.current = { x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY };
  };
  const onTouchEnd = () => {
    const start = touchStartRef.current;
    const end = touchCurrentRef.current;
    touchStartRef.current = null;
    touchCurrentRef.current = null;
    if (!start || !end) return;
    const deltaX = start.x - end.x;
    const deltaY = end.y - start.y; // вниз = положительное
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    // Свайп вниз — закрыть
    if (absY > absX && deltaY > minSwipeDownToClose) {
      onClose();
      return;
    }
    // Свайп влево/вправо — переключить фото
    if (absX > minSwipeDistance) {
      deltaX > 0 ? goNext() : goPrev();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') goPrev();
    if (e.key === 'ArrowRight') goNext();
  };

  useEffect(() => {
    containerRef.current?.focus();
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[99999] bg-black flex flex-col"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-label="Галерея фото. Свайп вниз — закрыть."
      tabIndex={0}
    >
      {/* Счётчик */}
      <div className="absolute top-4 left-4 z-10 px-4 py-2 rounded-full bg-black/50 text-white text-sm font-medium">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Контент: стрелки + изображение */}
      <div className="flex-1 flex items-center justify-center min-h-0 relative">
        <button
          onClick={goPrev}
          className="absolute left-2 lg:left-6 z-10 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors active:scale-95"
          aria-label="Предыдущее фото"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        <div
          className="flex-1 flex items-center justify-center p-4 overflow-hidden"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={images[currentIndex] || images[0]}
            alt={`${roomName} - фото ${currentIndex + 1}`}
            className="max-w-full max-h-[85vh] w-auto h-auto object-contain select-none pointer-events-none"
            draggable={false}
          />
        </div>

        <button
          onClick={goNext}
          className="absolute right-2 lg:right-6 z-10 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors active:scale-95"
          aria-label="Следующее фото"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
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
  blockedRanges?: Array<{ startDate: string; endDate: string }>;
}

function isDateInBlockedRange(date: Date, ranges: Array<{ startDate: string; endDate: string }>): boolean {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  for (const r of ranges) {
    const start = new Date(r.startDate);
    const end = new Date(r.endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    if (d >= start && d < end) return true;
  }
  return false;
}

function CalendarView({ selectedDate, minDate, onDateSelect, checkInDate, checkOutDate, blockedRanges = [] }: CalendarViewProps) {
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
    if (date < minDate) return true;
    return isDateInBlockedRange(date, blockedRanges);
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