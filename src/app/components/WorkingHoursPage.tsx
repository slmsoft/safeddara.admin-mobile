import { ChevronLeft, Clock } from 'lucide-react';
import { ModernHeader } from './ModernHeader';

interface WorkingHoursPageProps {
  onWeatherClick?: () => void;
  onLiveClick?: () => void;
  onBack?: () => void;
}

export function WorkingHoursPage({ onWeatherClick, onLiveClick, onBack }: WorkingHoursPageProps) {
  const weekSchedule = [
    { day: 'Понедельник', abbr: 'ПН', time: '08:00-00:00' },
    { day: 'Вторник', abbr: 'ВТ', time: '08:00-00:00' },
    { day: 'Среда', abbr: 'СР', time: '08:00-00:00' },
    { day: 'Четверг', abbr: 'ЧТ', time: '08:00-00:00' },
    { day: 'Пятница', abbr: 'ПТ', time: '08:00-00:00' },
    { day: 'Суббота', abbr: 'СБ', time: '08:00-00:00' },
    { day: 'Воскресенье', abbr: 'ВС', time: '08:00-00:00' }
  ];

  // Получаем текущий день недели (0 = воскресенье, 1 = понедельник, и т.д.)
  const today = new Date().getDay();
  const todayIndex = today === 0 ? 6 : today - 1; // Преобразуем к нашему формату (0 = понедельник)

  return (
    <div className="min-h-screen bg-white">
      <ModernHeader onWeatherClick={onWeatherClick} onLiveClick={onLiveClick} />
      
      {/* Header */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => onBack && onBack()}
            className="transition-all active:scale-95"
            type="button"
          >
            <ChevronLeft className="w-6 h-6 text-[#71bcf0]" />
          </button>
          
          <h1 className="text-lg font-semibold text-gray-900">Режим работы</h1>
          
          <div className="w-10" />
        </div>

        {/* Weekly Schedule */}
        <div className="space-y-3">
          {weekSchedule.map((item, index) => (
            <div
              key={item.day}
              className={`flex items-center gap-4 px-4 py-4 rounded-2xl ${
                index === todayIndex ? 'bg-blue-50' : 'bg-gray-50'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                index === todayIndex
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                  : 'bg-white text-gray-600'
              }`}>
                {item.abbr}
              </div>
              
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{item.day}</div>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="font-semibold text-gray-900">{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}