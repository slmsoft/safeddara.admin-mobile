import { useState, useEffect, useCallback } from 'react';
import { Search, UtensilsCrossed, Star, Clock, Edit2, Trash2, Eye, Plus, Save, X } from 'lucide-react';
import { Modal } from './Modal';

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  prepTime: string;
  orders: number;
  image: string;
  status: 'available' | 'unavailable';
  rating: number;
}

export function RestaurantManagement() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: '1',
      name: 'Плов таджикский',
      category: 'Основные блюда',
      price: 3500,
      prepTime: '30 мин',
      orders: 245,
      image: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=800',
      status: 'available',
      rating: 4.9
    },
    {
      id: '2',
      name: 'Шашлык из баранины',
      category: 'Гриль',
      price: 4500,
      prepTime: '25 мин',
      orders: 198,
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
      status: 'available',
      rating: 4.8
    },
    {
      id: '3',
      name: 'Лагман',
      category: 'Супы',
      price: 2500,
      prepTime: '20 мин',
      orders: 167,
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
      status: 'available',
      rating: 4.7
    },
    {
      id: '4',
      name: 'Самса с мясом',
      category: 'Выпечка',
      price: 800,
      prepTime: '15 мин',
      orders: 312,
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800',
      status: 'available',
      rating: 4.6
    },
    {
      id: '5',
      name: 'Манты',
      category: 'Основные блюда',
      price: 3000,
      prepTime: '35 мин',
      orders: 201,
      image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800',
      status: 'available',
      rating: 4.9
    },
    {
      id: '6',
      name: 'Чай зеленый',
      category: 'Напитки',
      price: 500,
      prepTime: '5 мин',
      orders: 456,
      image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800',
      status: 'available',
      rating: 4.5
    },
    {
      id: '7',
      name: 'Халва',
      category: 'Десерты',
      price: 1200,
      prepTime: '10 мин',
      orders: 134,
      image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800',
      status: 'available',
      rating: 4.7
    },
    {
      id: '8',
      name: 'Салат "Ачичук"',
      category: 'Салаты',
      price: 1500,
      prepTime: '10 мин',
      orders: 189,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
      status: 'available',
      rating: 4.6
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [viewingItem, setViewingItem] = useState<MenuItem | null>(null);

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const availableCount = menuItems.filter(m => m.status === 'available').length;
  const totalOrders = menuItems.reduce((sum, m) => sum + m.orders, 0);
  const totalRevenue = menuItems.reduce((sum, m) => sum + (m.price * m.orders), 0);

  const stats = [
    { label: 'Всего блюд', value: menuItems.length.toString(), color: 'bg-orange-500', icon: '🍽️' },
    { label: 'Доступно', value: availableCount.toString(), color: 'bg-green-500', icon: '✅' },
    { label: 'Заказов', value: totalOrders.toString(), color: 'bg-blue-500', icon: '📋' },
    { label: 'Доход', value: `${(totalRevenue / 1000).toFixed(0)}K`, color: 'bg-purple-500', icon: '💰' }
  ];

  const handleAddItem = useCallback(() => {
    const newItem: MenuItem = {
      id: Date.now().toString(),
      name: '',
      category: 'Основные блюда',
      price: 0,
      prepTime: '0 мин',
      orders: 0,
      image: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=800',
      status: 'available',
      rating: 0
    };
    setEditingItem(newItem);
    setIsModalOpen(true);
  }, []);

  // Экспортируем функцию для использования из заголовка
  useEffect(() => {
    (window as any).__restaurantAddHandler = handleAddItem;
    return () => {
      delete (window as any).__restaurantAddHandler;
    };
  }, [handleAddItem]);

  const handleEditItem = (item: MenuItem) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleViewItem = (item: MenuItem) => {
    setViewingItem(item);
    setIsViewModalOpen(true);
  };

  const handleSaveItem = () => {
    if (!editingItem) return;
    
    if (!editingItem.name || editingItem.price <= 0) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    if (editingItem.id && menuItems.find(m => m.id === editingItem.id)) {
      setMenuItems(menuItems.map(m => m.id === editingItem.id ? editingItem : m));
    } else {
      setMenuItems([...menuItems, editingItem]);
    }
    
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить это блюдо?')) {
      setMenuItems(menuItems.filter(m => m.id !== id));
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
              placeholder="Поиск блюд..."
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
            <option value="Основные блюда">Основные блюда</option>
            <option value="Гриль">Гриль</option>
            <option value="Супы">Супы</option>
            <option value="Салаты">Салаты</option>
            <option value="Выпечка">Выпечка</option>
            <option value="Десерты">Десерты</option>
            <option value="Напитки">Напитки</option>
          </select>
          <button
            onClick={handleAddItem}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Добавить блюдо
          </button>
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-4 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-[#161b2e] border border-[#1e2537] rounded-xl overflow-hidden hover:border-blue-500/50 transition-all group"
          >
            {/* Image */}
            <div className="relative h-40 overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute top-3 right-3 bg-green-500/20 border border-green-500/30 text-green-400 px-2 py-1 rounded-lg text-xs font-medium">
                В наличии
              </div>
              <div className="absolute bottom-3 left-3 bg-[#0d1117]/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-semibold text-gray-200">{item.rating}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-gray-200 mb-1">{item.name}</h3>
                <p className="text-xs text-orange-400">{item.category}</p>
              </div>

              <div className="flex items-center gap-3 mb-3 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{item.prepTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <UtensilsCrossed className="w-3 h-3" />
                  <span>{item.orders} заказов</span>
                </div>
              </div>

              <div className="mb-3 pb-3 border-b border-[#1e2537]">
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-gray-200">{item.price.toLocaleString()}</span>
                  <span className="text-xs text-gray-400">смн</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleViewItem(item)}
                  className="flex-1 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <Eye className="w-3 h-3" />
                  Просмотр
                </button>
                <button 
                  onClick={() => handleEditItem(item)}
                  className="bg-[#0d1117] hover:bg-[#1e2537] border border-[#1e2537] text-gray-400 p-2 rounded-lg transition-colors"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <button 
                  onClick={() => handleDeleteItem(item.id)}
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
          Показано 1-{filteredItems.length} из {menuItems.length}
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

      {/* Add/Edit Item Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        title={editingItem?.id && menuItems.find(m => m.id === editingItem.id) ? 'Редактировать блюдо' : 'Добавить блюдо'}
        size="lg"
      >
        {editingItem && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Название блюда *
              </label>
              <input
                type="text"
                value={editingItem.name}
                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
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
                  value={editingItem.category}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                  className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="Основные блюда">Основные блюда</option>
                  <option value="Гриль">Гриль</option>
                  <option value="Супы">Супы</option>
                  <option value="Салаты">Салаты</option>
                  <option value="Выпечка">Выпечка</option>
                  <option value="Десерты">Десерты</option>
                  <option value="Напитки">Напитки</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Цена (смн) *
                </label>
                <input
                  type="number"
                  min="0"
                  value={editingItem.price}
                  onChange={(e) => setEditingItem({ ...editingItem, price: parseInt(e.target.value) || 0 })}
                  className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Время приготовления
                </label>
                <input
                  type="text"
                  value={editingItem.prepTime}
                  onChange={(e) => setEditingItem({ ...editingItem, prepTime: e.target.value })}
                  className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                  placeholder="30 мин"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Рейтинг
                </label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={editingItem.rating}
                  onChange={(e) => setEditingItem({ ...editingItem, rating: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                URL изображения
              </label>
              <input
                type="text"
                value={editingItem.image}
                onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                placeholder="https://..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Статус
              </label>
              <select
                value={editingItem.status}
                onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value as MenuItem['status'] })}
                className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
              >
                <option value="available">В наличии</option>
                <option value="unavailable">Недоступно</option>
              </select>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-[#1e2537]">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingItem(null);
                }}
                className="px-4 py-2 bg-[#161b2e] hover:bg-[#1e2537] border border-[#1e2537] text-gray-300 rounded-lg transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Отмена
              </button>
              <button
                onClick={handleSaveItem}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Сохранить
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* View Item Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setViewingItem(null);
        }}
        title={viewingItem?.name || ''}
        size="lg"
      >
        {viewingItem && (
          <div className="space-y-4">
            <div className="relative h-64 overflow-hidden rounded-lg">
              <img
                src={viewingItem.image}
                alt={viewingItem.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Категория:</span>
                <p className="text-gray-200 font-medium">{viewingItem.category}</p>
              </div>
              <div>
                <span className="text-gray-400">Цена:</span>
                <p className="text-gray-200 font-medium">{viewingItem.price.toLocaleString()} смн</p>
              </div>
              <div>
                <span className="text-gray-400">Время приготовления:</span>
                <p className="text-gray-200 font-medium">{viewingItem.prepTime}</p>
              </div>
              <div>
                <span className="text-gray-400">Рейтинг:</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <p className="text-gray-200 font-medium">{viewingItem.rating}</p>
                </div>
              </div>
              <div>
                <span className="text-gray-400">Заказов:</span>
                <p className="text-gray-200 font-medium">{viewingItem.orders}</p>
              </div>
              <div>
                <span className="text-gray-400">Статус:</span>
                <p className={`font-medium ${viewingItem.status === 'available' ? 'text-green-400' : 'text-red-400'}`}>
                  {viewingItem.status === 'available' ? 'В наличии' : 'Недоступно'}
                </p>
              </div>
            </div>
            
            <div className="flex justify-end pt-4 border-t border-[#1e2537]">
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  setViewingItem(null);
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
