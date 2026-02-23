import { useState, useEffect, useCallback } from 'react';
import { Search, ShoppingCart, Package, CheckCircle, XCircle, Clock, Edit2, Trash2, Plus, Save, X } from 'lucide-react';
import { Modal } from './Modal';
import { adminApi } from '../../../api/backendApi';

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: string;
  quantity: number;
  total: number;
  date: string;
  status: 'completed' | 'processing' | 'cancelled';
  avatar: string;
  dateSort?: string;
}

function mapSafeddaraStatus(s: string): 'completed' | 'processing' | 'cancelled' {
  if (['confirmed', 'payment_paid'].includes(s)) return 'completed';
  if (['canceled', 'payment_failed'].includes(s)) return 'cancelled';
  return 'processing';
}

function formatOrderDate(d: string) {
  try {
    return new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return d;
  }
}

export function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const merged: Order[] = [];
      const [safeddaraRes, bookingsRes] = await Promise.all([
        adminApi.safeddara.orders().catch(() => ({ success: false, data: { orders: [] } })),
        adminApi.bookings.list().catch(() => ({ success: false, data: { bookings: [] } })),
      ]);
      if (safeddaraRes.success && safeddaraRes.data?.orders) {
        merged.push(...safeddaraRes.data.orders.map((o: any) => ({
          id: `safeddara-${o.id}`,
          customerName: o.customerName || '—',
          customerEmail: o.customerEmail || '—',
          items: o.orderType || 'Заказ',
          quantity: 1,
          total: 0,
          date: formatOrderDate(o.createdAt || o.startDate),
          dateSort: o.createdAt || o.startDate || '',
          status: mapSafeddaraStatus(o.status || ''),
          avatar: `https://i.pravatar.cc/150?u=${o.userId}`,
        })));
      }
      if (bookingsRes.success && bookingsRes.data?.bookings) {
        merged.push(...bookingsRes.data.bookings.map((b: any) => ({
          id: `booking-${b.id}`,
          customerName: b.guestName || '—',
          customerEmail: b.guestEmail || '—',
          items: b.accommodation?.title || 'Бронирование',
          quantity: b.guests || 1,
          total: b.totalPrice || 0,
          date: formatOrderDate(b.checkIn || b.createdAt),
          dateSort: b.checkIn || b.createdAt || '',
          status: (b.status === 'confirmed' ? 'completed' : b.status === 'cancelled' ? 'cancelled' : 'processing') as Order['status'],
          avatar: `https://i.pravatar.cc/150?u=${b.userId}`,
        })));
      }
      merged.sort((a, b) => (b as any).dateSort.localeCompare((a as any).dateSort));
      setOrders(merged);
    } catch (e) {
      console.error('Load orders:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.items.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const completedCount = orders.filter(o => o.status === 'completed').length;
  const processingCount = orders.filter(o => o.status === 'processing').length;
  const cancelledCount = orders.filter(o => o.status === 'cancelled').length;

  const stats = [
    { label: 'Всего заказов', value: orders.length.toString(), icon: ShoppingCart, color: 'bg-blue-500' },
    { label: 'Выполнено', value: completedCount.toString(), icon: CheckCircle, color: 'bg-green-500' },
    { label: 'В обработке', value: processingCount.toString(), icon: Clock, color: 'bg-yellow-500' },
    { label: 'Отменено', value: cancelledCount.toString(), icon: XCircle, color: 'bg-red-500' }
  ];

  const getStatusBadge = (status: string) => {
    const badges = {
      completed: { label: 'Выполнен', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
      processing: { label: 'Обработка', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
      cancelled: { label: 'Отменён', color: 'bg-red-500/20 text-red-400 border-red-500/30' }
    };
    return badges[status as keyof typeof badges] || badges.processing;
  };

  const handleAddOrder = () => {
    const newOrder: Order = {
      id: Date.now().toString(),
      customerName: '',
      customerEmail: '',
      items: '',
      quantity: 1,
      total: 0,
      date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'processing',
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
    };
    setEditingOrder(newOrder);
    setIsModalOpen(true);
  };

  const handleEditOrder = (order: Order) => {
    setEditingOrder({ ...order });
    setIsModalOpen(true);
  };

  const handleSaveOrder = () => {
    if (!editingOrder) return;
    
    if (!editingOrder.customerName || !editingOrder.customerEmail || !editingOrder.items) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    if (editingOrder.id && orders.find(o => o.id === editingOrder.id)) {
      setOrders(orders.map(o => o.id === editingOrder.id ? editingOrder : o));
    } else {
      setOrders([...orders, editingOrder]);
    }
    
    setIsModalOpen(false);
    setEditingOrder(null);
  };

  const handleDeleteOrder = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот заказ?')) {
      setOrders(orders.filter(o => o.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`${stat.color} w-10 h-10 rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-gray-400 text-xs mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-200">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl overflow-hidden">
        <div className="p-6 border-b border-[#1e2537]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-200">Все заказы</h2>
              <p className="text-sm text-gray-400 mt-1">1 - {filteredOrders.length} из {orders.length}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 bg-[#0d1117] border border-[#1e2537] rounded-lg pl-10 pr-4 py-2 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-blue-500"
              >
                <option value="all">Все статусы</option>
                <option value="completed">Выполнено</option>
                <option value="processing">Обработка</option>
                <option value="cancelled">Отменено</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e2537] bg-[#0d1117]">
                <th className="text-left p-4 pl-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Клиент</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Товары</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Кол-во</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Сумма</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Дата</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Статус</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const statusBadge = getStatusBadge(order.status);
                return (
                  <tr key={order.id} className="border-b border-[#1e2537] hover:bg-[#0d1117] transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <img src={order.avatar} alt={order.customerName} className="w-10 h-10 rounded-full" />
                        <div>
                          <p className="text-sm font-medium text-gray-200">{order.customerName}</p>
                          <p className="text-xs text-gray-400">{order.customerEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-300">{order.items}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-300">{order.quantity}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-semibold text-gray-200">{order.total.toLocaleString()} смн</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-300">{order.date}</span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${statusBadge.color}`}>
                        {statusBadge.label}
                      </span>
                    </td>
                    <td className="p-4 pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEditOrder(order)}
                          className="p-2 hover:bg-[#1e2537] rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4 text-gray-400" />
                        </button>
                        <button 
                          onClick={() => handleDeleteOrder(order.id)}
                          className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-[#1e2537] flex items-center justify-between bg-[#0d1117]">
          <p className="text-sm text-gray-400">Показано {filteredOrders.length} из {orders.length}</p>
          <div className="flex gap-2">
            <button disabled className="px-3 py-1.5 bg-[#161b2e] border border-[#1e2537] text-gray-500 rounded-lg text-sm cursor-not-allowed">
              Назад
            </button>
            <button disabled className="px-3 py-1.5 bg-[#161b2e] border border-[#1e2537] text-gray-500 rounded-lg text-sm cursor-not-allowed">
              Далее
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit Order Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingOrder(null);
        }}
        title={editingOrder?.id && orders.find(o => o.id === editingOrder.id) ? 'Редактировать заказ' : 'Добавить заказ'}
        size="lg"
      >
        {editingOrder && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Имя клиента *
              </label>
              <input
                type="text"
                value={editingOrder.customerName}
                onChange={(e) => setEditingOrder({ ...editingOrder, customerName: e.target.value })}
                className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                placeholder="Введите имя"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={editingOrder.customerEmail}
                onChange={(e) => setEditingOrder({ ...editingOrder, customerEmail: e.target.value })}
                className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                placeholder="email@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Товары/Услуги *
              </label>
              <input
                type="text"
                value={editingOrder.items}
                onChange={(e) => setEditingOrder({ ...editingOrder, items: e.target.value })}
                className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                placeholder="Описание товаров или услуг"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Количество
                </label>
                <input
                  type="number"
                  min="1"
                  value={editingOrder.quantity}
                  onChange={(e) => setEditingOrder({ ...editingOrder, quantity: parseInt(e.target.value) || 1 })}
                  className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Сумма (смн)
                </label>
                <input
                  type="number"
                  min="0"
                  value={editingOrder.total}
                  onChange={(e) => setEditingOrder({ ...editingOrder, total: parseInt(e.target.value) || 0 })}
                  className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Дата
              </label>
              <input
                type="text"
                value={editingOrder.date}
                onChange={(e) => setEditingOrder({ ...editingOrder, date: e.target.value })}
                className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                placeholder="12 янв 2026"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Статус
              </label>
              <select
                value={editingOrder.status}
                onChange={(e) => setEditingOrder({ ...editingOrder, status: e.target.value as Order['status'] })}
                className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
              >
                <option value="processing">Обработка</option>
                <option value="completed">Выполнен</option>
                <option value="cancelled">Отменён</option>
              </select>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-[#1e2537]">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingOrder(null);
                }}
                className="px-4 py-2 bg-[#161b2e] hover:bg-[#1e2537] border border-[#1e2537] text-gray-300 rounded-lg transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Отмена
              </button>
              <button
                onClick={handleSaveOrder}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Сохранить
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
