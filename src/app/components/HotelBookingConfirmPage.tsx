import { ChevronLeft } from 'lucide-react';
import { ModernHeader } from './ModernHeader';
import { BookingData } from './HotelBookingPage';

interface SavedCard {
  id: string;
  cardNumber: string;
  expiry: string;
  cardType: string;
}

interface HotelBookingConfirmPageProps {
  booking: BookingData;
  savedCards: SavedCard[];
  onBack: () => void;
  onConfirmBooking: () => void;
  onWeatherClick?: () => void;
  onLiveClick?: () => void;
}

export function HotelBookingConfirmPage({
  booking,
  savedCards,
  onBack,
  onConfirmBooking,
  onWeatherClick,
  onLiveClick
}: HotelBookingConfirmPageProps) {

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'long'
    });
  };

  const getNightsText = (nights: number) => {
    if (nights === 1) return 'ночь';
    if (nights >= 2 && nights <= 4) return 'ночи';
    return 'ночей';
  };

  const getGuestsText = (guests: number) => {
    if (guests === 1) return 'гость';
    if (guests >= 2 && guests <= 4) return 'гостя';
    return 'гостей';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <ModernHeader onWeatherClick={onWeatherClick} onLiveClick={onLiveClick} />

      {/* Back Button Header */}
      <div className="bg-white sticky top-[72px] z-30 border-b border-gray-100">
        <div className="max-w-[402px] mx-auto flex items-center px-4 sm:px-6 py-4">
          <button
            onClick={() => onBack && onBack()}
            className="transition-all active:scale-95"
            type="button"
          >
            <ChevronLeft className="w-6 h-6 text-[#71bcf0]" />
          </button>
          <h1 className="flex-1 text-center text-lg font-bold text-gray-900 pr-6">Подтверждение</h1>
        </div>
      </div>

      <div className="max-w-[402px] mx-auto px-4 sm:px-6 pt-6 pb-40">
        {/* Room Image */}
        <div className="mb-6">
          <img
            src={booking.room.image}
            alt={booking.room.name}
            className="w-full h-64 rounded-3xl object-cover shadow-lg"
          />
        </div>

        {/* Room Name and Price */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">{booking.room.name}</h2>
          <p className="text-xl text-[#71bcf0] font-bold">
            {booking.room.price.toLocaleString('ru-RU')} смн / ночь
          </p>
        </div>

        {/* Booking Details - Elegant List */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-3xl p-6 mb-6">
          <div className="space-y-5">
            {/* Dates */}
            <div className="flex justify-between items-start border-b border-gray-200 pb-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-2">Даты проживания</p>
                <p className="text-base font-bold text-gray-900">
                  {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[#71bcf0]">{booking.nights}</p>
                <p className="text-xs text-gray-600">{getNightsText(booking.nights)}</p>
              </div>
            </div>

            {/* Guests */}
            <div className="flex justify-between items-center border-b border-gray-200 pb-4">
              <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">Гостей</p>
              <p className="text-base font-bold text-gray-900">
                {booking.guests} {getGuestsText(booking.guests)}
              </p>
            </div>

            {/* Check-in Time */}
            <div className="flex justify-between items-center">
              <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">Заезд</p>
              <p className="text-base font-bold text-gray-900">После 14:00</p>
            </div>
          </div>
        </div>

        {/* Important Info */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-3xl p-5 mb-6 border border-blue-100">
          <p className="text-sm text-gray-700 leading-relaxed">
            <span className="font-bold text-gray-900">Важно:</span> Бронирование можно отменить бесплатно за 24 часа до заезда. При отмене менее чем за 24 часа взимается плата в размере одной ночи.
          </p>
        </div>

        {/* Price Breakdown */}
        <div className="bg-green-50 border-2 border-gray-200 rounded-3xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-5">Детали оплаты</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">
                {booking.room.price.toLocaleString('ru-RU')} × {booking.nights} {getNightsText(booking.nights)}
              </span>
              <span className="font-bold text-gray-900 text-lg">
                {(booking.room.price * booking.nights).toLocaleString('ru-RU')} смн
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Сервисный сбор</span>
              <span className="font-bold text-gray-900 text-lg">0 смн</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] lg:px-6">
        <div className="max-w-[402px] mx-auto px-6 lg:px-0 py-5">
          <div className="flex items-center justify-between gap-4">
            {/* Left Side - Total Amount */}
            <div>
              <p className="text-sm text-gray-600 mb-1">Итого</p>
              <p className="text-2xl font-bold text-gray-900">
                {booking.totalPrice.toLocaleString('ru-RU')} смн
              </p>
            </div>
            
            {/* Right Side - Payment Button */}
            <button
              onClick={() => onConfirmBooking && onConfirmBooking()}
              className="px-10 py-3 rounded-xl font-semibold text-base bg-[#10b981] hover:bg-[#059669] text-white active:scale-[0.98] transition-all shadow-md"
              type="button"
            >
              Оплатить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}