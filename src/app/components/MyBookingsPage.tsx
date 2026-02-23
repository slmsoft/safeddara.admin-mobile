import { useState, useRef } from 'react';
import { ChevronLeft, Calendar, Clock, Users, CheckCircle2, XCircle, RefreshCw, ChevronRight } from 'lucide-react';
import { ModernHeader } from './ModernHeader';

const PULL_THRESHOLD = 70;
const MAX_PULL = 100;

export interface Booking {
  id: string;
  roomName: string;
  roomImage: string;
  checkIn: string;
  checkOut: string;
  checkInFull?: string;
  checkOutFull?: string;
  guests: number;
  nights: number;
  totalPrice: number;
  status: 'active' | 'completed' | 'cancelled' | 'pending';
  bookingDate: string;
}

interface MyBookingsPageProps {
  bookings: Booking[];
  onBack: () => void;
  onWeatherClick?: () => void;
  onLiveClick?: () => void;
  onBookingClick?: (booking: Booking) => void;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export function MyBookingsPage({ bookings, onBack, onWeatherClick, onLiveClick, onBookingClick, onRefresh, isLoading = false }: MyBookingsPageProps) {
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');
  const [pullOffset, setPullOffset] = useState(0);
  const touchStartY = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!onRefresh || isLoading) return;
    const scrollTop = scrollRef.current?.scrollTop ?? 0;
    if (scrollTop > 0) return;
    const deltaY = e.touches[0].clientY - touchStartY.current;
    if (deltaY > 0) {
      const offset = Math.min(deltaY * 0.5, MAX_PULL);
      setPullOffset(offset);
    }
  };

  const handleTouchEnd = () => {
    if (pullOffset >= PULL_THRESHOLD && onRefresh) {
      onRefresh();
    }
    setPullOffset(0);
  };

  const activeBookings = bookings.filter(b => b.status === 'active' || b.status === 'pending');
  const pastBookings = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatDateShort = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  const getStatusBadge = (status: Booking['status']) => {
    const base = 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium';
    switch (status) {
      case 'pending':
        return (
          <span className={`${base} bg-amber-50 text-amber-700 border border-amber-200/60`}>
            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
            Ожидает оплаты
          </span>
        );
      case 'active':
        return (
          <span className={`${base} bg-emerald-50 text-emerald-700 border border-emerald-200/60`}>
            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
            Активно
          </span>
        );
      case 'completed':
        return (
          <span className={`${base} bg-sky-50 text-sky-700 border border-sky-200/60`}>
            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
            Завершено
          </span>
        );
      case 'cancelled':
        return (
          <span className={`${base} bg-slate-100 text-slate-600 border border-slate-200/60`}>
            <XCircle className="w-3.5 h-3.5 flex-shrink-0" />
            Отменено
          </span>
        );
    }
  };

  const renderBookingCard = (booking: Booking) => (
    <div
      key={booking.id}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-stretch">
        {/* Room Image — без лишнего места, растягивается по высоте карточки */}
        <div className="w-24 lg:w-28 flex-shrink-0 relative overflow-hidden rounded-l-2xl">
          <img
            src={booking.roomImage}
            alt={booking.roomName}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
        </div>

        {/* Booking Info */}
        <div className="flex-1 min-w-0 p-4 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-slate-900 text-[15px] leading-tight line-clamp-2 mb-2">
              {booking.roomName}
            </h3>
            {getStatusBadge(booking.status)}
          </div>

          <div className="space-y-1.5 mt-2">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Calendar className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
              <span>
                {booking.checkInFull && booking.checkOutFull
                  ? `${formatDateTime(booking.checkInFull)} – ${formatDateTime(booking.checkOutFull)}`
                  : `${formatDateShort(booking.checkIn)} – ${formatDateShort(booking.checkOut)}`}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
              <span>{booking.nights} {booking.nights === 1 ? 'ночь' : booking.nights < 5 ? 'ночи' : 'ночей'}</span>
              <span className="text-slate-300">•</span>
              <Users className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
              <span>{booking.guests} {booking.guests === 1 ? 'гость' : 'гостей'}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
            <p className="text-sm font-bold text-[#4a90b8]">Сумма: {booking.totalPrice} <span className="text-slate-500 font-normal">смн</span></p>
            {(booking.status === 'active' || booking.status === 'pending') && (
              <button
                onClick={() => onBookingClick?.(booking)}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-gradient-to-r from-[#5ba8e0] to-[#71bcf0] text-white text-sm font-medium shadow-sm hover:shadow active:scale-[0.98] transition-all"
              >
                Детали
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
            {booking.status === 'completed' && (
              <span className="px-3 py-2 rounded-xl bg-slate-100 text-slate-600 text-sm font-medium">Повторить</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/50">
      <ModernHeader onWeatherClick={onWeatherClick} onLiveClick={onLiveClick} />

      {/* Page Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/80 sticky top-[72px] z-30">
        <div className="max-w-[420px] mx-auto flex items-center justify-between px-4 py-3">
          <button
            onClick={() => onBack?.()}
            className="flex items-center justify-center w-10 h-10 -ml-1 rounded-full hover:bg-slate-100 active:scale-95 transition-all"
            type="button"
            aria-label="Назад"
          >
            <ChevronLeft className="w-6 h-6 text-[#5ba8e0]" strokeWidth={2.5} />
          </button>
          <h1 className="text-lg font-semibold text-slate-800">Мои брони</h1>
          <div className="w-10" />
        </div>

        {/* Tabs */}
        <div className="max-w-[420px] mx-auto px-4 pb-3">
          <div className="flex rounded-xl bg-slate-100/80 p-1">
            <button
              onClick={() => setActiveTab('active')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === 'active'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Активные
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === 'past'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              История
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[420px] mx-auto px-4 py-5 pb-28">
        <div
          ref={scrollRef}
          className="overflow-y-auto overscroll-contain"
          style={{ height: 'calc(100vh - 220px)', touchAction: 'pan-y', minHeight: 200 }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {onRefresh && (
            <div
              className="flex flex-col items-center justify-center overflow-hidden transition-all duration-200"
              style={{
                height: isLoading ? 56 : pullOffset,
                opacity: pullOffset > 0 || isLoading ? 1 : 0,
              }}
            >
              <div className="flex flex-col items-center gap-1.5 py-2">
                <RefreshCw
                  className={`w-6 h-6 text-[#5ba8e0] transition-transform ${pullOffset >= PULL_THRESHOLD && !isLoading ? 'rotate-180' : ''} ${isLoading ? 'animate-spin' : ''}`}
                  strokeWidth={2}
                />
                <span className="text-xs text-slate-500">
                  {isLoading ? 'Обновление...' : pullOffset >= PULL_THRESHOLD ? 'Отпустите' : 'Потяните вниз'}
                </span>
              </div>
            </div>
          )}

          {activeTab === 'active' ? (
            activeBookings.length > 0 ? (
              <div className="space-y-4">
                {activeBookings.map(renderBookingCard)}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center shadow-sm">
                <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
                  <Calendar className="w-10 h-10 text-slate-400" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Нет активных броней</h3>
                <p className="text-sm text-slate-500 leading-relaxed max-w-[240px] mx-auto">
                  Забронируйте жильё в горах — оно появится здесь
                </p>
              </div>
            )
          ) : (
            pastBookings.length > 0 ? (
              <div className="space-y-4">
                {pastBookings.map(renderBookingCard)}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center shadow-sm">
                <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
                  <Clock className="w-10 h-10 text-slate-400" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">История пуста</h3>
                <p className="text-sm text-slate-500 leading-relaxed max-w-[240px] mx-auto">
                  Завершённые бронирования появятся здесь
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}