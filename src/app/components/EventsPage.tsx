import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { ModernHeader } from './ModernHeader';

interface EventsPageProps {
  onBack?: () => void;
  onWeatherClick?: () => void;
  onLiveClick?: () => void;
}

type FilterType = 'today' | 'week' | 'weekend' | 'month' | 'custom';

export function EventsPage({ onBack, onWeatherClick, onLiveClick }: EventsPageProps) {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('today');
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number>(4);
  const [currentMonth, setCurrentMonth] = useState(0); // January = 0
  const [currentYear, setCurrentYear] = useState(2026);

  const monthNames = [
    'январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
    'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'
  ];

  const weekDays = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Convert Sunday (0) to 6
  };

  const handleFilterClick = (filter: FilterType) => {
    setSelectedFilter(filter);
    if (filter === 'custom') {
      setShowCalendar(true);
    }
  };

  const handleDateSelect = (date: number) => {
    setSelectedDate(date);
  };

  const handleCalendarConfirm = () => {
    setShowCalendar(false);
    setSelectedFilter('custom');
  };

  const handleCalendarReset = () => {
    setShowCalendar(false);
    setSelectedFilter('today');
  };

  const getFilterLabel = () => {
    switch (selectedFilter) {
      case 'today':
        return { title: 'Сегодня', date: '4 января' };
      case 'week':
        return { title: 'На этой неделе', date: '4 - 11 января' };
      case 'weekend':
        return { title: 'На выходных', date: '4 января' };
      case 'month':
        return { title: 'В этом месяце', date: '4 - 31 января' };
      case 'custom':
        return { title: 'На выходных', date: `${selectedDate} января` };
      default:
        return { title: 'Сегодня', date: '4 января' };
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12" />);
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = day === selectedDate;
      const isToday = day === 4; // January 4th is today

      days.push(
        <button
          key={day}
          onClick={() => handleDateSelect(day)}
          className={`
            h-12 rounded-xl flex items-center justify-center font-medium
            transition-all duration-200
            ${isSelected 
              ? 'bg-[#71bcf0] text-white shadow-lg scale-105' 
              : isToday
              ? 'bg-[#e3f2fd] text-[#71bcf0]'
              : 'bg-[#f0f4f8] text-gray-700 hover:bg-[#e3f2fd]'
            }
          `}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const filter = getFilterLabel();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <ModernHeader onWeatherClick={onWeatherClick} onLiveClick={onLiveClick} />

      {/* Desktop container */}
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        {/* Page Title with Back Button */}
        <div className="sticky top-[60px] z-30 bg-white border-b border-gray-200 -mx-4 lg:-mx-8 px-4 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={() => onBack && onBack()}
              className="transition-all active:scale-95 z-10"
              type="button"
            >
              <ChevronLeft className="w-6 h-6 text-[#71bcf0]" />
            </button>
            
            <h1 className="absolute left-0 right-0 text-center text-base font-semibold text-gray-900 pointer-events-none">Мероприятия</h1>
          </div>
        </div>

        {/* Content */}
        <div className="pt-4 pb-20">
          {/* Filter Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => handleFilterClick('today')}
              className={`
                px-3 py-3 rounded-2xl transition-all duration-300
                ${selectedFilter === 'today' || selectedFilter === 'weekend'
                  ? 'bg-white border-2 border-[#71bcf0] shadow-sm'
                  : 'bg-white border border-gray-200'
                }
              `}
            >
              <div className="flex items-start gap-2">
                <div className={`
                  w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0
                  ${selectedFilter === 'today' || selectedFilter === 'weekend'
                    ? 'bg-[#71bcf0]'
                    : 'bg-gray-100'
                  }
                `}>
                  <CalendarIcon className={`w-4 h-4 ${selectedFilter === 'today' || selectedFilter === 'weekend' ? 'text-white' : 'text-gray-400'}`} />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-gray-900 text-sm">{filter.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{filter.date}</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => {
                setShowCalendar(true);
                setSelectedFilter('month');
              }}
              className={`
                px-3 py-3 rounded-2xl transition-all duration-300
                ${selectedFilter === 'week' || selectedFilter === 'month'
                  ? 'bg-white border-2 border-[#71bcf0] shadow-sm'
                  : 'bg-white border border-gray-200'
                }
              `}
            >
              <div className="text-left">
                <div className="font-semibold text-gray-900 text-sm">
                  {selectedFilter === 'month' ? 'В этом месяце' : 'На этой неделе'}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {selectedFilter === 'month' ? '4 - 31 января' : '4 - 11 января'}
                </div>
              </div>
            </button>
          </div>

          {/* Empty State */}
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-gray-400 mb-2">
              <CalendarIcon size={48} strokeWidth={1.5} />
            </div>
            <p className="text-gray-900 font-medium text-lg">Нет мероприятий</p>
          </div>
        </div>
      </div>

      {/* Calendar Modal */}
      {showCalendar && (
        <div className="fixed inset-0 z-50 flex items-end lg:items-center lg:justify-center bg-black/40 animate-in fade-in">
          <div 
            className="w-full lg:w-auto lg:min-w-[500px] bg-white rounded-t-3xl lg:rounded-3xl p-6 animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => {
                  if (currentMonth === 0) {
                    setCurrentMonth(11);
                    setCurrentYear(currentYear - 1);
                  } else {
                    setCurrentMonth(currentMonth - 1);
                  }
                }}
                className="w-10 h-10 rounded-full bg-[#f0f4f8] flex items-center justify-center active:scale-95 transition-transform"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>

              <h2 className="text-lg font-semibold text-gray-900">
                {monthNames[currentMonth]} {currentYear} г.
              </h2>

              <button
                onClick={() => {
                  if (currentMonth === 11) {
                    setCurrentMonth(0);
                    setCurrentYear(currentYear + 1);
                  } else {
                    setCurrentMonth(currentMonth + 1);
                  }
                }}
                className="w-10 h-10 rounded-full bg-[#f0f4f8] flex items-center justify-center active:scale-95 transition-transform"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Week Days */}
            <div className="grid grid-cols-7 gap-2 mb-3">
              {weekDays.map((day) => (
                <div key={day} className="h-8 flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-500 uppercase">{day}</span>
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2 mb-6">
              {renderCalendar()}
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleCalendarConfirm}
                className="w-full py-4 bg-[#2c3e50] text-white rounded-2xl font-medium active:scale-98 transition-transform"
              >
                Выбрать
              </button>
              <button
                onClick={handleCalendarReset}
                className="w-full py-3 text-red-500 font-medium active:opacity-70 transition-opacity"
              >
                Сбросить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}