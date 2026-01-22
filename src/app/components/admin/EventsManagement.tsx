import { useState, useEffect, useCallback } from 'react';
import { Search, CalendarDays, Users, MapPin, Edit2, Trash2, Eye, Plus, Save, X } from 'lucide-react';
import { Modal } from './Modal';

interface Event {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  participants: number;
  image: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  description?: string;
}

export function EventsManagement() {
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Чемпионат по сноубордингу',
      category: 'Спорт',
      date: '20 янв 2026',
      location: 'Склон №2',
      participants: 45,
      image: 'https://images.unsplash.com/photo-1519315901367-a16c76c64e46?w=800',
      status: 'upcoming',
      description: 'Описание события...'
    },
    {
      id: '2',
      title: 'Новогодний фейерверк',
      category: 'Развлечения',
      date: '31 дек 2025',
      location: 'Центральная площадь',
      participants: 320,
      image: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=800',
      status: 'completed',
      description: 'Описание события...'
    },
    {
      id: '3',
      title: 'Мастер-класс по фристайлу',
      category: 'Обучение',
      date: '15 янв 2026',
      location: 'Сноу-парк',
      participants: 28,
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800',
      status: 'ongoing',
      description: 'Описание события...'
    },
    {
      id: '4',
      title: 'Детский фестиваль',
      category: 'Развлечения',
      date: '25 янв 2026',
      location: 'Детская зона',
      participants: 67,
      image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800',
      status: 'upcoming',
      description: 'Описание события...'
    },
    {
      id: '5',
      title: 'Йога на снегу',
      category: 'Wellness',
      date: '18 янв 2026',
      location: 'Терраса отеля',
      participants: 15,
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
      status: 'upcoming',
      description: 'Описание события...'
    },
    {
      id: '6',
      title: 'Концерт народной музыки',
      category: 'Культура',
      date: '22 янв 2026',
      location: 'Ресторан',
      participants: 89,
      image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800',
      status: 'upcoming',
      description: 'Описание события...'
    },
    {
      id: '7',
      title: 'Вечер барбекю',
      category: 'Гастрономия',
      date: '16 янв 2026',
      location: 'Открытая терраса',
      participants: 52,
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
      status: 'ongoing',
      description: 'Описание события...'
    },
    {
      id: '8',
      title: 'Фотоконкурс "Зимние краски"',
      category: 'Конкурс',
      date: '30 янв 2026',
      location: 'Онлайн',
      participants: 134,
      image: 'https://images.unsplash.com/photo-1486673748761-cdb2f0f5314c?w=800',
      status: 'upcoming',
      description: 'Описание события...'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [viewingEvent, setViewingEvent] = useState<Event | null>(null);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || event.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const upcomingCount = events.filter(e => e.status === 'upcoming').length;
  const ongoingCount = events.filter(e => e.status === 'ongoing').length;
  const totalParticipants = events.reduce((sum, e) => sum + e.participants, 0);

  const stats = [
    { label: 'Всего событий', value: events.length.toString(), color: 'bg-purple-500', icon: '📅' },
    { label: 'Предстоящие', value: upcomingCount.toString(), color: 'bg-blue-500', icon: '🔜' },
    { label: 'Идут сейчас', value: ongoingCount.toString(), color: 'bg-green-500', icon: '▶️' },
    { label: 'Участников', value: totalParticipants.toString(), color: 'bg-orange-500', icon: '👥' }
  ];

  const getStatusBadge = (status: string) => {
    const badges = {
      upcoming: { label: 'Предстоящее', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
      ongoing: { label: 'Идёт сейчас', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
      completed: { label: 'Завершено', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' }
    };
    return badges[status as keyof typeof badges] || badges.upcoming;
  };

  const handleAddEvent = useCallback(() => {
    const newEvent: Event = {
      id: Date.now().toString(),
      title: '',
      category: 'Спорт',
      date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' }),
      location: '',
      participants: 0,
      image: 'https://images.unsplash.com/photo-1519315901367-a16c76c64e46?w=800',
      status: 'upcoming',
      description: ''
    };
    setEditingEvent(newEvent);
    setIsModalOpen(true);
  }, []);

  // Экспортируем функцию для использования из заголовка
  useEffect(() => {
    (window as any).__eventsAddHandler = handleAddEvent;
    return () => {
      delete (window as any).__eventsAddHandler;
    };
  }, [handleAddEvent]);

  const handleEditEvent = (event: Event) => {
    setEditingEvent({ ...event });
    setIsModalOpen(true);
  };

  const handleViewEvent = (event: Event) => {
    setViewingEvent(event);
    setIsViewModalOpen(true);
  };

  const handleSaveEvent = () => {
    if (!editingEvent) return;
    
    if (!editingEvent.title || !editingEvent.location) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    if (editingEvent.id && events.find(e => e.id === editingEvent.id)) {
      setEvents(events.map(e => e.id === editingEvent.id ? editingEvent : e));
    } else {
      setEvents([...events, editingEvent]);
    }
    
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить это событие?')) {
      setEvents(events.filter(e => e.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">{stat.icon}</span>
              <div className={`${stat.color} w-2 h-2 rounded-full`}></div>
            </div>
            <p className="text-gray-400 text-xs mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-200">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск событий..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg pl-10 pr-4 py-2 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-blue-500"
          >
            <option value="all">Все статусы</option>
            <option value="upcoming">Предстоящие</option>
            <option value="ongoing">Идут сейчас</option>
            <option value="completed">Завершённые</option>
          </select>
          <button
            onClick={handleAddEvent}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Добавить событие
          </button>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-4 gap-4">
        {filteredEvents.map((event) => {
          const statusBadge = getStatusBadge(event.status);
          return (
            <div
              key={event.id}
              className="bg-[#161b2e] border border-[#1e2537] rounded-xl overflow-hidden hover:border-blue-500/50 transition-all group"
            >
              {/* Image */}
              <div className="relative h-40 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-medium border ${statusBadge.color}`}>
                  {statusBadge.label}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="mb-3">
                  <h3 className="text-sm font-semibold text-gray-200 mb-1 line-clamp-2">{event.title}</h3>
                  <p className="text-xs text-purple-400">{event.category}</p>
                </div>

                <div className="space-y-2 mb-3 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <CalendarDays className="w-3 h-3" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{event.participants} участников</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-[#1e2537]">
                  <button 
                    onClick={() => handleViewEvent(event)}
                    className="flex-1 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-400 text-xs py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    Просмотр
                  </button>
                  <button 
                    onClick={() => handleEditEvent(event)}
                    className="bg-[#0d1117] hover:bg-[#1e2537] border border-[#1e2537] text-gray-400 p-2 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={() => handleDeleteEvent(event.id)}
                    className="bg-[#0d1117] hover:bg-red-500/10 border border-[#1e2537] hover:border-red-500/30 text-gray-400 hover:text-red-400 p-2 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          Показано 1-{filteredEvents.length} из {events.length}
        </p>
        <div className="flex gap-2">
          <button disabled className="px-3 py-1.5 bg-[#161b2e] border border-[#1e2537] text-gray-500 rounded-lg text-sm cursor-not-allowed">
            Назад
          </button>
          <button className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors">
            1
          </button>
          <button disabled className="px-3 py-1.5 bg-[#161b2e] border border-[#1e2537] text-gray-500 rounded-lg text-sm cursor-not-allowed">
            Далее
          </button>
        </div>
      </div>

      {/* Add/Edit Event Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEvent(null);
        }}
        title={editingEvent?.id && events.find(e => e.id === editingEvent.id) ? 'Редактировать событие' : 'Добавить событие'}
        size="xl"
      >
        {editingEvent && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Название события *
              </label>
              <input
                type="text"
                value={editingEvent.title}
                onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                placeholder="Введите название"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Категория
                </label>
                <select
                  value={editingEvent.category}
                  onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value })}
                  className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="Спорт">Спорт</option>
                  <option value="Развлечения">Развлечения</option>
                  <option value="Обучение">Обучение</option>
                  <option value="Wellness">Wellness</option>
                  <option value="Культура">Культура</option>
                  <option value="Гастрономия">Гастрономия</option>
                  <option value="Конкурс">Конкурс</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Статус
                </label>
                <select
                  value={editingEvent.status}
                  onChange={(e) => setEditingEvent({ ...editingEvent, status: e.target.value as Event['status'] })}
                  className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="upcoming">Предстоящее</option>
                  <option value="ongoing">Идёт сейчас</option>
                  <option value="completed">Завершено</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Дата *
                </label>
                <input
                  type="text"
                  value={editingEvent.date}
                  onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                  className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                  placeholder="20 янв 2026"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Локация *
                </label>
                <input
                  type="text"
                  value={editingEvent.location}
                  onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                  className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                  placeholder="Место проведения"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Количество участников
              </label>
              <input
                type="number"
                min="0"
                value={editingEvent.participants}
                onChange={(e) => setEditingEvent({ ...editingEvent, participants: parseInt(e.target.value) || 0 })}
                className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                URL изображения
              </label>
              <input
                type="text"
                value={editingEvent.image}
                onChange={(e) => setEditingEvent({ ...editingEvent, image: e.target.value })}
                className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                placeholder="https://..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Описание
              </label>
              <textarea
                value={editingEvent.description || ''}
                onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 min-h-[150px] focus:outline-none focus:border-blue-500"
                placeholder="Описание события..."
              />
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-[#1e2537]">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingEvent(null);
                }}
                className="px-4 py-2 bg-[#161b2e] hover:bg-[#1e2537] border border-[#1e2537] text-gray-300 rounded-lg transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Отмена
              </button>
              <button
                onClick={handleSaveEvent}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Сохранить
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* View Event Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setViewingEvent(null);
        }}
        title={viewingEvent?.title || ''}
        size="lg"
      >
        {viewingEvent && (
          <div className="space-y-4">
            <div className="relative h-64 overflow-hidden rounded-lg">
              <img
                src={viewingEvent.image}
                alt={viewingEvent.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                <span>{viewingEvent.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{viewingEvent.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{viewingEvent.participants} участников</span>
              </div>
              <div>
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(viewingEvent.status).color}`}>
                  {getStatusBadge(viewingEvent.status).label}
                </span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-[#1e2537]">
              <p className="text-gray-300 whitespace-pre-wrap">
                {viewingEvent.description || 'Описание события...'}
              </p>
            </div>
            
            <div className="flex justify-end pt-4 border-t border-[#1e2537]">
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  setViewingEvent(null);
                }}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                Закрыть
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
