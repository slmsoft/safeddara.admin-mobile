import { ChevronLeft, Clock, Calendar, Wind, Droplets } from 'lucide-react';

interface WeatherPageProps {
  onBack?: () => void;
}

export function WeatherPage({ onBack }: WeatherPageProps) {
  const hourlyWeather = [
    { time: '00', icon: '🌧️', temp: '-6°' },
    { time: '01', icon: '🌧️', temp: '-6°' },
    { time: '02', icon: '🌧️', temp: '-7°' },
    { time: '03', icon: '☁️', temp: '-7°' },
    { time: '04', icon: '☁️', temp: '-7°' },
    { time: '05', icon: '☁️', temp: '-8°' },
    { time: '06', icon: '⛅', temp: '-8°' }
  ];

  const dailyWeather = [
    { day: 'Сегодня', date: '17 Января', icon: '🌫️', min: '-12°', max: '-6°' },
    { day: 'Вс', date: '18 Января', icon: '☁️', min: '-11°', max: '-5°' },
    { day: 'Пн', date: '19 Января', icon: '⛅', min: '-10°', max: '-4°' },
    { day: 'Вт', date: '20 Января', icon: '☀️', min: '-8°', max: '-2°' },
    { day: 'Ср', date: '21 Января', icon: '⛅', min: '-9°', max: '-3°' },
    { day: 'Чт', date: '22 Января', icon: '⛅', min: '-8°', max: '-1°' },
    { day: 'Пт', date: '23 Января', icon: '☁️', min: '-7°', max: '-2°' },
    { day: 'Сб', date: '24 Января', icon: '🌙', min: '-9°', max: '-4°' }
  ];

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-0">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white px-5 py-4 flex items-center gap-3 sticky top-0 z-40 shadow-sm relative">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onBack) {
              onBack();
            }
          }}
          className="transition-all active:scale-95 z-50 relative p-2 -ml-2"
          type="button"
        >
          <ChevronLeft className="w-6 h-6 text-[#71bcf0]" strokeWidth={2.5} />
        </button>
        <h1 className="absolute left-0 right-0 text-center font-semibold text-gray-900 pointer-events-none">Погода</h1>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-8 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onBack && onBack()}
              className="flex items-center justify-center transition-all hover:bg-gray-100 rounded-full p-2"
              type="button"
            >
              <ChevronLeft className="w-7 h-7 text-gray-600" strokeWidth={2} />
            </button>
            <h1 className="text-4xl font-bold text-gray-900">Погода</h1>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden px-5 pt-5 space-y-5">
        {/* Current Weather Card */}
        <div 
          className="rounded-3xl p-8 shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #6B9FD4 0%, #3B5998 100%)'
          }}
        >
          <div className="flex items-center justify-between">
            {/* Weather Icon */}
            <div className="text-8xl">
              ⛅
            </div>

            {/* Temperature */}
            <div className="text-right">
              <div className="text-6xl font-bold text-white mb-2">
                -6°C
              </div>
              <div className="text-white/90 text-lg">
                Сейчас
              </div>
            </div>
          </div>
        </div>

        {/* Hourly Weather */}
        <div className="bg-white rounded-3xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-gray-400" />
            <h2 className="text-gray-700 font-medium">Погода в течение дня</h2>
          </div>

          <div className="flex justify-between items-start">
            {hourlyWeather.map((hour, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <span className="text-sm text-gray-500">{hour.time}</span>
                <span className="text-2xl">{hour.icon}</span>
                <span className="text-sm font-medium text-gray-900">{hour.temp}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 5-Day Forecast */}
        <div className="bg-white rounded-3xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-gray-400" />
            <h2 className="text-gray-700 font-medium">Погода на 5 дней</h2>
          </div>

          <div className="space-y-4">
            {dailyWeather.slice(0, 5).map((day, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between py-2"
                style={{
                  borderBottom: index < 4 ? '1px solid #f3f4f6' : 'none'
                }}
              >
                <div className="flex items-center gap-4 flex-1">
                  <span className="text-gray-600 font-medium w-8">{day.day}</span>
                  <span className="text-3xl">{day.icon}</span>
                </div>

                <div className="flex items-center gap-6">
                  <span className="text-sm text-gray-500">
                    Мин: <span className="text-gray-900 font-medium">{day.min}</span>
                  </span>
                  <span className="text-sm text-gray-500">
                    Макс: <span className="text-gray-900 font-medium">{day.max}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block max-w-[1400px] mx-auto px-8 py-8">
        {/* Top Section: Current Weather (Left) + Hourly (Right) */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Current Weather Card - Left */}
          <div 
            className="rounded-3xl p-8 shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #6B9FD4 0%, #3B5998 100%)'
            }}
          >
            <div className="flex flex-col h-full">
              <div className="text-white/90 text-lg mb-4">Сейчас</div>
              
              <div className="flex items-center justify-between flex-1">
                {/* Weather Icon */}
                <div className="text-9xl">
                  🌙
                </div>

                {/* Temperature and Details */}
                <div className="text-right">
                  <div className="text-7xl font-bold text-white mb-4">
                    -12°C
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-white/90">
                      <Wind className="w-5 h-5" />
                      <span>1.04 м/с</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/90">
                      <Droplets className="w-5 h-5" />
                      <span>100 см</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hourly Weather - Right */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-gray-400" />
              <h2 className="text-gray-700 font-medium text-lg">Погода в течение дня</h2>
            </div>

            <div className="flex justify-between items-start overflow-x-auto">
              {hourlyWeather.map((hour, index) => (
                <div key={index} className="flex flex-col items-center gap-2 flex-shrink-0">
                  <span className="text-sm text-gray-500">{hour.time}</span>
                  <span className="text-3xl">{hour.icon}</span>
                  <span className="text-sm font-medium text-gray-900">{hour.temp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section: 8-Day Forecast */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-gray-400" />
            <h2 className="text-gray-700 font-medium text-lg">Погода на 8 дней</h2>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {dailyWeather.map((day, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="text-sm font-medium text-gray-600 mb-1">{day.day}</div>
                <div className="text-xs text-gray-500 mb-3">{day.date}</div>
                <div className="text-4xl mb-3">{day.icon}</div>
                <div className="text-center">
                  <div className="text-xs text-gray-500">мин. {day.min}С</div>
                  <div className="text-xs text-gray-500">макс. {day.max}С</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}