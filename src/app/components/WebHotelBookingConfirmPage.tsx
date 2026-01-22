import { ChevronLeft } from 'lucide-react';
import { WebFooter } from './WebFooter';
import { BookingData } from './HotelBookingPage';

interface WebHotelBookingConfirmPageProps {
  booking: BookingData;
  onBack: () => void;
  onConfirmBooking: () => void;
  onWeatherClick?: () => void;
  onLiveClick?: () => void;
}

export function WebHotelBookingConfirmPage({
  booking,
  onBack,
  onConfirmBooking,
  onWeatherClick,
  onLiveClick
}: WebHotelBookingConfirmPageProps) {

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Page Header - Without WebHeader to avoid duplication */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="flex items-center gap-3 py-8">
            <button
              onClick={onBack}
              className="flex items-center justify-center text-gray-600 hover:text-[#71bcf0] transition-colors"
            >
              <ChevronLeft className="w-7 h-7" strokeWidth={2} />
            </button>
            <h1 className="text-4xl font-bold text-gray-900">Подтверждение бронирования</h1>
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="flex-1 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-8 py-12">
          <div className="grid grid-cols-3 gap-8">
            {/* Left Column - 2/3 width - Booking Details */}
            <div className="col-span-2 space-y-6">
              {/* Room Image */}
              <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
                <img
                  src={booking.room.image}
                  alt={booking.room.name}
                  className="w-full h-[400px] object-cover"
                />
              </div>

              {/* Room Info */}
              <div className="bg-white rounded-3xl p-8 shadow-sm">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">{booking.room.name}</h2>
                <p className="text-2xl text-[#71bcf0] font-bold">
                  {booking.room.price.toLocaleString('ru-RU')} смн / ночь
                </p>
              </div>

              {/* Booking Details */}
              <div className="bg-white rounded-3xl p-8 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Детали бронирования</h3>
                
                <div className="space-y-6">
                  {/* Dates */}
                  <div className="flex justify-between items-start pb-6 border-b border-gray-200">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-2">
                        Даты проживания
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-4xl font-bold text-[#71bcf0]">{booking.nights}</p>
                      <p className="text-sm text-gray-600">{getNightsText(booking.nights)}</p>
                    </div>
                  </div>

                  {/* Guests */}
                  <div className="flex justify-between items-center pb-6 border-b border-gray-200">
                    <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">
                      Количество гостей
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {booking.guests} {getGuestsText(booking.guests)}
                    </p>
                  </div>

                  {/* Check-in Time */}
                  <div className="flex justify-between items-center">
                    <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">
                      Время заезда
                    </p>
                    <p className="text-lg font-bold text-gray-900">После 14:00</p>
                  </div>
                </div>
              </div>

              {/* Cancellation Policy */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-3xl p-8 border border-blue-100">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Условия отмены</h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  Бронирование можно отменить бесплатно за 24 часа до заезда. 
                  При отмене менее чем за 24 часа взимается плата в размере одной ночи.
                </p>
              </div>
            </div>

            {/* Right Column - 1/3 width - Payment Summary */}
            <div className="col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Price Breakdown */}
                <div className="bg-white rounded-3xl p-8 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Детали оплаты</h3>
                  
                  <div className="space-y-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-700 font-medium mb-1">
                          {booking.room.price.toLocaleString('ru-RU')} смн × {booking.nights} {getNightsText(booking.nights)}
                        </p>
                        <p className="text-sm text-gray-500">Стоимость проживания</p>
                      </div>
                      <p className="font-bold text-gray-900 text-lg">
                        {(booking.room.price * booking.nights).toLocaleString('ru-RU')} смн
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                      <span className="text-gray-700 font-medium">Сервисный сбор</span>
                      <span className="font-bold text-gray-900 text-lg">0 смн</span>
                    </div>

                    {/* Total */}
                    <div className="pt-6 mt-6 border-t-2 border-gray-900">
                      <div className="flex justify-between items-center">
                        <p className="text-lg font-bold text-gray-900">Итого к оплате</p>
                        <p className="text-3xl font-bold text-[#71bcf0]">
                          {booking.totalPrice.toLocaleString('ru-RU')} смн
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Button */}
                <button
                  onClick={onConfirmBooking}
                  className="w-full py-5 rounded-2xl font-bold text-xl bg-[#10b981] hover:bg-[#059669] text-white transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
                >
                  Перейти к оплате
                </button>

                {/* Security Note */}
                <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <div>
                      <p className="font-bold text-gray-900 text-sm mb-1">Безопасная оплата</p>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Ваши данные защищены. Оплата производится через защищенное соединение.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <WebFooter />
    </div>
  );
}