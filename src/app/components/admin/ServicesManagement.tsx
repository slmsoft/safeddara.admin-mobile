import { useState, useEffect, useCallback } from 'react';
import { Search, Briefcase, DollarSign, Users, TrendingUp, Edit2, Trash2, Eye, Save, Plus } from 'lucide-react';
import { Modal } from './Modal';

interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: string;
  bookings: number;
  image: string;
  status: 'active' | 'inactive';
  rating: number;
}

export function ServicesManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [viewingService, setViewingService] = useState<Service | null>(null);

  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      name: 'Лыжи горные',
      category: 'Аренда снаряжения',
      price: 5000,
      duration: '1 день',
      bookings: 156,
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800',
      status: 'active',
      rating: 4.8
    },
    {
      id: '2',
      name: 'Сноуборд',
      category: 'Аренда снаряжения',
      price: 4500,
      duration: '1 день',
      bookings: 134,
      image: 'https://images.unsplash.com/photo-1519315901367-a16c76c64e46?w=800',
      status: 'active',
      rating: 4.7
    },
    {
      id: '3',
      name: 'Инструктор по лыжам',
      category: 'Обучение',
      price: 15000,
      duration: '2 часа',
      bookings: 89,
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800',
      status: 'active',
      rating: 4.9
    },
    {
      id: '4',
      name: 'Шлем защитный',
      category: 'Аренда снаряжения',
      price: 1000,
      duration: '1 день',
      bookings: 201,
      image: 'https://images.unsplash.com/photo-1509396591411-549e1e7e2aa1?w=800',
      status: 'active',
      rating: 4.6
    },
    {
      id: '5',
      name: 'Подъемник (1 день)',
      category: 'Ski-pass',
      price: 8000,
      duration: '1 день',
      bookings: 324,
      image: 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=800',
      status: 'active',
      rating: 4.9
    },
    {
      id: '6',
      name: 'Массаж спортивный',
      category: 'СПА',
      price: 12000,
      duration: '1 час',
      bookings: 67,
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800',
      status: 'active',
      rating: 4.8
    },
    {
      id: '7',
      name: 'Фотосессия на склоне',
      category: 'Дополнительно',
      price: 20000,
      duration: '1 час',
      bookings: 45,
      image: 'https://images.unsplash.com/photo-1486673748761-cdb2f0f5314c?w=800',
      status: 'active',
      rating: 5.0
    },
    {
      id: '8',
      name: 'Парковка VIP',
      category: 'Дополнительно',
      price: 3000,
      duration: '1 день',
      bookings: 112,
      image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800',
      status: 'active',
      rating: 4.5
    }
  ]);

  const stats = [
    { label: 'Всего услуг', value: '24', color: 'bg-blue-500', icon: '🎿' },
    { label: 'Активных', value: '18', color: 'bg-green-500', icon: '✅' },
    { label: 'Заказов сегодня', value: '67', color: 'bg-purple-500', icon: '📊' },
    { label: 'Доход за месяц', value: '892K', color: 'bg-orange-500', icon: '💰' }
  ];

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleView = (service: Service) => {
    setViewingService(service);
    setIsViewModalOpen(true);
  };

  const handleSave = () => {
    if (editingService) {
      const updatedServices = services.map(service => {
        if (service.id === editingService.id) {
          return editingService;
        }
        return service;
      });
      setServices(updatedServices);
    }
    setIsModalOpen(false);
  };

  const handleAdd = useCallback(() => {
    const newService: Service = {
      id: (services.length + 1).toString(),
      name: '',
      category: '',
      price: 0,
      duration: '',
      bookings: 0,
      image: '',
      status: 'active',
      rating: 0
    };
    setEditingService(newService);
    setIsModalOpen(true);
  }, [services.length]);

  // Экспортируем функцию для использования из заголовка
  useEffect(() => {
    (window as any).__servicesAddHandler = handleAdd;
    return () => {
      delete (window as any).__servicesAddHandler;
    };
  }, [handleAdd]);

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
              placeholder="Поиск услуг..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg pl-10 pr-4 py-2 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-blue-500"
          >
            <option value="all">Все категории</option>
            <option value="Аренда снаряжения">Аренда снаряжения</option>
            <option value="Обучение">Обучение</option>
            <option value="Ski-pass">Ski-pass</option>
            <option value="СПА">СПА</option>
            <option value="Дополнительно">Дополнительно</option>
          </select>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-4 gap-4">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="bg-[#161b2e] border border-[#1e2537] rounded-xl overflow-hidden hover:border-blue-500/50 transition-all group"
          >
            {/* Image */}
            <div className="relative h-40 overflow-hidden">
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute top-3 right-3 bg-green-500/20 border border-green-500/30 text-green-400 px-2 py-1 rounded-lg text-xs font-medium">
                Активно
              </div>
              <div className="absolute bottom-3 left-3 bg-[#0d1117]/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                <span className="text-yellow-400 text-xs">★</span>
                <span className="text-xs font-semibold text-gray-200">{service.rating}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-gray-200 mb-1">{service.name}</h3>
                <p className="text-xs text-blue-400">{service.category}</p>
              </div>

              <div className="flex items-center gap-3 mb-3 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{service.bookings} заказов</span>
                </div>
              </div>

              <div className="mb-3 pb-3 border-b border-[#1e2537]">
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-gray-200">{service.price.toLocaleString()}</span>
                  <span className="text-xs text-gray-400">смн</span>
                </div>
                <p className="text-xs text-gray-500">{service.duration}</p>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleView(service)}
                  className="flex-1 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <Eye className="w-3 h-3" />
                  Просмотр
                </button>
                <button 
                  onClick={() => handleEdit(service)}
                  className="bg-[#0d1117] hover:bg-[#1e2537] border border-[#1e2537] text-gray-400 p-2 rounded-lg transition-colors"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <button 
                  onClick={() => {
                    if (confirm('Удалить эту услугу?')) {
                      setServices(services.filter(s => s.id !== service.id));
                    }
                  }}
                  className="bg-[#0d1117] hover:bg-red-500/10 border border-[#1e2537] hover:border-red-500/30 text-gray-400 hover:text-red-400 p-2 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          Показано 1-{filteredServices.length} из {services.length}
        </p>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-[#161b2e] border border-[#1e2537] hover:border-blue-500/50 text-gray-300 rounded-lg text-sm transition-colors">
            Назад
          </button>
          <button className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors">
            1
          </button>
          <button className="px-3 py-1.5 bg-[#161b2e] border border-[#1e2537] hover:border-blue-500/50 text-gray-300 rounded-lg text-sm transition-colors">
            Далее
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-4">
          <h3 className="text-xl font-bold text-gray-200 mb-4">Редактирование услуги</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="text-sm text-gray-400">Название:</label>
              <input
                type="text"
                value={editingService?.name || ''}
                onChange={(e) => setEditingService({ ...editingService!, name: e.target.value })}
                className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm text-gray-400">Категория:</label>
              <select
                value={editingService?.category || ''}
                onChange={(e) => setEditingService({ ...editingService!, category: e.target.value })}
                className="bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-blue-500"
              >
                <option value="Аренда снаряжения">Аренда снаряжения</option>
                <option value="Обучение">Обучение</option>
                <option value="Ski-pass">Ski-pass</option>
                <option value="СПА">СПА</option>
                <option value="Дополнительно">Дополнительно</option>
              </select>
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm text-gray-400">Цена:</label>
              <input
                type="number"
                value={editingService?.price || 0}
                onChange={(e) => setEditingService({ ...editingService!, price: parseInt(e.target.value) })}
                className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm text-gray-400">Длительность:</label>
              <input
                type="text"
                value={editingService?.duration || ''}
                onChange={(e) => setEditingService({ ...editingService!, duration: e.target.value })}
                className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm text-gray-400">Количество заказов:</label>
              <input
                type="number"
                value={editingService?.bookings || 0}
                onChange={(e) => setEditingService({ ...editingService!, bookings: parseInt(e.target.value) })}
                className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm text-gray-400">Изображение:</label>
              <input
                type="text"
                value={editingService?.image || ''}
                onChange={(e) => setEditingService({ ...editingService!, image: e.target.value })}
                className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm text-gray-400">Статус:</label>
              <select
                value={editingService?.status || 'active'}
                onChange={(e) => setEditingService({ ...editingService!, status: e.target.value as 'active' | 'inactive' })}
                className="bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-blue-500"
              >
                <option value="active">Активно</option>
                <option value="inactive">Неактивно</option>
              </select>
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm text-gray-400">Рейтинг:</label>
              <input
                type="number"
                value={editingService?.rating || 0}
                onChange={(e) => setEditingService({ ...editingService!, rating: parseFloat(e.target.value) })}
                className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm px-4 py-2 transition-colors" onClick={handleSave}>
              Сохранить
            </button>
          </div>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)}>
        <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-4">
          <h3 className="text-xl font-bold text-gray-200 mb-4">Просмотр услуги</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="text-sm text-gray-400">Название:</label>
              <p className="text-sm text-gray-300">{viewingService?.name || ''}</p>
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm text-gray-400">Категория:</label>
              <p className="text-sm text-gray-300">{viewingService?.category || ''}</p>
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm text-gray-400">Цена:</label>
              <p className="text-sm text-gray-300">{viewingService?.price || 0}</p>
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm text-gray-400">Длительность:</label>
              <p className="text-sm text-gray-300">{viewingService?.duration || ''}</p>
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm text-gray-400">Количество заказов:</label>
              <p className="text-sm text-gray-300">{viewingService?.bookings || 0}</p>
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm text-gray-400">Изображение:</label>
              <p className="text-sm text-gray-300">{viewingService?.image || ''}</p>
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm text-gray-400">Статус:</label>
              <p className="text-sm text-gray-300">{viewingService?.status || ''}</p>
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm text-gray-400">Рейтинг:</label>
              <p className="text-sm text-gray-300">{viewingService?.rating || 0}</p>
            </div>
          </div>
        </div>
      </Modal>

      {/* Add Button */}
      <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm px-4 py-2 transition-colors" onClick={handleAdd}>
        <Plus className="w-4 h-4" />
        Добавить услугу
      </button>
    </div>
  );
}