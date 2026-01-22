import { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Filter,
  Star,
  Users,
  Maximize,
  Edit2,
  Trash2,
  Eye,
  MapPin,
  Plus,
  Save
} from 'lucide-react';
import { Modal } from './Modal';

interface Hotel {
  id: string;
  name: string;
  category: string;
  rating: number;
  price: number;
  guests: number;
  area: number;
  image: string;
  status: 'free' | 'booked' | 'reserved';
  amenities: string[];
}

interface HotelsManagementProps {
  onAddClick?: () => void;
}

export function HotelsManagement({ onAddClick }: HotelsManagementProps = {}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [viewingHotel, setViewingHotel] = useState<Hotel | null>(null);

  const handleAdd = useCallback(() => {
    const newHotel: Hotel = {
      id: Date.now().toString(),
      name: '',
      category: 'Гостиницы',
      rating: 0,
      price: 0,
      guests: 2,
      area: 0,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      status: 'free',
      amenities: []
    };
    setEditingHotel(newHotel);
    setIsModalOpen(true);
  }, []);

  // Экспортируем функцию для использования из заголовка
  useEffect(() => {
    (window as any).__hotelsAddHandler = handleAdd;
    return () => {
      delete (window as any).__hotelsAddHandler;
    };
  }, [handleAdd]);

  const [hotels, setHotels] = useState<Hotel[]>([
    {
      id: '1',
      name: 'Safedara Premium',
      category: 'Гостиницы',
      rating: 4.9,
      price: 32000,
      guests: 4,
      area: 120,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      status: 'free',
      amenities: ['Wi-Fi', 'Завтрак', 'Парковка']
    },
    {
      id: '2',
      name: 'Коттедж "Горный"',
      category: 'Коттеджи',
      rating: 4.7,
      price: 25000,
      guests: 8,
      area: 96,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      status: 'booked',
      amenities: ['Бассейн', 'Wi-Fi', 'Кухня']
    },
    {
      id: '3',
      name: 'Номер Люкс',
      category: 'Гостиницы',
      rating: 4.5,
      price: 18000,
      guests: 2,
      area: 45,
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
      status: 'free',
      amenities: ['Wi-Fi', 'Завтрак']
    },
    {
      id: '4',
      name: 'Студия Комфорт',
      category: 'Гостиницы',
      rating: 4.3,
      price: 15000,
      guests: 2,
      area: 35,
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
      status: 'reserved',
      amenities: ['Wi-Fi', 'Кондиционер']
    },
    {
      id: '5',
      name: 'Семейный Коттедж',
      category: 'Коттеджи',
      rating: 4.8,
      price: 28000,
      guests: 6,
      area: 85,
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      status: 'free',
      amenities: ['Wi-Fi', 'Кухня', 'Парковка']
    },
    {
      id: '6',
      name: 'Апартаменты Делюкс',
      category: 'Гостиницы',
      rating: 4.6,
      price: 22000,
      guests: 3,
      area: 55,
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
      status: 'free',
      amenities: ['Wi-Fi', 'Завтрак', 'Балкон']
    },
    {
      id: '7',
      name: 'Коттедж VIP',
      category: 'Коттеджи',
      rating: 5.0,
      price: 45000,
      guests: 10,
      area: 150,
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      status: 'booked',
      amenities: ['Бассейн', 'Wi-Fi', 'Сауна', 'Кухня']
    },
    {
      id: '8',
      name: 'Стандарт Плюс',
      category: 'Гостиницы',
      rating: 4.2,
      price: 12000,
      guests: 2,
      area: 30,
      image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800',
      status: 'free',
      amenities: ['Wi-Fi']
    }
  ]);

  const stats = [
    { label: 'Всего', value: '5', color: 'bg-blue-500', icon: '🏨' },
    { label: 'Свободно', value: '3', color: 'bg-green-500', icon: '✅' },
    { label: 'Забронировано', value: '1', color: 'bg-yellow-500', icon: '📅' },
    { label: 'На ремонте', value: '1', color: 'bg-red-500', icon: '🔧' }
  ];

  const getStatusBadge = (status: string) => {
    const badges = {
      free: { label: 'Свободно', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
      booked: { label: 'Забронировано', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
      reserved: { label: 'На ремонте', color: 'bg-red-500/20 text-red-400 border-red-500/30' }
    };
    return badges[status as keyof typeof badges] || badges.free;
  };

  const filteredHotels = hotels.filter(hotel => {
    const matchesSearch = hotel.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || hotel.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (hotel: Hotel) => {
    setEditingHotel(hotel);
    setIsModalOpen(true);
  };

  const handleView = (hotel: Hotel) => {
    setViewingHotel(hotel);
    setIsViewModalOpen(true);
  };

  const handleSave = () => {
    if (editingHotel) {
      const updatedHotels = hotels.map(hotel => hotel.id === editingHotel.id ? editingHotel : hotel);
      setHotels(updatedHotels);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (hotelId: string) => {
    const updatedHotels = hotels.filter(hotel => hotel.id !== hotelId);
    setHotels(updatedHotels);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards - Compact */}
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
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск по названию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg pl-10 pr-4 py-2 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-blue-500"
          >
            <option value="all">Все категории</option>
            <option value="Гостиницы">Гостиницы</option>
            <option value="Коттеджи">Коттеджи</option>
          </select>

          {/* Status Filter */}
          <select className="bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-blue-500">
            <option value="all">Все статусы</option>
            <option value="free">Свободно</option>
            <option value="booked">Забронировано</option>
            <option value="reserved">На ремонте</option>
          </select>
        </div>
      </div>

      {/* Hotels Grid - 4 Columns */}
      <div className="grid grid-cols-4 gap-4">
        {filteredHotels.map((hotel) => {
          const statusBadge = getStatusBadge(hotel.status);
          return (
            <div
              key={hotel.id}
              className="bg-[#161b2e] border border-[#1e2537] rounded-xl overflow-hidden hover:border-blue-500/50 transition-all group"
            >
              {/* Image */}
              <div className="relative h-40 overflow-hidden">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {/* Status Badge */}
                <div className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-medium border ${statusBadge.color}`}>
                  {statusBadge.label}
                </div>
                {/* Rating */}
                <div className="absolute bottom-3 left-3 bg-[#0d1117]/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs font-semibold text-gray-200">{hotel.rating}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Title & Category */}
                <div className="mb-3">
                  <h3 className="text-sm font-semibold text-gray-200 mb-1">{hotel.name}</h3>
                  <p className="text-xs text-blue-400">{hotel.category}</p>
                </div>

                {/* Details */}
                <div className="flex items-center gap-3 mb-3 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>до {hotel.guests}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Maximize className="w-3 h-3" />
                    <span>{hotel.area}м²</span>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-3 pb-3 border-b border-[#1e2537]">
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-gray-200">{hotel.price.toLocaleString()}</span>
                    <span className="text-xs text-gray-400">смн</span>
                  </div>
                  <p className="text-xs text-gray-500">за ночь</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleView(hotel)}
                    className="flex-1 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    Просмотр
                  </button>
                  <button 
                    onClick={() => handleEdit(hotel)}
                    className="bg-[#0d1117] hover:bg-[#1e2537] border border-[#1e2537] text-gray-400 p-2 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={() => handleDelete(hotel.id)}
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
          Показано 1-{filteredHotels.length} из {hotels.length}
        </p>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-[#161b2e] border border-[#1e2537] hover:border-blue-500/50 text-gray-300 rounded-lg text-sm transition-colors">
            Назад
          </button>
          <button className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors">
            1
          </button>
          <button className="px-3 py-1.5 bg-[#161b2e] border border-[#1e2537] hover:border-blue-500/50 text-gray-300 rounded-lg text-sm transition-colors">
            2
          </button>
          <button className="px-3 py-1.5 bg-[#161b2e] border border-[#1e2537] hover:border-blue-500/50 text-gray-300 rounded-lg text-sm transition-colors">
            Далее
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingHotel ? 'Редактирование отеля' : 'Добавить отель'} size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Название</label>
            <input
              type="text"
              value={editingHotel?.name || ''}
              onChange={(e) => setEditingHotel(prev => prev ? { ...prev, name: e.target.value } : null)}
              className="w-full bg-[#161b2e] border border-[#1e2537] rounded-lg px-4 py-2 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Категория</label>
              <select
                value={editingHotel?.category || ''}
                onChange={(e) => setEditingHotel(prev => prev ? { ...prev, category: e.target.value } : null)}
                className="w-full bg-[#161b2e] border border-[#1e2537] rounded-lg px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-blue-500"
              >
                <option value="Гостиницы">Гостиницы</option>
                <option value="Коттеджи">Коттеджи</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Статус</label>
              <select
                value={editingHotel?.status || ''}
                onChange={(e) => setEditingHotel(prev => prev ? { ...prev, status: e.target.value as 'free' | 'booked' | 'reserved' } : null)}
                className="w-full bg-[#161b2e] border border-[#1e2537] rounded-lg px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-blue-500"
              >
                <option value="free">Свободно</option>
                <option value="booked">Забронировано</option>
                <option value="reserved">На ремонте</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Рейтинг</label>
              <input
                type="number"
                step="0.1"
                value={editingHotel?.rating || ''}
                onChange={(e) => setEditingHotel(prev => prev ? { ...prev, rating: parseFloat(e.target.value) } : null)}
                className="w-full bg-[#161b2e] border border-[#1e2537] rounded-lg px-4 py-2 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Цена (смн)</label>
              <input
                type="number"
                value={editingHotel?.price || ''}
                onChange={(e) => setEditingHotel(prev => prev ? { ...prev, price: parseInt(e.target.value) } : null)}
                className="w-full bg-[#161b2e] border border-[#1e2537] rounded-lg px-4 py-2 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Гостей</label>
              <input
                type="number"
                value={editingHotel?.guests || ''}
                onChange={(e) => setEditingHotel(prev => prev ? { ...prev, guests: parseInt(e.target.value) } : null)}
                className="w-full bg-[#161b2e] border border-[#1e2537] rounded-lg px-4 py-2 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Площадь (м²)</label>
            <input
              type="number"
              value={editingHotel?.area || ''}
              onChange={(e) => setEditingHotel(prev => prev ? { ...prev, area: parseInt(e.target.value) } : null)}
              className="w-full bg-[#161b2e] border border-[#1e2537] rounded-lg px-4 py-2 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">URL изображения</label>
            <input
              type="text"
              value={editingHotel?.image || ''}
              onChange={(e) => setEditingHotel(prev => prev ? { ...prev, image: e.target.value } : null)}
              className="w-full bg-[#161b2e] border border-[#1e2537] rounded-lg px-4 py-2 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Удобства (через запятую)</label>
            <input
              type="text"
              value={editingHotel?.amenities.join(', ') || ''}
              onChange={(e) => setEditingHotel(prev => prev ? { ...prev, amenities: e.target.value.split(', ').map(a => a.trim()) } : null)}
              className="w-full bg-[#161b2e] border border-[#1e2537] rounded-lg px-4 py-2 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#1e2537]">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2 bg-[#161b2e] hover:bg-[#1e2537] border border-[#1e2537] text-gray-300 rounded-lg transition-colors"
            >
              Отмена
            </button>
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              Сохранить
            </button>
          </div>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Информация об отеле" size="lg">
        {viewingHotel && (
          <div className="space-y-4">
            <div className="flex gap-6">
              <img
                src={viewingHotel.image}
                alt={viewingHotel.name}
                className="w-48 h-48 object-cover rounded-lg"
              />
              <div className="flex-1 space-y-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Название</p>
                  <p className="text-base font-semibold text-gray-200">{viewingHotel.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Категория</p>
                    <p className="text-sm text-gray-300">{viewingHotel.category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Статус</p>
                    <span className={`inline-flex px-2 py-1 rounded text-xs ${getStatusBadge(viewingHotel.status).color}`}>
                      {getStatusBadge(viewingHotel.status).label}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Рейтинг</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm text-gray-300">{viewingHotel.rating}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Цена</p>
                    <p className="text-sm text-gray-300">{viewingHotel.price.toLocaleString()} смн</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Гостей</p>
                    <p className="text-sm text-gray-300">до {viewingHotel.guests}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Площадь</p>
                  <p className="text-sm text-gray-300">{viewingHotel.area} м²</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-2">Удобства</p>
              <div className="flex flex-wrap gap-2">
                {viewingHotel.amenities.map((amenity, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-lg text-xs">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}