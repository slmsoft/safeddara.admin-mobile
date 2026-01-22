import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';

interface NotificationsPageProps {
  onBack: () => void;
}

interface Notification {
  id: string;
  date: string;
  message: string;
  image?: string;
}

export function NotificationsPage({ onBack }: NotificationsPageProps) {
  const [notifications] = useState<Notification[]>([
    {
      id: '1',
      date: '06.12.2025',
      message: 'Зимний сезон открыт! Увидимся на склоне.'
    },
    {
      id: '2',
      date: '05.12.2025',
      message: 'Один день до события!'
    },
    {
      id: '3',
      date: '04.12.2025',
      message: 'Save the Date!'
    },
    {
      id: '4',
      date: '26.08.2025',
      message: 'Shymba Morning Rave'
    },
    {
      id: '5',
      date: '30.07.2025',
      message: 'Shymba Morning Rave'
    },
    {
      id: '6',
      date: '28.07.2025',
      message: 'В связи с техническими работами возможны...'
    },
    {
      id: '7',
      date: '31.12.2024',
      message: 'Спасибо за этот год!',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80'
    }
  ]);

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-[402px] mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => onBack && onBack()}
            className="transition-all active:scale-95"
            type="button"
          >
            <ChevronLeft className="w-6 h-6 text-[#71bcf0]" />
          </button>
          <h1 className="font-bold text-gray-900">Уведомления</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-w-[402px] mx-auto px-4 py-6">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <p className="text-sm text-gray-500 text-center">
              Нет уведомлений
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {notifications.map((notification) => (
              <div key={notification.id} className="space-y-2">
                <p className="text-sm text-gray-400">
                  {notification.date}
                </p>
                <p className="text-base text-gray-900 leading-relaxed">
                  {notification.message}
                </p>
                {notification.image && (
                  <div className="mt-3">
                    <img 
                      src={notification.image} 
                      alt="Notification" 
                      className="w-full rounded-2xl object-cover"
                      style={{ maxHeight: '180px' }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}