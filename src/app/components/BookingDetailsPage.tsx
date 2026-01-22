import { ChevronLeft, Calendar, Clock, Users, MapPin, Phone, Mail, CheckCircle2, XCircle, Download } from 'lucide-react';
import { ModernHeader } from './ModernHeader';

interface BookingDetailsPageProps {
  booking: {
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
  };
  onBack: () => void;
  onWeatherClick?: () => void;
  onLiveClick?: () => void;
}

export function BookingDetailsPage({ booking, onBack, onWeatherClick, onLiveClick }: BookingDetailsPageProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  };

  const getStatusBadge = () => {
    switch (booking.status) {
      case 'active':
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100">
            <CheckCircle2 className="w-4 h-4 text-green-700" />
            <span className="text-sm font-medium text-green-700">Активно</span>
          </div>
        );
      case 'completed':
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-100">
            <CheckCircle2 className="w-4 h-4 text-blue-700" />
            <span className="text-sm font-medium text-blue-700">Завершено</span>
          </div>
        );
      case 'cancelled':
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100">
            <XCircle className="w-4 h-4 text-gray-700" />
            <span className="text-sm font-medium text-gray-700">Отменено</span>
          </div>
        );
    }
  };

  const pricePerNight = Math.round(booking.totalPrice / booking.nights);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <ModernHeader onWeatherClick={onWeatherClick} onLiveClick={onLiveClick} />

      {/* Back Button Header */}
      <div className="bg-white border-b border-gray-200 sticky top-[72px] z-30">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => onBack && onBack()}
            className="transition-all active:scale-95 z-10"
            type="button"
          >
            <ChevronLeft className="w-6 h-6 text-[#71bcf0]" />
          </button>
          <h1 className="absolute left-0 right-0 text-center text-base font-semibold text-gray-900 pointer-events-none">Детали бронирования</h1>
        </div>
      </div>

      <div className="max-w-[402px] mx-auto px-4 pt-4 pb-32">
        {/* Booking ID Card */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Номер бронирования</p>
            {getStatusBadge()}
          </div>
          <p className="text-lg font-bold text-gray-900">#{booking.id.toUpperCase()}</p>
          <p className="text-xs text-gray-500 mt-1">
            Создано: {formatDate(booking.bookingDate)}
          </p>
        </div>

        {/* Room Info */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          <div className="h-48 overflow-hidden">
            <img
              src={booking.roomImage}
              alt={booking.roomName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{booking.roomName}</h2>
            
            {/* Location */}
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-[#71bcf0]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Расположение</p>
                <p className="text-sm text-gray-600">Горнолыжный курорт Сафедара</p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
          <h3 className="font-semibold text-gray-900 mb-4">Информация о проживании</h3>
          
          <div className="space-y-4">
            {/* Check-in / Check-out */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="flex-shrink-0">
                <Calendar className="w-5 h-5 text-[#71bcf0]" />
              </div>
              <div className="flex-1 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Заезд</p>
                  <p className="text-sm font-semibold text-gray-900">{formatShortDate(booking.checkIn)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Выезд</p>
                  <p className="text-sm font-semibold text-gray-900">{formatShortDate(booking.checkOut)}</p>
                </div>
              </div>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="flex-shrink-0">
                <Clock className="w-5 h-5 text-[#71bcf0]" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Продолжительность</p>
                <p className="text-sm font-semibold text-gray-900">
                  {booking.nights} {booking.nights === 1 ? 'ночь' : booking.nights < 5 ? 'ночи' : 'ночей'}
                </p>
              </div>
            </div>

            {/* Guests */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="flex-shrink-0">
                <Users className="w-5 h-5 text-[#71bcf0]" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Количество гостей</p>
                <p className="text-sm font-semibold text-gray-900">
                  {booking.guests} {booking.guests === 1 ? 'гость' : booking.guests < 5 ? 'гостя' : 'гостей'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
          <h3 className="font-semibold text-gray-900 mb-4">Детали оплаты</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{pricePerNight} смн × {booking.nights} ночей</span>
              <span className="font-medium text-gray-900">{booking.totalPrice} смн</span>
            </div>
            
            <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
              <span className="font-semibold text-gray-900">Итого</span>
              <span className="text-2xl font-bold text-[#71bcf0]">{booking.totalPrice} смн</span>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400">
          <h3 className="font-semibold text-gray-900 mb-4">Контакты</h3>
          
          <div className="space-y-3">
            <a href="tel:+992000000000" className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Телефон отеля</p>
                <p className="text-sm font-medium text-gray-900">+992 000 000 000</p>
              </div>
            </a>

            <a href="mailto:info@safedar.tj" className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Email</p>
                <p className="text-sm font-medium text-gray-900">info@safedar.tj</p>
              </div>
            </a>
          </div>
        </div>

        {/* Important Info */}
        {booking.status === 'active' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <span className="text-yellow-600">⚠️</span>
              Важная информация
            </h3>
            <ul className="text-sm text-gray-700 space-y-1.5">
              <li>• Заезд с 14:00, выезд до 12:00</li>
              <li>• Бесплатная отмена за 24 часа до заезда</li>
              <li>• При себе иметь документ, удостоверяющий личность</li>
            </ul>
          </div>
        )}
      </div>

      {/* Fixed Bottom Actions */}
      {booking.status === 'active' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40">
          <div className="max-w-[402px] mx-auto grid grid-cols-2 gap-3">
            <button className="py-3 px-4 rounded-2xl border-2 border-gray-200 text-gray-700 font-medium active:scale-95 transition-transform flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />
              Скачать
            </button>
            <button className="py-3 px-4 rounded-2xl bg-red-500 text-white font-medium active:scale-95 transition-transform">
              Отменить бронь
            </button>
          </div>
        </div>
      )}

      {booking.status === 'completed' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40">
          <div className="max-w-[402px] mx-auto">
            <button className="w-full py-4 rounded-2xl bg-[#71bcf0] text-white font-bold active:scale-95 transition-transform">
              Забронировать снова
            </button>
          </div>
        </div>
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