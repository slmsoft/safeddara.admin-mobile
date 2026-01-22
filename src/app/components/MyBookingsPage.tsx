import { useState } from 'react';
import { ChevronLeft, Calendar, Clock, MapPin, Users, CheckCircle2, XCircle } from 'lucide-react';
import { ModernHeader } from './ModernHeader';

export interface Booking {
  id: string;
  roomName: string;
  roomImage: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  totalPrice: number;
  status: 'active' | 'completed' | 'cancelled';
  bookingDate: string;
}

interface MyBookingsPageProps {
  bookings: Booking[];
  onBack: () => void;
  onWeatherClick?: () => void;
  onLiveClick?: () => void;
  onBookingClick?: (booking: Booking) => void;
}

export function MyBookingsPage({ bookings, onBack, onWeatherClick, onLiveClick, onBookingClick }: MyBookingsPageProps) {
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');

  const activeBookings = bookings.filter(b => b.status === 'active');
  const pastBookings = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Активно
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Завершено
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
            <XCircle className="w-3.5 h-3.5" />
            Отменено
          </span>
        );
    }
  };

  const renderBookingCard = (booking: Booking) => (
    <div key={booking.id} className="bg-white rounded-2xl shadow-sm overflow-hidden mb-3">
      <div className="flex gap-3 p-3">
        {/* Room Image */}
        <div className="w-24 h-24 flex-shrink-0">
          <img
            src={booking.roomImage}
            alt={booking.roomName}
            className="w-full h-full rounded-xl object-cover"
          />
        </div>

        {/* Booking Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1.5">
            <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
              {booking.roomName}
            </h3>
            {getStatusBadge(booking.status)}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">
                {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <Clock className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{booking.nights} ночей</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <Users className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{booking.guests} гостей</span>
            </div>
          </div>
        </div>
      </div>

      {/* Price & Action */}
      <div className="border-t border-gray-100 px-3 py-2.5 flex items-center justify-between">
        <div className="flex-shrink-0 text-right">
          <p className="text-xs text-gray-500 mb-0.5">Общая сумма</p>
          <p className="font-bold text-[#71bcf0]">
            {booking.totalPrice} <span className="text-xs font-normal text-gray-500">смн</span>
          </p>
        </div>
        {booking.status === 'active' && (
          <button 
            onClick={() => onBookingClick?.(booking)}
            className="px-4 py-2 rounded-xl bg-[#71bcf0] text-white text-sm font-medium active:scale-95 transition-transform"
          >
            Детали
          </button>
        )}
        {booking.status === 'completed' && (
          <button className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm font-medium active:scale-95 transition-transform">
            Повторить
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <ModernHeader onWeatherClick={onWeatherClick} onLiveClick={onLiveClick} />

      {/* Back Button Header */}
      <div className="bg-white border-b border-gray-200 sticky top-[72px] z-30">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => onBack && onBack()}
            className="transition-all active:scale-95"
            type="button"
          >
            <ChevronLeft className="w-6 h-6 text-[#71bcf0]" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Мои брони</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-[402px] mx-auto px-4 pt-4 pb-6">
        {/* Tabs - Segmented Control */}
        <div className="bg-gray-100 rounded-full p-1 flex gap-1 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-2.5 px-4 rounded-full text-sm font-semibold transition-all ${
              activeTab === 'active'
                ? 'bg-[#71bcf0] text-white shadow-sm'
                : 'bg-transparent text-gray-600'
            }`}
          >
            Активные
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`flex-1 py-2.5 px-4 rounded-full text-sm font-semibold transition-all ${
              activeTab === 'past'
                ? 'bg-[#71bcf0] text-white shadow-sm'
                : 'bg-transparent text-gray-600'
            }`}
          >
            История
          </button>
        </div>

        {/* Bookings List */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          {activeTab === 'active' ? (
            activeBookings.length > 0 ? (
              <div className="space-y-3">
                {activeBookings.map(renderBookingCard)}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Нет активных броней</h3>
                <p className="text-sm text-gray-600">
                  У вас пока нет активных бронирований
                </p>
              </div>
            )
          ) : (
            pastBookings.length > 0 ? (
              <div className="space-y-3">
                {pastBookings.map(renderBookingCard)}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Clock className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Нет прошлых броней</h3>
                <p className="text-sm text-gray-600">
                  История ваших бронирований появится здесь
                </p>
              </div>
            )
          )}
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
      `}</style>
    </div>
  );
}