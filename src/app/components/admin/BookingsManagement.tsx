import { useState } from 'react';
import { Search, Calendar, CheckCircle, XCircle, Clock, Edit2, Trash2, Plus, Save, X } from 'lucide-react';
import { Modal } from './Modal';

interface Booking {
  id: string;
  guestName: string;
  guestEmail: string;
  room: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  total: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  avatar: string;
}

export function BookingsManagement() {
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: '1',
      guestName: 'Иван Петров',
      guestEmail: 'ivan@mail.ru',
      room: 'Safedara Premium',
      checkIn: '15 янв 2026',
      checkOut: '20 янв 2026',
      guests: 2,
      total: 160000,
      status: 'confirmed',
      avatar: 'https://i.pravatar.cc/150?img=12'
    },
    {
      id: '2',
      guestName: 'Мария Сидорова',
      guestEmail: 'maria@gmail.com',
      room: 'Коттедж Горный',
      checkIn: '18 янв 2026',
      checkOut: '25 янв 2026',
      guests: 4,
      total: 175000,
      status: 'pending',
      avatar: 'https://i.pravatar.cc/150?img=45'
    },
    {
      id: '3',
      guestName: 'Алексей Морозов',
      guestEmail: 'alexey@inbox.ru',
      room: 'Номер Люкс',
      checkIn: '12 янв 2026',
      checkOut: '14 янв 2026',
      guests: 2,
      total: 36000,
      status: 'confirmed',
      avatar: 'https://i.pravatar.cc/150?img=33'
    },
    {
      id: '4',
      guestName: 'Ольга Николаева',
      guestEmail: 'olga@mail.com',
      room: 'Студия Комфорт',
      checkIn: '20 янв 2026',
      checkOut: '22 янв 2026',
      guests: 1,
      total: 30000,
      status: 'cancelled',
      avatar: 'https://i.pravatar.cc/150?img=20'
    },
    {
      id: '5',
      guestName: 'Дмитрий Козлов',
      guestEmail: 'dmitry@yandex.ru',
      room: 'Коттедж VIP',
      checkIn: '25 янв 2026',
      checkOut: '01 фев 2026',
      guests: 6,
      total: 315000,
      status: 'confirmed',
      avatar: 'https://i.pravatar.cc/150?img=56'
    },
    {
      id: '6',
      guestName: 'Елена Смирнова',
      guestEmail: 'elena@gmail.com',
      room: 'Номер Люкс',
      checkIn: '17 янв 2026',
      checkOut: '19 янв 2026',
      guests: 2,
      total: 36000,
      status: 'pending',
      avatar: 'https://i.pravatar.cc/150?img=47'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         booking.guestEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         booking.room.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || booking.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const cancelledCount = bookings.filter(b => b.status === 'cancelled').length;

  const stats = [
    { label: 'Всего бронирований', value: bookings.length.toString(), icon: Calendar, color: 'bg-blue-500' },
    { label: 'Подтверждено', value: confirmedCount.toString(), icon: CheckCircle, color: 'bg-green-500' },
    { label: 'Ожидание', value: pendingCount.toString(), icon: Clock, color: 'bg-yellow-500' },
    { label: 'Отменено', value: cancelledCount.toString(), icon: XCircle, color: 'bg-red-500' }
  ];

  const getStatusBadge = (status: string) => {
    const badges = {
      confirmed: { label: 'Подтверждено', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
      pending: { label: 'Ожидание', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
      cancelled: { label: 'Отменено', color: 'bg-red-500/20 text-red-400 border-red-500/30' }
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  const handleAddBooking = () => {
    const newBooking: Booking = {
      id: Date.now().toString(),
      guestName: '',
      guestEmail: '',
      room: '',
      checkIn: '',
      checkOut: '',
      guests: 1,
      total: 0,
      status: 'pending',
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
    };
    setEditingBooking(newBooking);
    setIsModalOpen(true);
  };

  const handleEditBooking = (booking: Booking) => {
    setEditingBooking({ ...booking });
    setIsModalOpen(true);
  };

  const handleSaveBooking = () => {
    if (!editingBooking) return;
    
    if (!editingBooking.guestName || !editingBooking.guestEmail || !editingBooking.room) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    if (editingBooking.id && bookings.find(b => b.id === editingBooking.id)) {
      setBookings(bookings.map(b => b.id === editingBooking.id ? editingBooking : b));
    } else {
      setBookings([...bookings, editingBooking]);
    }
    
    setIsModalOpen(false);
    setEditingBooking(null);
  };

  const handleDeleteBooking = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить это бронирование?')) {
      setBookings(bookings.filter(b => b.id !== id));
    }
  };

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

      {/* Bookings Table */}
      <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl overflow-hidden">
        {/* Table Header */}
        <div className="p-6 border-b border-[#1e2537]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-200">Все бронирования</h2>
              <p className="text-sm text-gray-400 mt-1">1 - {filteredBookings.length} из {bookings.length}</p>
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
                <option value="confirmed">Подтверждено</option>
                <option value="pending">Ожидание</option>
                <option value="cancelled">Отменено</option>
              </select>
              <button
                onClick={handleAddBooking}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Добавить бронирование
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e2537] bg-[#0d1117]">
                <th className="text-left p-4 pl-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Гость</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Номер</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Заезд</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Выезд</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Гостей</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Сумма</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Статус</th>
                <th className="text-right p-4 pr-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => {
                const statusBadge = getStatusBadge(booking.status);
                return (
                  <tr key={booking.id} className="border-b border-[#1e2537] hover:bg-[#0d1117] transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <img src={booking.avatar} alt={booking.guestName} className="w-10 h-10 rounded-full" />
                        <div>
                          <p className="text-sm font-medium text-gray-200">{booking.guestName}</p>
                          <p className="text-xs text-gray-400">{booking.guestEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-300">{booking.room}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-300">{booking.checkIn}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-300">{booking.checkOut}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-300">{booking.guests}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-semibold text-gray-200">{booking.total.toLocaleString()} смн</span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${statusBadge.color}`}>
                        {statusBadge.label}
                      </span>
                    </td>
                    <td className="p-4 pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEditBooking(booking)}
                          className="p-2 hover:bg-[#1e2537] rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4 text-gray-400" />
                        </button>
                        <button 
                          onClick={() => handleDeleteBooking(booking.id)}
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

        {/* Table Footer */}
        <div className="p-4 border-t border-[#1e2537] flex items-center justify-between bg-[#0d1117]">
          <p className="text-sm text-gray-400">Показано {filteredBookings.length} из {bookings.length}</p>
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

      {/* Add/Edit Booking Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBooking(null);
        }}
        title={editingBooking?.id && bookings.find(b => b.id === editingBooking.id) ? 'Редактировать бронирование' : 'Добавить бронирование'}
        size="lg"
      >
        {editingBooking && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Имя гостя *
              </label>
              <input
                type="text"
                value={editingBooking.guestName}
                onChange={(e) => setEditingBooking({ ...editingBooking, guestName: e.target.value })}
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
                value={editingBooking.guestEmail}
                onChange={(e) => setEditingBooking({ ...editingBooking, guestEmail: e.target.value })}
                className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                placeholder="email@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Номер/Комната *
              </label>
              <input
                type="text"
                value={editingBooking.room}
                onChange={(e) => setEditingBooking({ ...editingBooking, room: e.target.value })}
                className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                placeholder="Название номера"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Заезд
                </label>
                <input
                  type="text"
                  value={editingBooking.checkIn}
                  onChange={(e) => setEditingBooking({ ...editingBooking, checkIn: e.target.value })}
                  className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                  placeholder="15 янв 2026"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Выезд
                </label>
                <input
                  type="text"
                  value={editingBooking.checkOut}
                  onChange={(e) => setEditingBooking({ ...editingBooking, checkOut: e.target.value })}
                  className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                  placeholder="20 янв 2026"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Количество гостей
                </label>
                <input
                  type="number"
                  min="1"
                  value={editingBooking.guests}
                  onChange={(e) => setEditingBooking({ ...editingBooking, guests: parseInt(e.target.value) || 1 })}
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
                  value={editingBooking.total}
                  onChange={(e) => setEditingBooking({ ...editingBooking, total: parseInt(e.target.value) || 0 })}
                  className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Статус
              </label>
              <select
                value={editingBooking.status}
                onChange={(e) => setEditingBooking({ ...editingBooking, status: e.target.value as Booking['status'] })}
                className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
              >
                <option value="pending">Ожидание</option>
                <option value="confirmed">Подтверждено</option>
                <option value="cancelled">Отменено</option>
              </select>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-[#1e2537]">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingBooking(null);
                }}
                className="px-4 py-2 bg-[#161b2e] hover:bg-[#1e2537] border border-[#1e2537] text-gray-300 rounded-lg transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Отмена
              </button>
              <button
                onClick={handleSaveBooking}
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
